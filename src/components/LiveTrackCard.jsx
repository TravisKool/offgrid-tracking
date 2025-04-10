import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function LiveTrackCard() {
  const [location, setLocation] = useState(null);

  const fetchLocation = () => {
    fetch("https://www.livetrack24.com/user/Offgridcoder/text")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const [timestamp, lat, lon, alt, speed, course] = lines[lines.length - 1].split(",");

        setLocation({
          timestamp,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          altitude: parseFloat(alt),
          speed: parseFloat(speed),
          course: parseFloat(course),
        });
      })
      .catch((err) => console.error("Failed to fetch LiveTrack24 data:", err));
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (!location) return null;

  return (
    <section className="w-full max-w-xl mx-auto mt-6">
      <Card>
        <CardContent className="space-y-2">
          <h2 className="text-xl font-bold">LiveTrack24 - Latest Location</h2>
          <p className="text-sm text-gray-400">Last recorded: {location.timestamp}</p>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lon}</p>
          <p>Altitude: {location.altitude} m</p>
          <p>Speed: {location.speed} km/h</p>
          <p>Course: {location.course.toFixed(2)}°</p>
          <a
            href="https://www.livetrack24.com/user/Offgridcoder"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-500 underline text-sm mt-2"
          >
            View full LiveTrack24 page
          </a>
        </CardContent>
      </Card>
    </section>
  );
}
