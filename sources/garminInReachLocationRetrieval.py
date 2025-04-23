import re
from datetime import datetime, timezone, timedelta
from xml.etree import ElementTree as ET

ns = {'kml': 'http://www.opengis.net/kml/2.2'}

def _get_extended_data(placemark, field_name):
    for data in placemark.findall(".//kml:Data", ns):
        if data.attrib.get("name") == field_name:
            value = data.find("kml:value", ns)
            return value.text.strip() if value is not None else None
    return None

def isLive(placemark):
    try:
        last_time = _get_extended_data(placemark, "Time UTC")
        if last_time:
            dt = datetime.strptime(last_time, "%m/%d/%Y %I:%M:%S %p").replace(tzinfo=timezone.utc)
            return (datetime.now(timezone.utc) - dt) <= timedelta(minutes=5)
    except:
        pass
    return False

def lastUpdatedDateTimeUtc(placemark):
    try:
        last_time = _get_extended_data(placemark, "Time UTC")
        if last_time:
            dt = datetime.strptime(last_time, "%m/%d/%Y %I:%M:%S %p").replace(tzinfo=timezone.utc)
            return dt.isoformat()
    except:
        return None

def lastMessageText(placemark):
    return _get_extended_data(placemark, "Text") or ""

def lastMessageType(placemark):
    return _get_extended_data(placemark, "Event") or ""

def lastMessageTimeUtc(placemark):
    return _get_extended_data(placemark, "Time UTC")

def launchLocation(placemark):
    return _get_extended_data(placemark, "Map Display Name") or "Unknown"

def launchTimeUtc(placemark):
    return lastMessageTimeUtc(placemark)

def landTimeUtc(placemark):
    return lastMessageTimeUtc(placemark)

def flightDurationTimeSpan(placemark):
    return "00:00:00"

def altitudeInFeet(placemark):
    text = _get_extended_data(placemark, "Elevation")
    if text:
        match = re.search(r"([\d.]+)", text)
        if match:
            return round(float(match.group(1)) * 3.28084)
    return 0

def extract_speed(placemark):
    text = _get_extended_data(placemark, "Velocity")
    if text:
        match = re.search(r"([\d.]+)", text)
        if match:
            return round(float(match.group(1)) * 0.621371)
    return 0

def flightDistanceFromTakeoffInMiles(placemark):
    return 0.0

def coordinates(placemark):
    coords = placemark.find(".//kml:Point/kml:coordinates", ns)
    if coords is not None and coords.text:
        parts = coords.text.strip().split(",")
        if len(parts) >= 2:
            return f"{parts[1]},{parts[0]}"
    return "0.0,0.0"

def locationDataSource(placemark):
    return "Garmin InReach"

def sourceWebsiteUrl(placemark):
    return "https://share.garmin.com/TravisKool"

def buildLocationData(placemark):
    return {
        "isLive": isLive(placemark),
        "lastUpdatedDateTimeUtc": lastUpdatedDateTimeUtc(placemark),
        "lastMessageText": lastMessageText(placemark),
        "lastMessageType": lastMessageType(placemark),
        "lastMessageTimeUtc": lastMessageTimeUtc(placemark),
        "launchLocation": launchLocation(placemark),
        "launchTimeUtc": launchTimeUtc(placemark),
        "landTimeUtc": landTimeUtc(placemark),
        "flightDurationTimeSpan": flightDurationTimeSpan(placemark),
        "altitudeInFeet": altitudeInFeet(placemark),
        "speedInMph": extract_speed(placemark),
        "flightDistanceFromTakeoffInMiles": flightDistanceFromTakeoffInMiles(placemark),
        "coordinates": coordinates(placemark),
        "locationDataSource": locationDataSource(placemark),
        "sourceWebsiteUrl": sourceWebsiteUrl(placemark)
    }