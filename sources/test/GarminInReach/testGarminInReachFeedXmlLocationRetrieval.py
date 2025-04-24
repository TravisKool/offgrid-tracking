import json
from pathlib import Path
from sources.garminInReachLocationRetrieval import buildLocationData
import urllib.request
import xml.etree.ElementTree as ET

def assertPopulated(field, value):
    fallback_values = {"Unknown", "0.0,0.0", "0.0", ""}
    if value is None or str(value).strip() in fallback_values:
        raise AssertionError(f"[FAIL] {field} is empty or fallback: {value}")
    print(f"[PASS] {field}: {value}")

def runIntegrationTest():
    print("=== Running GarminInReach XML Parser Integration Test ===")

    # Load from local file instead of URL
    xml_path = Path("sources/test/GarminInReach/GarminInReachXmlFeed.xml")
    tree = ET.parse(xml_path)
    root = tree.getroot()
    ns = {"kml": "http://www.opengis.net/kml/2.2"}
    placemark = root.find(".//kml:Placemark", ns)
    result = buildLocationData(placemark)

    print("\nParsed Output:")
    print(json.dumps(result, indent=2))

    print("\nValidating fields...\n")
    for key, value in result.items():
        assertPopulated(key, value)

    print("\n=== All fields successfully validated ===")

if __name__ == "__main__" or __name__.endswith("testGarminInReachFeedXmlLocationRetrieval"):
    runIntegrationTest()