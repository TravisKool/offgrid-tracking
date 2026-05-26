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
        // Construct fetch URL using BASE_URL so it works with Vite's base path.
        // BASE_URL is "/offgrid-tracking/" in production or "/" in dev root.
        const base = import.meta.env.BASE_URL;
        const fetchUrl = `${base}data/location-data.json?ts=${Date.now()}`;
        console.debug("BASE_URL:", base, "Fetching:", fetchUrl);
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
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