import { supabase } from "../lib/supabase";

export const fetchLogsData = async (individuId) => {
  try {
    const { data, error } = await supabase
    .from("data_table")
    .select("id, temperature, humidity, light_intensity, time_stamp, individu_id")
    .eq("individu_id", individuId)  // Filter berdasarkan individu_id
    .order("time_stamp", { ascending: false }); // Urutkan berdasarkan time_stamp 

    if (error) throw error;
    console.log(data); // Log data yang diambil dari Supabase
    return data[0]; // Return data terbaru
  } catch (error) {
    console.error("Error fetching data from Supabase:", error.message);
    return null;
  }
};
