import { useState, useEffect } from "react";
import fetchLatestData from "../constants/fetchLatestData";

export const useLatestData = () => {
  const [latestData, setLatestData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchLatestData();
      setLatestData(data); // Set data terbaru ke state
    };
    getData(); // Panggil getData saat hook dipanggil
  }, []);

  return { latestData };
};
