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

    html_path = Path(__file__).parent / "lt24htmlrawLive.html"
    if not html_path.exists():
        print("[ERROR] HTML file not found: lt24htmlraw.html")
        return

    html = html_path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")

    result = buildLocationData(soup)

    print("\nParsed Output:")
    print(json.dumps(result, indent=2))

    print("\nValidating fields...\n")
    for key, value in result.items():
        assertPopulated(key, value)

    print("\n=== All fields successfully validated ===")

if __name__ == "__main__" or __name__.endswith("testLivetrack24Parser"):
    runIntegrationTest()