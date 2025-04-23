import { useEffect, useState } from "react";
import { cardStyle } from "../styles/sharedStyles.js";
import {
  formatElapsedTimeFromNow,
  calculateDistanceFromUser,
} from "../utils/locationUtils.js";

export default function LiveTrackCard({ source = "LiveTrack24" }) {
  const [data, setData] = useState(null);
  const [myCoordinates, setMyCoords] = useState(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMyCoords({ lat: latitude, lon: longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  }, []);

  // Load source-specific tracking data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/data/location-data.json?ts=${Date.now()}`);
        const track = (await res.json())[source];
        setData(track);
      } catch (err) {
        console.error("Error fetching tracking data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [source]);

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-2 text-white">{source}</h2>

      {data ? (
        data.coordinates ? (
          <div className="text-sm text-white space-y-1">
            <div className="flex items-center space-x-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  data.isLive ? "bg-green-400 animate-pulse" : "bg-red-500 opacity-60"
                }`}
                title={data.isLive ? "Live" : "Offline"}
              />
              <span
                className={`font-semibold text-sm ${
                  data.isLive ? "text-green-300" : "text-red-400"
                }`}
              >
                {data.isLive ? "Live" : "Offline"}
              </span>
            </div>

            <p>
              <strong>Last Seen:</strong>{" "}
              {formatElapsedTimeFromNow(data.lastUpdatedDateTimeUtc)}
            </p>
            <p>
              <strong>Last Coordinates:</strong> {data.coordinates}
            </p>
            <p>
              <strong>Distance From You (Miles):</strong>{" "}
              {calculateDistanceFromUser(myCoordinates, data.coordinates)}
            </p>
            <p>
              <strong>Flight Duration:</strong> {data.flightDurationTimeSpan}
            </p>
            <p>
              <strong>Launch:</strong> {data.launchLocation}
            </p>
            <p>
              <strong>Launch Time (UTC):</strong> {data.launchTimeUtc}
            </p>
            <p>
              <strong>Land Time (UTC):</strong> {data.landTimeUtc}
            </p>
            <p>
              <strong>Altitude (FT):</strong> {data.altitudeInFeet}
            </p>
            <p>
              <strong>Distance from Takeoff:</strong>{" "}
              {data.flightDistanceFromTakeoffInMiles} miles
            </p>
            <p>
              <strong>Data Source:</strong> {data.locationDataSource}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Location unavailable</p>
        )
      ) : (
        <p className="text-gray-400">Loading...</p>
      )}

      <div className="mt-4 space-y-1">
        {data?.sourceWebsiteUrl && (
          <a
            href={data.sourceWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline block"
          >
            View on Source Website
          </a>
        )}
        {data?.coordinates && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${data.coordinates}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-400 hover:underline block"
          >
            Get Directions (Google Maps)
          </a>
        )}
      </div>
    </div>
  );
}