"use client";

import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { UAParser } from "ua-parser-js";

interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
}

const QRDisplay = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  const handleGenerateQR = () => {
    const parser = new UAParser();
    const result = parser.getResult();
    const { device, browser, os } = result;

    const lines: string[] = [];
    lines.push(`JRs Device Detector`);
    lines.push(`Device: ${device.vendor || "Unknown"} ${device.model || ""}`.trim());
    lines.push(`Type: ${device.type || "desktop"}`);
    lines.push(`OS: ${os.name} ${os.version}`);
    lines.push(`Browser: ${browser.name} ${browser.version}`);
    lines.push(`User-Agent: ${navigator.userAgent}`);
    lines.push(`Screen: ${window.innerWidth}×${window.innerHeight}`);
    lines.push(`Touch Support: ${"ontouchstart" in window || navigator.maxTouchPoints > 0 ? "Yes" : "No"}`);
    lines.push(`Memory: ${(navigator as NavigatorWithDeviceMemory).deviceMemory || "?"} GB`);
    lines.push(`CPU Cores: ${navigator.hardwareConcurrency || "?"}`);

    const encoded = encodeURIComponent(lines.join("\n"));
    const url = `https://jrs-device-detector.vercel.app/device?info=${encoded}`;
    setQrUrl(url);
    setQrVisible(true);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleGenerateQR}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-indigo-600 w-full text-sm"
      >
        QR Code
      </button>

      {qrVisible && (
        <div className="mt-1 flex flex-col items-center">
          <div className="p-0 m-0">
            <QRCodeCanvas value={qrUrl} size={128} />
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">view device</p>
        </div>
      )}
    </div>
  );
};

export default QRDisplay;









