import { useEffect, useState } from "react";
import { cardStyle } from "../styles/sharedStyles.js";
import { haversineDistance, formatElapsedTimeFromNow, calculateDistanceFromUser } from "../utils/locationUtils.js";

  export default function LiveTrackCard() {
    const [data, setData] = useState(null);
    const [myCoordinates, setMyCoords] = useState(null);
  
    // Get user location once
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
  
    // Fetch tracker data once
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`/data/location-data.json?ts=${Date.now()}`);
          const track = (await res.json()).LiveTrack24;
          setData(track);
        } catch (err) {
          console.error("Error fetching tracking data:", err);
        }
      };
  
      fetchData();
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

            <p><strong>Last Seen:</strong> {formatElapsedTimeFromNow(data.lastUpdatedDateTimeUtc)} </p>
            <p><strong>Last Coordinates:</strong> {data.coordinates}</p>
            <p><strong>Distance From You (Miles):</strong> {calculateDistanceFromUser(myCoordinates, data.coordinates)}</p>
            <p><strong>Flight Duration:</strong> {data.flightDurationTimeSpan}</p>
            <p><strong>Launch:</strong> {data.launchLocation}</p>
            <p><strong>Launch Time (UTC):</strong> {data.launchTimeUtc}</p>
            <p><strong>Land Time (UTC):</strong> {data.landTimeUtc}</p>
            <p><strong>altitude (FT):</strong> {data.altitudeInFeet}</p>
            <p><strong>Distance from Takeoff:</strong> {data.flightDistanceFromTakeoffInMiles} miles</p>
            <p><strong>Data Source:</strong> {data.locationDataSource}</p>
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