export default function TrackerCardShell({ title, isLive, sourceWebsiteUrl, coordinates, children }) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md text-white">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
  
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-red-500 opacity-60"}`} />
          <span className={`font-semibold text-sm ${isLive ? "text-green-300" : "text-red-400"}`}>
            {isLive ? "Live" : "Offline"}
          </span>
        </div>
  
        <div className="text-sm space-y-1">{children}</div>
  
        <div className="mt-4 space-y-1">
          {sourceWebsiteUrl && (
            <a href={sourceWebsiteUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline block">
              View on Source Website
            </a>
          )}
          {coordinates && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-400 hover:underline block"
            >
              Get Directions (Google Maps)
            </a>
          )}
        </div>
      </div>
    );
  }