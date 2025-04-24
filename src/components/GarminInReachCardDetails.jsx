import { formatElapsedTimeFromNow, calculateDistanceFromUser } from "../utils/locationUtils";

export default function GarminInReachCardDetails({ data, myCoordinates }) {
    return (
        <>
            <div className="text-sm text-white space-y-1">
                <p><strong>Last Message Received:</strong> {data.lastMessageReceived}</p>
                <p><strong>Last Message DateTime PST:</strong> {data.lastMessageReceivedDateTimeInPst}</p>
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