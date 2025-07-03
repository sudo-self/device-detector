import React from "react";
import Image from "next/image";
import DeviceReport from "../components/DeviceReport";

interface Props {
  searchParams: Promise<unknown>;
}

const DevicePage = async ({ searchParams }: Props) => {
  const params = (await searchParams) as { info?: string };
  const info = params.info ? decodeURIComponent(params.info) : "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-200 dark:bg-gray-900 py-8">

      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6">
 
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full mb-6 px-4">
          <h4 className="text-2xl sm:text-3xl font-extrabold text-cyan-700 dark:text-cyan-700 select-none flex items-center gap-2">
            <Image
              src="/device.svg"
              alt="Device icon"
              width={40}
              height={40}
              placeholder="blur"
              blurDataURL="/device.svg"
            />
            <span>
              Device
              <br />
              Detector
            </span>
          </h4>
        </header>

        {/* Main report */}
        <DeviceReport info={info} />

        {/* Footer inside phone */}
        <footer className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center space-y-2">
          <p className="text-sm text-emerald-700">
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Next.js v15.3.4
            </a>
          </p>

          <p className="text-sm text-black dark:text-white">
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
    </div>
  );
};

export default DevicePage;
































































