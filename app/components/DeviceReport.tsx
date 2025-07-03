import React from "react";

const DeviceReport = ({ info }: { info: string }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="phone-card">
        <div className="screen">
          <pre className="whitespace-pre-wrap break-words text-sm bg-black text-white p-4 rounded max-h-[70vh] overflow-auto">
            {info || "No info provided"}
          </pre>
          
        </div>
      </div>
    </div>
  );
};

export default DeviceReport;











