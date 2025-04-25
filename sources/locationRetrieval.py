import json
import re
import requests
import urllib.request
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from pathlib import Path
from sources.liveTrack24LocationRetrieval import buildLocationData as buildLt24Data
from sources.garminInReachLocationRetrieval import buildLocationData as buildInReachData

result = {}

url = "https://www.livetrack24.com/user/Offgridcoder/text"
response = requests.get(url, headers={"Cache-Control": "no-cache"})
soup = BeautifulSoup(response.text, "html.parser")
result["Live Track 24"] = buildLt24Data(soup)

url = "https://share.garmin.com/feed/Share/TravisKool"
with urllib.request.urlopen(url) as response:
    raw = response.read().decode("utf-8", errors="ignore")
xml_content = re.sub(r"[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD]+", "", raw)
tree = ET.ElementTree(ET.fromstring(xml_content))
root = tree.getroot()
ns = {'kml': 'http://www.opengis.net/kml/2.2'}
placemark = root.find(".//kml:Placemark", ns)
result["Garmin InReach"] = buildInReachData(placemark)

output_path = Path("public/data/location-data.json")
output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
print(f"Saved to {output_path.resolve()}")