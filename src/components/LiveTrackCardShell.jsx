import { useEffect, useState } from "react";
import { cardStyle } from "../styles/sharedStyles.js";

export default function LiveTrackCardShell({ sourceKey, children }) {
  const [data, setData] = useState(null);
  const [myCoordinates, setMyCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMyCoords({ lat: latitude, lon: longitude });
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/data/location-data.json?ts=${Date.now()}`);
        const json = await res.json();
        setData(json[sourceKey]);
      } catch (err) {
        console.error("Error fetching tracking data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [sourceKey]);

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-2 text-white">{sourceKey}</h2>

      {data ? (
        data.coordinates ? (
          <>
            <div className="flex items-center space-x-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${data.isLive ? "bg-green-400 animate-pulse" : "bg-red-500 opacity-60"
                  }`}
                title={data.isLive ? "Live" : "Offline"}
              />
              <span className={`font-semibold text-sm ${data.isLive ? "text-green-300" : "text-red-400"}`}>
                {data.isLive ? "Live" : "Offline"}
              </span>
            </div>

            {children({ data, myCoordinates })}

            
          </>
        ) : (
          <p className="text-gray-400">Location unavailable</p>
        )
      ) : (
        <p className="text-gray-400">Loading...</p>
      )}
    </div>
  );
}