import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchHumidityData, fetchLightIntensityData, fetchTemperatureData } from '../../constants/fetchData';
import { calculateFuzzyScore } from '../../constants/fuzzyLogic';
import { supabase } from '../../lib/supabase';

const Logs = () => {
  const [logs, setLogs] = useState([]);

  // Fetch data dari supabase
  const fetchLogsData = async () => {
    try {
      const [temperatureData, humidityData, lightIntensityData] = await Promise.all([
        fetchTemperatureData(),
        fetchHumidityData(),
        fetchLightIntensityData(),
      ]);

      // Gabungkan data menjadi format log
      const combinedLogs = temperatureData.map((temp, index) => {
        const humidity = humidityData[index]?.value || 0;
        const lightIntensity = lightIntensityData[index]?.value || 0;

        // Kalkulasi nilai fuzzy
        const fuzzyScore = calculateFuzzyScore(temp.value, humidity, lightIntensity);

        // Tentukan warna berdasarkan nilai fuzzy
        const color =
          fuzzyScore >= 80 ? 'text-green-500' : fuzzyScore >= 50 ? 'text-yellow-400' : 'text-red-500';
        
        return {
          id: index + 1,
          temperature: temp.value,
          humidity,
          lightIntensity,
          value: fuzzyScore.toFixed(2), // Gunakan skor fuzzy sebagai nilai
          color,
          timeStamp: temp.label, // Menggunakan label dari time_stamp
        };
      });

      setLogs(combinedLogs);
    } catch (error) {
      console.error('Error fetching logs data:', error.message);
    }
  };

  // Realtime subscription ke tabel data_table
  useEffect(() => {
    fetchLogsData(); // Fetch data awal

    const dataTable = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'data_table' },
        () => {
          console.log('Data table changed, fetching latest data...');
          fetchLogsData(); // Ambil data terbaru saat ada perubahan
        }
      )
      .subscribe();

    // Bersihkan langganan saat komponen di-unmount
    return () => {
      supabase.removeChannel(dataTable);
    };
  }, []);

  return (
    <>
      <ScrollView className="container flex-1 bg-[#F7FBFF]">
        <View className="flex-row justify-between items-center border-b py-4">
          <Text className="text-lg font-bold">LOGS</Text>
          <TouchableOpacity onPress={() => setLogs([])}>
            <Text className="text-purple-500">Clear all</Text>
          </TouchableOpacity>
        </View>
        {logs.map(log => (
          <View key={log.id} className="flex-row justify-between items-center border-b py-4">
            {/* Wrapper untuk ID dan data */}
            <View className="flex-1 flex-row items-center">
              {/* ID */}
              <Text className="text-3xl font-extrabold mr-4">{log.id}</Text>

              {/* Data */}
              <View>
                <Text>Temperature: {log.temperature}°C</Text>
                <Text>Humidity: {log.humidity}%</Text>
                <Text>Light Intensity: {log.lightIntensity} Lux</Text>
                <Text className="text-gray-400 text-sm">{log.timeStamp}</Text>
              </View>
            </View>

            {/* Value */}
            <Text className={`text-4xl font-bold ${log.color}`}>{log.value}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default Logs;
