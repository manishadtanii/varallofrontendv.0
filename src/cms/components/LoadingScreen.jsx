import React from "react";

const LoadingScreen = ({ message = "Loading CMS data..." }) => {
  return (
    <div className="flex min-h-screen bg-[#05080a] text-white items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with Pulse & Rotate Animation */}
        <div className="relative w-24 h-24">
          {/* Outer glow circle (pulses) */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-pulse"></div>
          
          {/* Middle rotating border */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-cyan-500 animate-spin" style={{ animationDuration: '3s' }}></div>
          
          {/* Inner rotating glow */}
          <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
          
          {/* Logo Image - Center */}
          <img
            src="/logo.png"
            alt="Loading"
            className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.3))',
              animation: 'float 3s ease-in-out infinite'
            }}
          />
        </div>

        {/* Loading Text with Gradient */}
        <div className="text-center space-y-2">
          <p className="text-gray-300 text-sm font-medium">{message}</p>
          
          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>

        {/* Subtle footer text */}
        <p className="text-gray-500 text-xs mt-4">Initializing workspace...</p>
      </div>

      {/* CSS Animations - Add to component or global styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
