import { useEffect, useState } from "react";
import { cardStyle } from "../styles/sharedStyles.js";
import { haversineDistance } from "../utils/geoUtils.js";

export default function LiveTrackCard() {
  const [data, setData] = useState(null);
  const [distance, setDistance] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/data/location-data.json?ts=${Date.now()}`);
        const track = await res.json();
        const lt24 = track?.LiveTrack24 || {};
        setData(lt24);
  
        if (lt24.coordinates && navigator.geolocation) {
          const [lat, lon] = lt24.coordinates.split(",").map(Number);
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
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, []);


  const formatElapsedTimeFromNow = (isoUtcString) => {
    if (!isoUtcString) return null;
  
    const now = new Date();
    const then = new Date(isoUtcString);
    let diff = Math.floor((now - then) / 1000); // in seconds
  
    if (diff < 0) return "in the future";
  
    const units = [
      { label: "year", secs: 60 * 60 * 24 * 365 },
      { label: "day", secs: 60 * 60 * 24 },
      { label: "hour", secs: 60 * 60 },
      { label: "minute", secs: 60 },
    ];
  
    const result = [];
  
    for (const { label, secs } of units) {
      const value = Math.floor(diff / secs);
      if (value > 0) {
        result.push(`${value} ${label}${value > 1 ? "s" : ""}`);
        diff %= secs;
      }
    }
  
    return result.length > 0 ? `${result.join(", ")} ago` : "just now";
  };

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

            <p><strong>Last Seen:</strong> {formatElapsedTimeFromNow(data.lastUpdatedDateTimeUtc)} </p>
            <p><strong>Launch:</strong> {data.launchLocation}</p>
            <p><strong>Launch Time (UTC):</strong> {data.launchTimeUtc}</p>
            <p><strong>Land Time (UTC):</strong> {data.landTimeUtc}</p>
            <p><strong>altitude (FT):</strong> {data.altitudeInFeet}</p>
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