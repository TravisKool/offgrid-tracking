import re
import json
import requests
import os
from pathlib import Path

# Fetch raw text
url = "https://www.livetrack24.com/user/Offgridcoder/text"
response = requests.get(url, headers={'Cache-Control': 'no-cache'})
raw_text = response.text

# Improved pattern matching
latlon = re.search(r"Lat/Long:\s*([\d.-]+)\s*/\s*([\d.-]+)", raw_text)
alt_speed = re.search(r"Height / Speed:\s*(\d+)\s*m\s*/\s*(\d+)", raw_text)
location = re.search(r"Location:\s*(.*?)\s*<", raw_text)
timestamp = re.search(r"Time:\s*(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})", raw_text)

# Only write if lat/lon are found
if latlon:
    data = {
        "timestamp": timestamp.group(1) if timestamp else None,
        "latitude": float(latlon.group(1)),
        "longitude": float(latlon.group(2)),
        "altitude_m": int(alt_speed.group(1)) if alt_speed else None,
        "speed_kmh": int(alt_speed.group(2)) if alt_speed else None,
        "location": location.group(1).strip() if location else "Unknown",
        "source": "LiveTrack24"
    }

    os.makedirs("public/data/", exist_ok=True)
    with open("public/data/livetrack24-location-data.json", "w") as f:
            f.write(json_string)
else:
    print("LiveTrack24: Unable to parse valid GPS data")
