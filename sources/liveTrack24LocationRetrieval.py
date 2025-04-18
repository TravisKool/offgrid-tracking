import re
import unicodedata
from bs4 import BeautifulSoup
from datetime import datetime

def isLive(soup):
    return "User is not live" not in soup.get_text()


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

def buildLocationData(soup):
    return {
        "isLive": isLive(soup),
        "launchLocation": launchLocation(soup),
        "launchTimeUtc": launchTimeUtc(soup),
        "landTimeUtc": landTimeUtc(soup),
        "flightDurationTimeSpan": flightDurationTimeSpan(soup),
        "altitudeInFeet": altitudeInFeet(soup),
        "flightDistanceFromTakeoffInMiles": flightDistanceFromTakeoffInMiles(soup),
        "coordinates": coordinates(soup),
        "locationDataSource": locationDataSource(soup)
    }