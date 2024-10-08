import uvicorn
import logging
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import httpx
from bs4 import BeautifulSoup
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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

@app.get("/healthcheck")
async def healthcheck():
    logger.info("Health check requested.")
    return JSONResponse(content={"status": "healthy"})

@app.post("/scrape")
async def scrape(request: ScraperRequest):
    logger.info(f"Scrape request received: {request}")
    results = {}

    async with httpx.AsyncClient() as client:
        for keyword in request.keywords: 
            logger.info(f"Scraping keyword: {keyword}")
            keyword_results = []
            page = request.page if request.page > 0 else 1
            
            for p in range(1, page + 1):
                url = f"https://community.atlassian.com/t5/forums/searchpage/tab/message?q={keyword}&page={p}&sort_by=-topicPostDate&collapse_discussion=true&search_type=thread"
                logger.info(f"Fetching URL: {url}")
                response = await client.get(url)
                
                if response.status_code == 200:
                    logger.info(f"Successfully fetched page {p} for keyword '{keyword}'.")
                    soup = BeautifulSoup(response.content, 'html.parser')
                    threads = soup.find_all('li', class_='atl-post-list__tile')
                    
                    for thread in threads:
                        h3 = thread.find('h3', class_='atl-post-list__tile__title')
                        if h3 and h3.find('a'):
                            a = f"https://community.atlassian.com{h3.find('a')['href']}"
                            metric = thread.find_all('span', class_='atl-post-metric')[-1]
                            date_span = metric.find_all('span', attrs={'data-tooltip': True})[-1]
                            date = date_span['data-tooltip']
                            dateValue = date_span.text.strip()
                            keyword_results.append({"title": h3.text.strip(), "link": a, "date": date, "dateValue": dateValue})
                    logger.info(f"Found {len(threads)} threads for keyword '{keyword}' on page {p}.")
                else:
                    logger.error(f"Failed to retrieve page {p} for keyword '{keyword}'. Status code: {response.status_code}")
                    keyword_results.append({"error": f"Failed to retrieve page {p} for keyword '{keyword}'. Status code: {response.status_code}"})
                    
            results[keyword] = keyword_results
            logger.info(f"Completed scraping for keyword: {keyword}")

    logger.info("Scraping completed for all keywords.")
    return JSONResponse(content=results)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001, reload=True)


# uvicorn app.server:app --host 0.0.0.0 --port 3001 --reload
