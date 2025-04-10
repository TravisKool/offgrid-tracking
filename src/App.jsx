import React from "react";
import LiveTrackCard from "./components/LiveTrackCard";

const trackers = [
  { name: "Garmin - InReach Mini 2", url: "https://share.garmin.com/traviskool" },
  { name: "XC Contest (Live Map)", url: "https://www.xcontest.org/api.s/widget/live-map/all/" },
  { name: "XC Contest (Pilot Profile)", url: "https://www.xcontest.org/world/en/pilots/detail:Offgridpilot" },
  { name: "FlyXC.app", url: "https://flyxc.app/" },
  { name: "Pure Track", url: "https://puretrack.io/?l=40.83972,-113.08588&z=3.4" },
  { name: "OGN - Open Glider Network", url: "https://live.glidernet.org/#c=42.64304,-116.59977&z=4.776658416909261&m=2&s=1&n=0" },
  { name: "Skylines", url: "https://skylines.aero/tracking/13962" },
  // Skipping LiveTrack24 here because it's rendered as a custom card
  { name: "SafeSky", url: "https://live.safesky.app/map?lat=40.00037&lng=-114.55258&zoom=3.84" },
  { name: "Flarm (ID=2017BB)", url: "https://www.flarmnet.org/" },
  { name: "SportsTrackLive", url: "https://www.sportstracklive.com/en/user/offgridpilot?live=requested" },
];



export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Offgrid Tracking Links</h1>

      <LiveTrackCard />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {trackers.map((tracker, index) => (
          <a
            key={index}
            href={tracker.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 transition p-6 rounded-2xl shadow-md border border-gray-700"
          >
            <h2 className="text-xl font-semibold">{tracker.name}</h2>
            <p className="text-sm mt-1 text-gray-400 break-all">{tracker.url}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
