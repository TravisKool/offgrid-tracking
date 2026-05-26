import { formatElapsedTimeFromNow, calculateDistanceFromUser } from "../utils/locationUtils";

export default function GarminInReachCardDetails({ data, myCoordinates }) {
    return (
        <>
            <div className="flex items-center space-x-2 mb-2">
                <div
                    className={`w-3 h-3 rounded-full ${data.isLive ? "bg-green-400 animate-pulse" : "bg-red-500 opacity-60"}`}
                    title={data.isLive ? "Flying/Hiking" : "Landed or Offline"}
                />
                <span className={`font-semibold text-sm ${data.isLive ? "text-green-300" : "text-red-400"}`}>
                    {data.isLive ? "Flying/Hiking" : "Landed or Offline"}
                </span>
            </div>

            <div className="text-sm text-white space-y-1">
                <p><strong>Last Seen:</strong> {formatElapsedTimeFromNow(data.lastMessageReceivedDateTimeUtc)}</p>
                <p><strong>Last Message Received:</strong> {data.lastMessageReceived}</p>
                <p><strong>Last Coordinates:</strong> {data.coordinates}</p>
                <p><strong>Speed in MPH:</strong> {data.speedInMph}</p>
                <p><strong>Distance From You (Miles):</strong> {calculateDistanceFromUser(myCoordinates, data.coordinates)}</p>
                <p><strong>Course:</strong> {data.directionInDegrees}</p>
                <p><strong>Altitude (ft):</strong> {data.altitudeInFeet}</p>
                <p><strong>Data Source:</strong> {data.locationDataSource}</p>
            </div>
            <div className="mt-4 space-y-1">
                <a
                    href={data.sourceWebsiteUrl}
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