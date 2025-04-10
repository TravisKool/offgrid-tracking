import { useEffect, useState } from 'react';

export default function LiveTrackCard() {
  const [location, setLocation] = useState(null);

  const fetchLocation = () => {
    fetch("https://www.livetrack24.com/user/Offgridcoder/text")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const lastLine = lines[lines.length - 1].trim();
        const parts = lastLine.split(",");

        if (parts.length >= 6) {
          const [timestamp, lat, lon, alt, speed, course] = parts;

          setLocation({
            timestamp: timestamp.trim(),
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            altitude: parseFloat(alt),
            speed: parseFloat(speed),
            course: parseFloat(course),
          });
        } else {
          console.warn("Unexpected format from LiveTrack24:", lastLine);
        }
      })
      .catch((err) => console.error("Failed to fetch LiveTrack24 data:", err));
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-xl mx-auto mt-6">
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow">
        <h2 className="text-xl font-bold mb-2">LiveTrack24 - Latest Location</h2>
        <p className="text-sm text-gray-400 mb-2">
          Last recorded: {location?.timestamp || "Unavailable"}
        </p>
        <p>Latitude: {location?.lat ?? "-"}</p>
        <p>Longitude: {location?.lon ?? "-"}</p>
        <p>Altitude: {location?.altitude ?? "-"} m</p>
        <p>Speed: {location?.speed ?? "-"} km/h</p>
        <p>Course: {location?.course != null ? location.course.toFixed(2) : "-"}°</p>
        <a
          href="https://www.livetrack24.com/user/Offgridcoder"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-400 underline text-sm mt-2"
        >
          View full LiveTrack24 page
        </a>
      </div>
    </section>
  );
}
