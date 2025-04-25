import json
from pathlib import Path
from sources.liveTrack24LocationRetrieval import buildLocationData as buildLt24Data
from sources.garminInReachLocationRetrieval import buildLocationData as buildInReachData

result = {}

result["LiveTrack24"] = buildLt24Data()
result["Garmin InReach"] = buildInReachData()

output_path = Path("public/data/location-data.json")
output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
print(f"Saved to {output_path.resolve()}")