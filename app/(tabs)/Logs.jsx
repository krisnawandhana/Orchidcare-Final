import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import useLogs from "../../hook/useLogs";

// Fungsi untuk menentukan apakah data optimal atau tidak
const getStatus = (value, { min, max }) => {
  if (value < min) return "Rendah";
  if (value > max) return "Tinggi";
  return "Optimal";
};

const Logs = () => {
  const { clearLogs } = useLogs();
  const individuId = useSelector((state) => state.homepage.individuId); // Ambil individu_id yang dipilih
  const orchidThresholds = useSelector((state) => state.homepage.orchidThresholds); // Ambil threshold untuk anggrek
  const logs = useSelector((state) => state.homepage.logs); // Ambil logs dari state Redux


  // Filter logs berdasarkan individu_id yang dipilih
  const filteredLogs = logs.filter((log) => log.individu_id === individuId);
  // console.log(filteredLogs); // Periksa apakah filter menghasilkan lebih dari satu log

  return (
    <View className="container flex-1 bg-[#F7FBFF]">
      <View className="w-full max-w-md px-4">
        <View className="flex-row justify-between items-center border-b py-4">
          <Text className="text-2xl font-extrabold text-purple-600">LOGS</Text>
          <TouchableOpacity onPress={clearLogs}>
            <Text className="text-purple-500">Clear all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView className="mb-20">
          {filteredLogs.length === 0 ? (
            <Text className="text-center text-lg text-gray-500">No logs found for selected orchid.</Text>
          ) : (
            filteredLogs.map((log) => (
              <View key={log.id} className="flex-row justify-between items-center border-b py-4">
                <View className="flex-1 flex-row items-center">
                  <Text className="text-3xl font-extrabold mr-4 text-purple-400">{log.id}</Text>
                  <View>
                    <Text className="text-sm">
                      Temperature: {log.temperature}°C {getStatus(log.temperature, orchidThresholds.temperature)}
                    </Text>
                    <Text className="text-sm">
                      Humidity: {log.humidity}% {getStatus(log.humidity, orchidThresholds.humidity)}
                    </Text>
                    <Text className="text-sm">
                      Light: {log.lightIntensity} Lux {getStatus(log.lightIntensity, orchidThresholds.lightIntensity)}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {new Intl.DateTimeFormat('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }).format(new Date(log.timeStamp))}
                    </Text>
                  </View>
                </View>
                <Text className={`text-4xl font-bold ${log.color}`}>{log.value}%</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Logs;
