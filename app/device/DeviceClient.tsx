"use client";

import { useSearchParams } from "next/navigation";
import DeviceReport from "../../components/DeviceReport";

const DeviceClient = () => {
  const searchParams = useSearchParams();
  const info = decodeURIComponent(searchParams.get("info") || "");

  return <DeviceReport info={info} />;
};

export default DeviceClient;
