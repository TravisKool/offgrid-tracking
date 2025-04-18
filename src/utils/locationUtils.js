export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const calculateDistanceFromUser = (myCoordinates, targetCoordinates) => {
  if (!myCoordinates || !targetCoordinates) return null;

  const [targetLat, targetLon] = targetCoordinates.split(",").map(Number);
  const { lat, lon } = myCoordinates;

  const miles = haversineDistance(lat, lon, targetLat, targetLon);

  return miles.toFixed(1);
};

export const formatElapsedTimeFromNow = (isoUtcString) => {
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