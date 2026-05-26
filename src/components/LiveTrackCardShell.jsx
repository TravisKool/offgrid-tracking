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
        // Try to fetch from the correct base path.
        // If running under /offgrid-tracking/, use that; otherwise use root.
        let fetchUrl = '/offgrid-tracking/data/location-data.json?ts=' + Date.now();
        console.debug("Fetching location data from", fetchUrl);
        let res = await fetch(fetchUrl);
        
        // If 404, try without the /offgrid-tracking prefix (dev environment)
        if (!res.ok && res.status === 404) {
          fetchUrl = '/data/location-data.json?ts=' + Date.now();
          console.debug("First attempt failed, trying", fetchUrl);
          res = await fetch(fetchUrl);
        }
        
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