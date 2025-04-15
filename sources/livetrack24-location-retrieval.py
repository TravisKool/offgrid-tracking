import re
import json
from datetime import datetime
from pathlib import Path
import requests

# Fetch the raw text from LiveTrack24
url = "https://www.livetrack24.com/user/Offgridcoder/text"
response = requests.get(url)
raw_text = response.text

# Parse components from raw text
latlon = re.search(r"Lat/Long:\s*([\d\.-]+)\s*/\s*([\d\.-]+)", raw_text)
alt_speed = re.search(r"Height / Speed:\s*(\d+)\s*m\s*/\s*(\d+)", raw_text)
location = re.search(r"Location:\s*(.*)", raw_text)
timestamp = re.search(r"Time:\s*(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})", raw_text)

data = {
    "timestamp": timestamp.group(1) if timestamp else None,
    "latitude": float(latlon.group(1)) if latlon else None,
    "longitude": float(latlon.group(2)) if latlon else None,
    "altitude_m": int(alt_speed.group(1)) if alt_speed else None,
    "speed_kmh": int(alt_speed.group(2)) if alt_speed else None,
    "location": location.group(1).strip() if location else None,
    "source": "LiveTrack24"
}

Path("data/livetrack24-location-data.json").write_text(json.dumps(data, indent=2))
