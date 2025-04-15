import { useEffect, useState } from "react";
import { cardStyle } from "../styles/sharedStyles";

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
    fetch(`/data/livetrack24-location-data.json?ts=${Date.now()}`)
      .then((res) => res.json())
      .then((track) => {
        setData(track);

        if (track?.latitude && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const miles = haversineDistance(
              pos.coords.latitude,
              pos.coords.longitude,
              track.latitude,
              track.longitude
            );
            setDistance(miles.toFixed(1));
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className={cardStyle}>
      <div>
        <h2 className="text-xl font-semibold mb-2 text-white">LiveTrack24</h2>
        {data && data.latitude ? (
          <div className="text-sm text-white space-y-1">
            <p><strong>Location:</strong> {data.location}</p>
            <p><strong>Lat:</strong> {data.latitude}</p>
            <p><strong>Lon:</strong> {data.longitude}</p>
            <p><strong>Alt:</strong> {data.altitude_m} m</p>
            <p><strong>Speed:</strong> {data.speed_kmh} km/h</p>
            <p><strong>Time:</strong> {new Date(data.timestamp).toLocaleString()}</p>
            {distance && (
              <p><strong>Distance:</strong> {distance} miles from here</p>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Location unavailable</p>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <a
          href="https://www.livetrack24.com/user/Offgridcoder/text"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:underline block"
        >
          View on LiveTrack24
        </a>
        {data && data.latitude && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`}
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
