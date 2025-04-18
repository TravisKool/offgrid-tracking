import json
import requests
from bs4 import BeautifulSoup
from pathlib import Path
from sources.liveTrack24LocationRetrieval import buildLocationData as buildLt24Data


result = {}

# Load LiveTrack24 data
url = "https://www.livetrack24.com/user/Offgridcoder/text"
response = requests.get(url, headers={"Cache-Control": "no-cache"})
lt24_html = response.text
lt24_soup = BeautifulSoup(lt24_html, "html.parser")
result["LiveTrack24"] = buildLt24Data(lt24_soup)

# Add more sources here if needed
# skyline_html = Path("skylines_raw.html").read_text(encoding="utf-8")
# skyline_soup = BeautifulSoup(skyline_html, "html.parser")
# result["skylines"] = buildSkylinesData(skyline_soup)

output_path = Path("public/data/location-data.json")
output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
print(f"Saved to {output_path.resolve()}")