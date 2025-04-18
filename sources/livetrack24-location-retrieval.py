import re
import json
import requests
from bs4 import BeautifulSoup
from pathlib import Path
from datetime import datetime, timedelta

# Load HTML from LiveTrack24
url = "https://www.livetrack24.com/user/Offgridcoder/text"
response = requests.get(url, headers={"Cache-Control": "no-cache"})
html = response.text
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
    result = round(float(match.group(1)) * 0.621371, 1) if match else 0.0
    return str(result)

def extractAltitudeInFeet():
    # Locate the <td> containing "Height / Speed:"
    label_td = soup.find("td", string=re.compile(r"Height\s*/\s*Speed:"))
    if label_td:
        value_td = label_td.find_next_sibling("td")
        if value_td:
            match = re.search(r"([\d,.]+)\s*m", value_td.get_text())
            if match:
                meters = float(match.group(1).replace(",", ""))
                feet = round(meters * 3.28084, 1)
                return str(feet)
    return None

def extractClientProgram():
    td_list = soup.find_all("td", class_="row1")
    for td in td_list:
        text = td.get_text(strip=True)
        if text.startswith("Client Program:"):
            b_tag = td.find("b")
            return b_tag.get_text(strip=True) if b_tag else "Unknown"
    return "Unknown"

# Build structured output
output = {
    "isLive": "User is not live" not in soup.get_text(),
    "launchLocation": extract_text_after("Location:") or "Unknown",
    "launchTimeUtc": datetime.strptime(extract_text_after("Start:"), "%Y-%m-%d %H:%M:%S").isoformat() + "Z" if extract_text_after("Start:") else None,
    "landTimeUtc": datetime.strptime(extract_text_after("End:"), "%Y-%m-%d %H:%M:%S").isoformat() + "Z" if extract_text_after("End:") else None,
    "flightDurationTimeSpan": extract_text_after("Duration:") or "Unknown",
    "altitudeInFeet": extractAltitudeInFeet(),
    "flightDistanceFromTakeoffInMiles": extract_distance_miles(extract_text_after("Takeoff Distance:") or ""),
    "coordinates": extract_coordinates(extract_text_after("Lat/Long:") or "") or "0.0,0.0",
    "locationDataSource": extractClientProgram()
}

# Save to JSON
output_path = Path("public/data/livetrack24-location-data.json")
output_path.write_text(json.dumps(output, indent=2))
print(f"Saved to {output_path.resolve()}")