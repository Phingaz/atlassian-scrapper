import os
from dotenv import load_dotenv
import uvicorn
import asyncio
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from app.logger import logger
from pydantic import BaseModel
from app.utils import perform_scraping
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
rss_enabled = os.getenv("RSS_ENABLED", "false").lower() == "true"


class ScraperRequest(BaseModel):
    page: int
    keywords: List[str]

app = FastAPI()

origins = [
     "http://localhost:3000",
     "https://atlassian-scrapper.pnoya.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

feeds = []

@app.get("/healthcheck")
async def healthcheck():
    logger.info("Health check requested.")
    return JSONResponse(content={"status": "healthy"})

@app.post("/scrape")
async def scrape(request: ScraperRequest):
    logger.info(f"Scrape request received: {request}")
    results = await perform_scraping(request.keywords, request.page, feeds)
    return JSONResponse(content=results)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    if not rss_enabled:
        await websocket.close(code=1008)  # Close connection with a WebSocket status code
        logger.warning("WebSocket connection rejected: RSS feature is disabled.")
        return
    
    await websocket.accept()
    logger.info(f"Client connected. {websocket.client}")

    try:
        while True:
            data = await websocket.receive_text()
            try:
                interval = int(data)
                if not (5 <= interval <= 30):
                    raise ValueError
            except ValueError:
                await websocket.send_text("Please provide a number between 5 and 30.")
                continue

            await websocket.send_text(f"Results will be updated every {interval} minutes.")

            async def periodic_fetch():
                while True:
                    results = []
                    for feed in feeds:
                        result = await fetch_feed(feed)  # Replace with actual fetch function
                        if result:
                            results.append(result)
                    await websocket.send_text(f"Fetched data from feeds: {results}")
                    print(f"Fetched data from feeds: {results}")
                    await asyncio.sleep(interval * 60)  # Use provided interval

            fetch_task = asyncio.create_task(periodic_fetch())

            try:
                while True:  # Keep connection open
                    await asyncio.sleep(1)
            except WebSocketDisconnect:
                fetch_task.cancel()
                logger.info("Client disconnected.")
                break

    except WebSocketDisconnect:
        logger.info("Client disconnected.")
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001, reload=True)
