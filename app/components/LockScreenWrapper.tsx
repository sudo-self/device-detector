"use client";

import React, { useState, useEffect } from "react";
import CombinedDeviceInfo from "./CombinedDeviceInfo";

const LockScreenWrapper: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [time, setTime] = useState(new Date());

  const handleUnlock = () => {
    setUnlocked(true);
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="phone-card relative w-[400px] h-[720px] rounded-3xl shadow-xl border border-gray-300 dark:border-gray-700 overflow-hidden">
        {!unlocked ? (
          <div
            className="w-full h-full relative flex flex-col items-center justify-between text-white rounded-3xl"
            style={{
              backgroundImage: "url('/wallpaper.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={handleUnlock}
          >
            <div className="mt-16 text-center drop-shadow-md">
              <div className="text-6xl font-light">
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-md">
                {time.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="mb-10">
              <div className="text-sm text-white bg-black/50 px-5 py-2 rounded-full backdrop-blur-sm shadow-lg">
                Tap to Unlock
              </div>
            </div>
          </div>
        ) : (
          <div className="screen p-6 h-full overflow-auto flex flex-col">
            <CombinedDeviceInfo />
          </div>
        )}
      </div>
    </div>
  );
};

export default LockScreenWrapper;


















































