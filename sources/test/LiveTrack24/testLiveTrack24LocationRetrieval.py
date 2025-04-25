import json
from pathlib import Path
from bs4 import BeautifulSoup
from sources.liveTrack24LocationRetrieval import buildLocationData

def assertPopulated(field, value):
    fallback_values = {"Unknown", "0.0,0.0", "0.0", ""}
    if value is None or str(value).strip() in fallback_values:
        raise AssertionError(f"[FAIL] {field} is empty or fallback: {value}")
    print(f"[PASS] {field}: {value}")

def runIntegrationTest():
    print("=== Running LiveTrack24 Integration Test ===")

    result = buildLocationData()

    print("\nParsed Output:")
    print(json.dumps(result, indent=2))

    print("\nValidating fields...\n")
    for key, value in result.items():
        assertPopulated(key, value)

    print("\n=== All fields successfully validated ===")

if __name__ == "__main__" or __name__.endswith("testLivetrack24Parser"):
    runIntegrationTest()