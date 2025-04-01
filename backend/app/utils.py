import aiohttp
import asyncio
import json
import pandas as pd
from datetime import datetime

SOURCE_A_URL = "https://raw.githubusercontent.com/harshitgupta1998/Narravance/dev/sourceA.json"
SOURCE_B_URL = "https://raw.githubusercontent.com/harshitgupta1998/Narravance/dev/source_b.csv"

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except:
        return None

def filter_record(rec, filters):
    start = parse_date(filters["start_date"])
    end = parse_date(filters["end_date"])
    rec_date = parse_date(rec["date_detected"])
    if not (start <= rec_date <= end):
        return False
    if filters["severity_levels"] and rec["severity_level"] not in filters["severity_levels"]:
        return False
    if filters["platforms"] and rec["platform"] not in filters["platforms"]:
        return False
    return True

async def fetch_json(session, url):
    async with session.get(url) as resp:
        return await resp.json()

async def fetch_csv(session, url):
    async with session.get(url) as resp:
        text = await resp.text()
        return pd.read_csv(pd.compat.StringIO(text)).to_dict(orient="records")

async def get_data_from_sources():
    async with aiohttp.ClientSession() as session:
        source_a, source_b = await asyncio.gather(
            fetch_json(session, SOURCE_A_URL),
            fetch_csv(session, SOURCE_B_URL)
        )

        # Normalize Source A
        normalized_a = [{
            "platform": r["platform"],
            "narrative": r["narrative"],
            "date_detected": r["date_detected"],
            "severity_level": r["severity"],
            "reach_score": r["reach_score"],
            "engagement_rate": r["engagement_rate"],
            "incident_count": r["incident_count"]
        } for r in source_a]

        # Normalize Source B
        normalized_b = [{
            "platform": r["channel"],
            "narrative": r["topic"],
            "date_detected": r["date"],
            "severity_level": r["severity_level"],
            "reach_score": r["signal_strength"],
            "engagement_rate": r["engagement_percent"],
            "incident_count": r["post_volume"]
        } for r in source_b]

        return normalized_a + normalized_b

# def fetch_and_filter_data(filters_json: str):
#     filters = json.loads(filters_json)
#     merged_records = asyncio.run(get_data_from_sources())
#     return [r for r in merged_records if filter_record(r, filters)]



def fetch_and_filter_data(filters_json: str):
    # Stub: return dummy merged records
    # Replace this later with actual GitHub file fetch + normalization
    filters = json.loads(filters_json)
    return [
        {
            "platform": "Reddit",
            "narrative": "5G tower arson",
            "date_detected": "2023-09-18",
            "severity_level": "High",
            "reach_score": 82,
            "engagement_rate": 4.5,
            "incident_count": 12
        }
    ]