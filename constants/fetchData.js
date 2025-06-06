// constants/fetchData.js

import { supabase } from '../lib/supabase';

// Fetch temperature data
export const fetchTemperatureData = async (individuId) => {
  try {
    const { data, error } = await supabase
      .from('data_table')
      .select('temperature, time_stamp')
      .eq('individu_id', individuId)  // Menambahkan filter berdasarkan individu_id
      .order('time_stamp', { ascending: true }); // Ambil data secara berurutan berdasarkan waktu

    if (error) throw error;

    // Map data untuk format yang dibutuhkan
    const mappedData = data.map(item => ({
      value: item.temperature,
      label: item.time_stamp,  // Gunakan time_stamp langsung tanpa konversi
    }));

    return mappedData;
  } catch (error) {
    console.error('Error fetching temperature data:', error.message);
    return []; // Return array kosong jika ada error
  }
};

// Fetch humidity data
export const fetchHumidityData = async (individuId) => {
  try {
    const { data, error } = await supabase
      .from('data_table')
      .select('humidity, time_stamp')
      .eq('individu_id', individuId)  // Menambahkan filter berdasarkan individu_id
      .order('time_stamp', { ascending: true }); // Ambil data secara berurutan berdasarkan waktu

    if (error) throw error;

    // Map data untuk format yang dibutuhkan
    const mappedData = data.map(item => ({
      value: item.humidity,
      label: item.time_stamp,  // Gunakan time_stamp langsung tanpa konversi
    }));

    return mappedData;
  } catch (error) {
    console.error('Error fetching humidity data:', error.message);
    return []; // Return array kosong jika ada error
  }
};

// Fetch light intensity data
export const fetchLightIntensityData = async (individuId) => {
  try {
    const { data, error } = await supabase
      .from('data_table')
      .select('light_intensity, time_stamp')
      .eq('individu_id', individuId)  // Menambahkan filter berdasarkan individu_id
      .order('time_stamp', { ascending: true }); // Ambil data secara berurutan berdasarkan waktu

    if (error) throw error;

    // Map data untuk format yang dibutuhkan
    const mappedData = data.map(item => ({
      value: item.light_intensity,
      label: item.time_stamp,  // Gunakan time_stamp langsung tanpa konversi
    }));

    return mappedData;
  } catch (error) {
    console.error('Error fetching light intensity data:', error.message);
    return []; // Return array kosong jika ada error
  }
};