import re
import unicodedata
from bs4 import BeautifulSoup
from datetime import datetime
import requests

def sourceWebsiteUrl():
    url = "https://www.livetrack24.com/user/Offgridcoder/text"
    return url

def isLive(soup):
    text = soup.get_text()

    if "User is not live" in text:
        return False

    for img in soup.find_all("img"):
        src = img.get("src", "")
        if "live_now_small.gif" in src.lower():
            return True

    return False

import re
from datetime import datetime, timedelta, timezone

def lastUpdatedDateTimeUtc(soup):
    last_pos_header = soup.find(string=re.compile("Last Position", re.IGNORECASE))
    if not last_pos_header:
        return None

    time_label = last_pos_header.find_parent().find_next(string=re.compile(r"^Time:\s*"))
    if not time_label:
        return None

    time_tag = time_label.find_next("b")
    if not time_tag:
        return None

    raw_time = time_tag.get_text(strip=True)  # e.g., "2025-04-18 12:00:54 GMT-7"
    match = re.match(r"(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) GMT([+-]\d+)", raw_time)
    if not match:
        return None

    time_str, offset_str = match.groups()
    try:
        local_dt = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
        offset = int(offset_str)
        local_dt = local_dt.replace(tzinfo=timezone(timedelta(hours=offset)))
        utc_dt = local_dt.astimezone(timezone.utc)
        return utc_dt.isoformat().replace("+00:00", "Z")
    except Exception:
        return None


def launchLocation(soup):
    td = soup.find("td", string=re.compile("Location:"))
    if not td:
        return "Unknown"
    raw_text = td.find_next_sibling("td").get_text(strip=True)

    cleaned = unicodedata.normalize("NFKD", raw_text).encode("ascii", "ignore").decode("ascii")
    cleaned = re.sub(r"[^a-zA-Z0-9 ,.-]", "", cleaned)
    return cleaned or "Unknown"

def launchTimeUtc(soup):
    text = getBTextExactLabel(soup, "Start:")
    if not text:
        return None
    try:
        return datetime.strptime(text, "%Y-%m-%d %H:%M:%S").isoformat() + "Z"
    except ValueError:
        if re.match(r"\d{2}:\d{2}:\d{2}", text):
            return f"T{text}Z"
    return None

def landTimeUtc(soup):
    text = getBTextExactLabel(soup, "End:")
    if not text:
        return None
    try:
        return datetime.strptime(text, "%Y-%m-%d %H:%M:%S").isoformat() + "Z"
    except ValueError:
        if re.match(r"\d{2}:\d{2}:\d{2}", text):
            return f"T{text}Z"
    return None

def flightDurationTimeSpan(soup):
    return getBTextExactLabel(soup, "Duration:") or "Unknown"

def altitudeInFeet(soup):
    td = soup.find("td", string=re.compile(r"Height\s*/\s*Speed:"))
    sibling = td.find_next_sibling("td") if td else None
    if sibling:
        match = re.search(r"([\d,.]+)\s*m", sibling.get_text())
        if match:
            meters = float(match.group(1).replace(",", ""))
            return str(round(meters * 3.28084, 1))
    return None

def speedInMph(soup):
    return 0

def flightDistanceFromTakeoffInMiles(soup):
    text = getBTextExactLabel(soup, "Takeoff Distance:")
    match = re.search(r"([\d.]+)\s*km", text or "")
    return str(round(float(match.group(1)) * 0.621371, 1)) if match else "0.0"

def coordinates(soup):
    td = soup.find("td", string=re.compile("Lat/Long:"))
    text = td.find_next_sibling("td").get_text(strip=True) if td else ""
    match = re.search(r"(-?\d+\.\d+)\s*/\s*(-?\d+\.\d+)", text)
    return f"{match.group(1)},{match.group(2)}" if match else "0.0,0.0"

def locationDataSource(soup):
    for td in soup.find_all("td"):
        raw_text = td.get_text(strip=True).replace("\xa0", " ").strip()
        if raw_text.lower().startswith("client program:"):
            b = td.find("b")
            return b.get_text(strip=True) if b else None
    return None

def getBTextExactLabel(soup, label):
    normalized_label = label.replace("\xa0", " ").strip().lower()
    for td in soup.find_all("td"):
        raw_text = td.get_text(strip=True).replace("\xa0", " ").strip().lower()
        if normalized_label in raw_text:
            sibling = td.find_next_sibling("td")
            if sibling:
                b = sibling.find("b")
                return b.get_text(strip=True) if b else sibling.get_text(strip=True)
    return None

def buildLocationData():
    url = sourceWebsiteUrl()
    response = requests.get(url, headers={"Cache-Control": "no-cache"})
    soup = BeautifulSoup(response.text, "html.parser")
    return {
        "isLive": isLive(soup),
        "lastUpdatedDateTimeUtc": lastUpdatedDateTimeUtc(soup),
        "launchLocation": launchLocation(soup),
        "launchTimeUtc": launchTimeUtc(soup),
        "landTimeUtc": landTimeUtc(soup),
        "flightDurationTimeSpan": flightDurationTimeSpan(soup),
        "altitudeInFeet": altitudeInFeet(soup),
        "speedInMph": speedInMph(soup),
        "flightDistanceFromTakeoffInMiles": flightDistanceFromTakeoffInMiles(soup),
        "coordinates": coordinates(soup),
        "locationDataSource": locationDataSource(soup),
        "sourceWebsiteUrl": sourceWebsiteUrl()
    }