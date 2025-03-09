import httpx
from bs4 import BeautifulSoup
from app.logger import logger
from typing import List, Dict, Any

async def perform_scraping(keywords: List[str], page: int, feeds: [str]) -> Dict[str, Any]:
    results = {}
    async with httpx.AsyncClient(follow_redirects=True) as client:
        for keyword in keywords:
            logger.info(f"Scraping keyword: {keyword}")
            keyword_results = []
            page = page if page > 0 else 1
            
            for p in range(1, page + 1):
                url = f"https://community.atlassian.com/t5/forums/searchpage/tab/message?q={keyword}&page={p}&sort_by=-topicPostDate&collapse_discussion=true&search_type=thread"
                logger.info(f"Fetching URL: {url}")
                response = await client.get(url)
                
                if response.status_code == 200:
                    logger.info(f"Successfully fetched page {p} for keyword '{keyword}'.")
                    soup = BeautifulSoup(response.content, 'html.parser')
                    threads = soup.find_all('li', class_='atl-post-list__tile')
                    rsss = soup.find_all('div', class_='atl-search-subscribe__rss')
                    
                    for rss in rsss:
                        input = rss.find('input')['value']
                        logger.info(f"Found RSS feed for keyword: {input}")
                        feeds.append(input)
                    
                    for thread in threads:
                        h3 = thread.find('h3', class_='atl-post-list__tile__title')
                        if h3 and h3.find('a'):
                            a = f"https://community.atlassian.com{h3.find('a')['href']}"
                            metric = thread.find_all('span', class_='atl-post-metric')[-1]
                            date_span = metric.find_all('span', attrs={'data-tooltip': True})[-1]
                            date = date_span['data-tooltip']
                            date_value = date_span.text.strip()
                            keyword_results.append({"title": h3.text.strip(), "link": a, "date": date, "dateValue": date_value})
                    logger.info(f"Found {len(threads)} threads for keyword '{keyword}' on page {p}.")
                else:
                    logger.error(f"Failed to retrieve page {p} for keyword '{keyword}'. Status code: {response.status_code}")
                    keyword_results.append({"error": f"Failed to retrieve page {p} for keyword '{keyword}'. Status code: {response.status_code}"})
                    
            results[keyword] = keyword_results
            logger.info(f"Completed scraping for keyword: {keyword}")

    logger.info("Scraping completed for all keywords.")
    return results
