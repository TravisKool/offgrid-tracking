from bs4 import BeautifulSoup
from pathlib import Path
import re
import json
from datetime import datetime, timedelta

# Load HTML
html_path = Path("lt24htmlraw.html")
html = html_path.read_text(encoding="iso-8859-1")
soup = BeautifulSoup(html, "html.parser")

def extract_text_after(label):
    td = soup.find("td", string=re.compile(label))
    return td.find_next_sibling("td").get_text(strip=True) if td and td.find_next_sibling("td") else None

def parse_datetime_with_gmt(text):
    match = re.search(r"(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) GMT([+-]?\d+)", text)
    if match:
        dt = datetime.strptime(match.group(1), "%Y-%m-%d %H:%M:%S")
        offset = int(match.group(2))
        return (dt + timedelta(hours=offset)).isoformat() + "Z"
    return None

def extract_coordinates(text):
    match = re.search(r"([\d.]+)\s*/\s*(-?[\d.]+)", text)
    return f"{match.group(1)},{match.group(2)}" if match else None

def extract_distance_miles(text):
    match = re.search(r"([\d.]+)\s*km", text)
    return round(float(match.group(1)) * 0.621371, 1) if match else 0.0

# Build structured output
output = {
    "isLive": "User is not live" not in soup.get_text(),
    "launchLocation": extract_text_after("Location:") or "Unknown",
    "launchTimeUtc": datetime.strptime(extract_text_after("Start:"), "%Y-%m-%d %H:%M:%S").isoformat() + "Z" if extract_text_after("Start:") else None,
    "landTimeUtc": datetime.strptime(extract_text_after("End:"), "%Y-%m-%d %H:%M:%S").isoformat() + "Z" if extract_text_after("End:") else None,
    "flightDurationTimeSpan": extract_text_after("Duration:") or "Unknown",
    "speedInMph": 0,
    "flightDistanceFromTakeoffInMiles": extract_distance_miles(extract_text_after("Takeoff Distance:") or ""),
    "coordinates": extract_coordinates(extract_text_after("Lat/Long:") or "") or "0.0,0.0",
    "locationDataSource": extract_text_after("Client Program:") or "Unknown"
}

# Save to JSON
output_path = Path("livetrack24-location-data.json")
output_path.write_text(json.dumps(output, indent=2))
print(f"Saved to {output_path.resolve()}")