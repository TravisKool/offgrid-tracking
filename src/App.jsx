import React from "react";
import { cardStyle } from "./styles/sharedStyles.js";
import LiveTrackCardShell from "./components/LiveTrackCardShell.jsx";
import LiveTrack24CardDetails from "./components/LiveTrack24CardDetails.jsx";
import GarminInReachCardDetails from "./components/GarminInReachCardDetails.jsx";

const trackers = [
  { name: "Skylines", url: "https://skylines.aero/tracking/13962" },
  { name: "Pure Track", url: "http://puretrack.io/?id=40.83972,-113.988872&z=4" },
  { name: "XC Contest (Live Map)", url: "https://www.xcontest.org/api5/widget/live-map/all/" },
  { name: "XC Contest (Pilot Profile)", url: "https://www.xcontest.org/world/en/pilots/detail:Offgridpilot" },
  { name: "FlyXC.app", url: "https://flyxc.app/" },
  { name: "OGN - Open Glider Network", url: "https://live.glidernet.org/#c=42.64304,-116.59977&z=7&v=77665&l=gliders&n=2&g=1" },
  { name: "SafeSky", url: "https://www.safesky.app/map#lat=40.000837&lng=-114.55258&zoom=8.4" },
  { name: "Flarm (ID=2017BB)", url: "https://www.flarmnet.org/" },
  { name: "SportsTrackLive", url: "https://www.sportstracklive.com/en/user/offgridpilot?live=requested" },
];

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-grow text-white px-4 py-4 space-y-8 flex flex-col items-center">
        <div className="text-3xl font-bold mb-8">Track Travis</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">

          <LiveTrackCardShell
            sourceKey="LiveTrack24"
          >
            {({ data, myCoordinates }) => (
              <LiveTrack24CardDetails data={data} myCoordinates={myCoordinates} />
            )}
          </LiveTrackCardShell>

          <LiveTrackCardShell
            sourceKey="Garmin InReach"
          >
            {({ data, myCoordinates }) => (
              <GarminInReachCardDetails data={data} myCoordinates={myCoordinates} />
            )}
          </LiveTrackCardShell>

          {trackers.map((tracker, index) => (
            <a
              key={index}
              href={tracker.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cardStyle}
            >
              <h2 className="text-xl font-semibold">{tracker.name}</h2>
              <p className="text-sm mt-1 text-gray-400 break-all">{tracker.url}</p>
            </a>
          ))}
        </div>
      </main>
      <footer className="text-center text-sm text-gray-400 py-4">
        © {new Date().getFullYear()} Travis Kool. All rights reserved.
      </footer>
    </div>
  );
}
