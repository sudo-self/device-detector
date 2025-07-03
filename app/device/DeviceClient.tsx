"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const DeviceClient = () => {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get("id") || "unknown";

  return (
    <div className="px-4 py-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-2 text-cyan-700 dark:text-cyan-400">
        Device Info
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        Device ID from URL: <strong>{deviceId}</strong>
      </p>
    </div>
  );
};

export default DeviceClient;

