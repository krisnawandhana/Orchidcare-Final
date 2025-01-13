import { supabase } from "../lib/supabase";

export const fetchLatestData = async () => {
  try {
    const { data, error } = await supabase
      .from("data_table")
      .select("id, temperature, humidity, light_intensity, time_stamp")
      .order("time_stamp", { ascending: false }) // Mengurutkan berdasarkan time_stamp yang terbaru
      .limit(1); // Ambil hanya 1 entri terbaru

    if (error) throw error;
    return data[0]; // Return data terbaru
  } catch (error) {
    console.error("Error fetching data from Supabase:", error.message);
    return null;
  }
};