import { formatElapsedTimeFromNow, calculateDistanceFromUser } from "../utils/locationUtils";

export default function LiveTrack24CardDetails({ data, myCoordinates }) {
  return (
    <>
      <div className="text-sm text-white space-y-1">
        <p><strong>Last Seen:</strong> {formatElapsedTimeFromNow(data.lastUpdatedDateTimeUtc)}</p>
        <p><strong>Last Coordinates:</strong> {data.coordinates}</p>
        <p><strong>Distance From You (Miles):</strong> {calculateDistanceFromUser(myCoordinates, data.coordinates)}</p>
        <p><strong>Flight Duration:</strong> {data.flightDurationTimeSpan}</p>
        <p><strong>Launch:</strong> {data.launchLocation}</p>
        <p><strong>Launch Time (UTC):</strong> {data.launchTimeUtc}</p>
        <p><strong>Land Time (UTC):</strong> {data.landTimeUtc}</p>
        <p><strong>Altitude (ft):</strong> {data.altitudeInFeet}</p>
        <p><strong>Distance from Takeoff:</strong> {data.flightDistanceFromTakeoffInMiles} miles</p>
        <p><strong>Data Source:</strong> {data.locationDataSource}</p>
      </div>

      <div className="mt-4 space-y-1">
        <a
          href={"https://www.livetrack24.com/user/Offgridcoder/text"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:underline block"
        >
          View on source website
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${data.coordinates}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-400 hover:underline block"
        >
          Get Directions (Google Maps)
        </a>
      </div>
    </>
  );
}