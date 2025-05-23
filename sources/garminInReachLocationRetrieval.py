from datetime import datetime, timedelta
from xml.etree import ElementTree as ET
from datetime import datetime, timedelta, timezone
import re
import urllib.request
import xml.etree.ElementTree as ET

def sourceWebsiteUrl():
    return "https://share.garmin.com/TravisKool"

def isLive(placemark):
    raw = extractTextFromExtendedData(placemark, "Time UTC")
    if raw:
        try:
            last = datetime.strptime(raw, "%m/%d/%Y %I:%M:%S %p")
            last = last.replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)
            return (now - last) <= timedelta(minutes=15)
        except ValueError:
            return False
    return False

def extractTextFromExtendedData(placemark, name):
    dataFields = placemark.findall(".//{http://www.opengis.net/kml/2.2}Data")
    for field in dataFields:
        if field.attrib.get("name") == name:
            valueElem = field.find("{http://www.opengis.net/kml/2.2}value")
            return valueElem.text.strip() if valueElem is not None and valueElem.text else None
    return None

def parseCoordinates(placemark):
    lat = extractTextFromExtendedData(placemark, "Latitude")
    lon = extractTextFromExtendedData(placemark, "Longitude")
    if lat and lon:
        return f"{lat},{lon}"
    return None

def parseSpeedInMilesPerHour(placemark):
    raw = extractTextFromExtendedData(placemark, "Velocity")
    if raw and "km/h" in raw:
        try:
            kmh = float(raw.replace("km/h", "").strip())
            return round(kmh * 0.621371, 2)
        except ValueError:
            return 0.0
    return 0.0

def extractDirectionInDegrees(placemark):
    raw = extractTextFromExtendedData(placemark, "Course")
    return raw.strip() if raw else "Unknown"

def parseElevationInFeetMsl(placemark):
    raw = extractTextFromExtendedData(placemark, "Elevation")
    if raw and "m" in raw:
        try:
            meters = float(raw.split(" ")[0].strip())
            return round(meters * 3.28084, 2)
        except ValueError:
            return 0.0
    return 0.0

def parseLastMessageReceived(placemark):
    return extractTextFromExtendedData(placemark, "Text") or "Garmin received location (Automated)"

from datetime import datetime, timezone

def parseLastMessageReceivedDateTimeUtc(placemark):
    raw = extractTextFromExtendedData(placemark, "Time UTC")
    if raw:
        try:
            dt = datetime.strptime(raw, "%m/%d/%Y %I:%M:%S %p")
            return dt.replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")
        except ValueError:
            return None
    return None

def locationDataSource():
    return "Garmin InReach Mini 2"

def buildLocationData():
    url = "https://share.garmin.com/feed/Share/TravisKool"
    with urllib.request.urlopen(url) as response:
        raw = response.read().decode("utf-8", errors="ignore")
    xml_content = re.sub(r"[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD]+", "", raw)
    tree = ET.ElementTree(ET.fromstring(xml_content))
    root = tree.getroot()
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}
    placemark = root.find(".//kml:Placemark", ns)

    return {
        "isLive": isLive(placemark),
        "coordinates": parseCoordinates(placemark),
        "speedInMph": parseSpeedInMilesPerHour(placemark),
        "directionInDegrees": extractDirectionInDegrees(placemark),
        "altitudeInFeet": parseElevationInFeetMsl(placemark),
        "lastMessageReceived": parseLastMessageReceived(placemark),
        "lastMessageReceivedDateTimeUtc": parseLastMessageReceivedDateTimeUtc(placemark),
        "locationDataSource": locationDataSource(),
        "sourceWebsiteUrl": sourceWebsiteUrl()
    }