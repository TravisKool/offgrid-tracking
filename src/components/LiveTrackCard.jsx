import { useEffect, useState } from "react";
import { cardStyle } from "../styles/sharedStyles.js";

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LiveTrackCard() {
  const [data, setData] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    fetch("/data/livetrack24-location-data.json?ts=" + Date.now())
      .then((res) => res.json())
      .then((track) => {
        setData(track);
        if (track?.coordinates && navigator.geolocation) {
          const [lat, lon] = track.coordinates.split(",").map(Number);
          navigator.geolocation.getCurrentPosition((pos) => {
            const miles = haversineDistance(
              pos.coords.latitude,
              pos.coords.longitude,
              lat,
              lon
            );
            setDistance(miles.toFixed(1));
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-2 text-white">LiveTrack24</h2>

      {data ? (
        data.coordinates ? (
          <div className="text-sm text-white space-y-1">


            <div className="flex items-center space-x-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${data.isLive ? "bg-green-400 animate-pulse" : "bg-red-500 opacity-60"
                  }`}
                title={data.isLive ? "Live" : "Offline"}
              />
              <span
                className={`font-semibold text-sm ${data.isLive ? "text-green-300" : "text-red-400"
                  }`}
              >
                {data.isLive ? "Live" : "Offline"}
              </span>
            </div>

            <p><strong>Launch:</strong> {data.launchLocation}</p>
            <p><strong>Launch Time (UTC):</strong> {data.launchTimeUtc}</p>
            <p><strong>Land Time (UTC):</strong> {data.landTimeUtc}</p>
            <p><strong>Flight Duration:</strong> {data.flightDurationTimeSpan}</p>
            <p><strong>Distance from Takeoff:</strong> {data.flightDistanceFromTakeoffInMiles} miles</p>
            <p><strong>Data Source:</strong> {data.locationDataSource}</p>
            {distance && (
              <p><strong>Distance from you:</strong> {distance} miles</p>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Location unavailable</p>
        )
      ) : (
        <p className="text-gray-400">Loading...</p>
      )}

      <div className="mt-4 space-y-1">
        <a
          href="https://www.livetrack24.com/user/Offgridcoder/text"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:underline block"
        >
          View on LiveTrack24
        </a>
        {data?.coordinates && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=\${data.coordinates}`}
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