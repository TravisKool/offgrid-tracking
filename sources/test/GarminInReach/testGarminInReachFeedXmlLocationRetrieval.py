import json
from pathlib import Path
from sources.liveTrack24LocationRetrieval import buildLocationData
import urllib.request
import xml.etree.ElementTree as ET

def assertPopulated(field, value):
    fallback_values = {"Unknown", "0.0,0.0", "0.0", ""}
    if value is None or str(value).strip() in fallback_values:
        raise AssertionError(f"[FAIL] {field} is empty or fallback: {value}")
    print(f"[PASS] {field}: {value}")

def runIntegrationTest():
    print("=== Running GarminInReach XML Parser Integration Test ===")

url = "https://share.garmin.com/Share/TravisKool.kml"
with urllib.request.urlopen(url) as response:
    tree = ET.parse(response)
root = tree.getroot()
ns = {'kml': 'http://www.opengis.net/kml/2.2'}
placemark = root.find(".//kml:Placemark", ns)
result = buildInReachData(placemark)

    print("\nParsed Output:")
    print(json.dumps(result, indent=2))

    print("\nValidating fields...\n")
    for key, value in result.items():
        assertPopulated(key, value)

    print("\n=== All fields successfully validated ===")

if __name__ == "__main__" or __name__.endswith("testGarminInReachFeedXmlLocationRetrieval"):
    runIntegrationTest()