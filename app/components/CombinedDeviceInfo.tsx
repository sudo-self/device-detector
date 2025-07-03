"use client";

import React, { useEffect, useState } from "react";
import { UAParser, IResult as UAResult } from "ua-parser-js";
import Image from "next/image";
import QRDisplay from "./QRDisplay";
import GitHubButton from 'react-github-btn';

interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
  addEventListener<K extends keyof BatteryManagerEventMap>(
    type: K,
    listener: (this: BatteryManager, ev: BatteryManagerEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof BatteryManagerEventMap>(
    type: K,
    listener: (this: BatteryManager, ev: BatteryManagerEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

interface BatteryManagerEventMap {
  chargingchange: Event;
  levelchange: Event;
  chargingtimechange: Event;
  dischargingtimechange: Event;
}

interface NetworkInformation extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener<K extends keyof NetworkInformationEventMap>(
    type: K,
    listener: (this: NetworkInformation, ev: NetworkInformationEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof NetworkInformationEventMap>(
    type: K,
    listener: (this: NetworkInformation, ev: NetworkInformationEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

interface NetworkInformationEventMap {
  change: Event;
}

interface USBDeviceInfo {
  productName?: string;
  manufacturerName?: string;
  vendorId?: number;
  productId?: number;
}

interface ScreenInfo {
  width: number;
  height: number;
  orientation: string;
}

interface MemoryInfo {
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

interface USB {
  requestDevice(options: { filters: unknown[] }): Promise<USBDevice>;
}

interface USBDevice {
  productName?: string;
  manufacturerName?: string;
  vendorId?: number;
  productId?: number;
}

const CombinedDeviceInfo: React.FC = () => {
  const [deviceData, setDeviceData] = useState<UAResult | null>(null);
  const [usbDevice, setUsbDevice] = useState<USBDeviceInfo | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("darkMode");
    return saved ? saved === "true" : window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  });

  const [battery, setBattery] = useState<BatteryManager | null>(null);
  const [network, setNetwork] = useState<NetworkInformation | null>(null);
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({ width: 0, height: 0, orientation: "unknown" });
  const [touchSupport, setTouchSupport] = useState<boolean>(false);
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo>({});
  const [vibrationSupport, setVibrationSupport] = useState<boolean>(false);

  useEffect(() => {
    const parser = new UAParser();
    setDeviceData(parser.getResult());

    if ("getBattery" in navigator) {
      (navigator as Navigator & { getBattery: () => Promise<BatteryManager> })
        .getBattery()
        .then((bat) => {
          setBattery(bat);
          const update = () => setBattery({ ...bat });
          bat.addEventListener("chargingchange", update);
          bat.addEventListener("levelchange", update);
          bat.addEventListener("chargingtimechange", update);
          bat.addEventListener("dischargingtimechange", update);
          return () => {
            bat.removeEventListener("chargingchange", update);
            bat.removeEventListener("levelchange", update);
            bat.removeEventListener("chargingtimechange", update);
            bat.removeEventListener("dischargingtimechange", update);
          };
        })
        .catch(() => setBattery(null));
    }

    const navConn = navigator as Navigator & { connection?: NetworkInformation };
    if (navConn.connection) {
      setNetwork(navConn.connection);
      const update = () => setNetwork({ ...navConn.connection! });
      navConn.connection.addEventListener("change", update);
      return () => navConn.connection?.removeEventListener("change", update);
    }

    const updateScreen = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation:
          window.screen.orientation?.type ||
          (window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape"),
      });
    };

    updateScreen();
    window.addEventListener("resize", updateScreen);
    window.screen.orientation?.addEventListener?.("change", updateScreen);

    setTouchSupport("ontouchstart" in window || navigator.maxTouchPoints > 0 || false);

    const navMem = navigator as Navigator & { deviceMemory?: number };
    setMemoryInfo({
      deviceMemory: navMem.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
    });

    setVibrationSupport("vibrate" in navigator);

    return () => {
      window.removeEventListener("resize", updateScreen);
      window.screen.orientation?.removeEventListener?.("change", updateScreen);
    };
  }, []);

  const handleUSBConnect = async () => {
    if (!("usb" in navigator)) {
      alert("USB API only works in Chromium browsers.");
      return;
    }
    try {
      const device = await (navigator as Navigator & { usb: USB }).usb.requestDevice({ filters: [] });
      setUsbDevice({
        productName: device.productName,
        manufacturerName: device.manufacturerName,
        vendorId: device.vendorId,
        productId: device.productId,
      });
    } catch (err) {
      const error = err as Error & { name?: string };
      if (error.name !== "NotFoundError") {
        alert("USB connection error: " + error.message);
      }
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("darkMode") === null) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!deviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Detecting device info...</p>
      </div>
    );
  }

  const { browser, os, device } = deviceData;

  const handleShare = async () => {
    if (!navigator.share) {
      alert("Web Share API is not supported in your browser.");
      return;
    }

    const lines: string[] = [];

    if (deviceData) {
      const { device, browser, os } = deviceData;
      lines.push(`JRs Device Detector`);
      lines.push(`Device: ${device.vendor || "Unknown"} ${device.model || ""}`.trim());
      lines.push(`Type: ${device.type || "desktop"}`);
      lines.push(`OS: ${os.name} ${os.version}`);
      lines.push(`Browser: ${browser.name} ${browser.version}`);
      lines.push(`User-Agent: ${navigator.userAgent}`);
    }

    if (battery) {
      lines.push(`Battery: ${(battery.level * 100).toFixed(0)}% (${battery.charging ? "charging" : "discharging"})`);
      lines.push(`Charging Time: ${battery.chargingTime === Infinity ? "N/A" : `${battery.chargingTime}s`}`);
      lines.push(`Discharging Time: ${battery.dischargingTime === Infinity ? "N/A" : `${battery.dischargingTime}s`}`);
    }

    if (network) {
      lines.push(`Network: ${network.effectiveType}`);
      lines.push(`Downlink: ${network.downlink} Mbps`);
      lines.push(`RTT: ${network.rtt} ms`);
      lines.push(`Save Data: ${network.saveData ? "Yes" : "No"}`);
    }

    lines.push(`Screen: ${screenInfo.width}×${screenInfo.height} (${screenInfo.orientation})`);
    lines.push(`Touch Support: ${touchSupport ? "Yes" : "No"}`);
    lines.push(`Memory: ${memoryInfo.deviceMemory || "?"} GB`);
    lines.push(`CPU Cores: ${memoryInfo.hardwareConcurrency || "?"}`);
    lines.push(`Vibration API: ${vibrationSupport ? "Supported" : "Not supported"}`);

    const shareText = lines.join("\n");

    try {
      await navigator.share({
        title: "Device Info",
        text: shareText,
      });
    } catch (err) {
      console.error("Sharing failed", err);
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full max-w-4xl">
        <h4 className="text-2xl sm:text-3xl font-extrabold text-cyan-700 dark:text-cyan-700 select-none flex items-center gap-2">
         <Image
            src="/device.svg"
            alt="Device icon"
            width={40}
            height={40}
            placeholder="blur"
            blurDataURL="/device.svg"
          />
          Device<br />Detector
        </h4>

        <div className="flex flex-col items-center sm:items-end gap-2">
          <QRDisplay />
        </div>
      </header>

      <section className="mt-6 w-full max-w-4xl text-gray-800 dark:text-gray-200 select-none">
          <h4 className="text-xl text-cyan-700 font-semibold mb-4">{device.model || "N/A"}</h4>
        <ul className="text-sm space-y-2 dark:text-gray-300">
          <li>
            <strong>Type:</strong> {device.type || "desktop"}
          </li>
          <li>
            <strong>Brand:</strong> {device.vendor || "N/A"}
          </li>
          <li>
            <strong>Model:</strong> {device.model || "N/A"}
          </li>
          <li>
            <strong>OS:</strong> {os.name} {os.version}
          </li>
          <li>
            <strong>Browser:</strong> {browser.name} {browser.version}
          </li>
          <li>
            <strong>User Agent</strong>
            <pre className="mt-1 p-3 rounded bg-black dark:bg-gray-700 text-white text-xs overflow-auto max-h-24 break-words whitespace-pre-wrap">
              {navigator.userAgent}
            </pre>
          </li>
          {battery && (
            <>
              <li>
                <strong>Battery:</strong> {(battery.level * 100).toFixed(0)}%{" "}
                {battery.charging ? "(charging)" : "(discharging)"}
              </li>
              <li>
                <strong>Charge Time:</strong>{" "}
                {battery.chargingTime === Infinity ? "N/A" : `${battery.chargingTime}s`}
              </li>
              <li>
                <strong>Discharge Time:</strong>{" "}
                {battery.dischargingTime === Infinity ? "N/A" : `${battery.dischargingTime}s`}
              </li>
            </>
          )}
          {network && (
            <>
              <li>
                <strong>Network:</strong> {network.effectiveType}
              </li>
              <li>
                <strong>Downlink:</strong> {network.downlink} Mbps
              </li>
              <li>
                <strong>RTT:</strong> {network.rtt} ms
              </li>
              <li>
                <strong>Save Data:</strong> {network.saveData ? "Yes" : "No"}
              </li>
            </>
          )}
          <li>
            <strong>Screen:</strong> {screenInfo.width}×{screenInfo.height}
          </li>
          <li>
            <strong>Touch Support:</strong> {touchSupport ? "Yes" : "No"}
          </li>
          <li>
            <strong>Memory:</strong> {memoryInfo.deviceMemory ? `${memoryInfo.deviceMemory}GB` : "unknown"}
          </li>
          <li>
            <strong>CPU Cores:</strong> {memoryInfo.hardwareConcurrency || "unknown"}
          </li>
          <li>
            <strong>Vibration API:</strong> {vibrationSupport ? "Supported" : "Not supported"}
          </li>
        </ul>
      </section>

          <section className="mt-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4 text-sm italic text-gray-500 dark:text-gray-400">
              <p className="text-bold">ⓘ&nbsp;Google<br />Chrome Browser</p>
              <button
                onClick={handleUSBConnect}
                className="px-4 py-2 text-white bg-black hover:bg-indigo-600 rounded-lg transition"
              >
                USB
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-indigo-600 rounded-lg transition"
              >
                SHARE
              </button>
            </div>

            {usbDevice ? (
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 max-w-4xl">
                <li>
                  <strong>Product:</strong> {usbDevice.productName || "N/A"}
                </li>
                <li>
                  <strong>Manufacturer:</strong> {usbDevice.manufacturerName || "N/A"}
                </li>
                <li>
                  <strong>Vendor ID:</strong> {usbDevice.vendorId ? `0x${usbDevice.vendorId.toString(16)}` : "N/A"}
                </li>
                <li>
                  <strong>Product ID:</strong> {usbDevice.productId ? `0x${usbDevice.productId.toString(16)}` : "N/A"}
                </li>
              </ul>
            ) : (
              <div className="text-green-600 dark:text-green-600 space-y-2">
                 <div>
                 <GitHubButton
                 href="https://github.com/sudo-self/device-detector"
                 data-color-scheme="no-preference: light; light: light; dark: dark;"
                 data-icon="octicon-star"
                 data-size="large"
                 aria-label="Star sudo-self/device-detector on GitHub">
                 Star
                 </GitHubButton>
                 </div>
                <div>
                  <GitHubButton
                    href="https://github.com/sudo-self"
                    data-color-scheme="no-preference: light; light: light; dark: dark;"
                    data-size="large"
                    aria-label="Follow @sudo-self on GitHub"
                  >
                    Follow @sudo-self
                  </GitHubButton>
                </div>
              </div>
            )}
          </section>

   

          <footer className="mt-10 w-full max-w-4xl mx-auto border-t border-gray-300 dark:border-gray-700 pt-6 text-center space-y-2">
            <p className="text-sm text-cyan-700">
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
          Ⓝext.js 15.3
              </a>
            </p>

            <p className="text-sm text-black">
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                ▲ Vercel
              </a>
            </p>

            <p className="text-sm text-gray-500">
              <a
                href="https://device.jessejesse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-indigo-500"
              >
                device.JesseJesse.com
              </a>
            </p>
          </footer>

    </div>
  );
};

export default CombinedDeviceInfo;






















