import React, { useState, useEffect, useRef  } from "react";
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from "react-native";
import { BellIcon } from "react-native-heroicons/outline";
import { supabase } from "../../lib/supabase";
import { calculateFuzzyScore } from "../../constants/fuzzyLogic";
import PopupMenu from "../../components/PopupMenu";
import * as Notifications from 'expo-notifications';
import { initializeNotifications } from "../../lib/notification";


initializeNotifications();

const Homepage = () => {
  const [latestData, setLatestData] = useState(null);
  const [fuzzyScore, setFuzzyScore] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const notificationIdentifierRef = useRef(null);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const fetchDataFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('data_table')
        .select('id, temperature, humidity, light_intensity, time_stamp')
        .order('time_stamp', { ascending: false }) // Mengurutkan berdasarkan time_stamp yang terbaru
        .limit(1); // Ambil hanya 1 entri terbaru
  
      if (error) throw error;
      return data[0]; // Return data terbaru
    } catch (error) {
      console.error('Error fetching data from Supabase:', error.message);
      return null;
    }

  };

  const scheduleNotification = async (title, body, seconds = 1) => {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds },
    });
    return identifier;
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchDataFromSupabase();
      setLatestData(data); // Set data terbaru ke state

      if(data){
        const score = calculateFuzzyScore(
          data.temperature, 
          data.humidity, 
          data.light_intensity
        );
        setFuzzyScore(score); // Set fuzzy score ke state

        if (score < 50) {
          const title = "Growth Alert!";
          const body = `Fuzzy score is low (${score.toFixed(2)}%). Check your plant's condition.`;
          scheduleNotification(title, body);
        }
      }
    };

    getData();

    // Berlangganan ke perubahan tabel Supabase
    const dataTable = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "data_table" },
        () => {
          console.log("Data table changed, fetching latest data...");
          getData(); // Ambil data terbaru saat ada perubahan
        }
      )
      .subscribe();

    // Bersihkan langganan saat komponen di-unmount
    return () => {
      supabase.removeChannel(dataTable);
    };
  }, []);

  return (
    <ScrollView className="container bg-[#F7FBFF]">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <Image
              source={require("../../assets/profile/profile.png")}
              className="w-14 h-14 rounded-full"
            />
          </View>
          <View className="mr-40">
            <Text className=" text-purple-600 text-xl font-semibold">Hi, Tari</Text>
            <Text className="text-purple-600 text-sm">Welcome to Orchidcare</Text>
          </View>
          <TouchableOpacity  onPress={togglePopup}>
            <BellIcon className="" size={30} color="#9D4EDD" />
          </TouchableOpacity>
          <PopupMenu isVisible={isPopupVisible} onClose={togglePopup} />
        </View>


        {/* Search Bar */}
        <View className="mt-6 bg-white flex-row items-center rounded-full px-4 py-2 shadow-md">
          <TextInput
            placeholder="Search..."
            className="flex-1 text-gray-600"
          />
        </View>

        {/* Recent Updates */}
        <View className="flex-row justify-between items-center my-4">
          <Text className="text-purple-600 text-lg font-bold">
            Recent Updates
          </Text>
          <Text className="text-purple-600 text-lg font-semibold">
            {latestData ? 
            new Intl.DateTimeFormat('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true // optional: set to false for 24-hour format
              }).format(new Date(latestData.time_stamp)) 
            : "Loading..."}
          </Text>
        </View>
        <View className="flex-row justify-between h-36">
          {/* Temperature */}
          <View className="bg-white rounded-lg shadow-md p-4 w-26 items-center">
            <Image
              source={require("../../assets/homepage/temperature.png")}
              className="w-16 h-16"
            />
            <View className="mt-2 items-center">
              <Text className="text-md font-bold text-gray-600">Temp</Text>
              <Text className="text-md font-medium text-gray-600">{latestData ? `${latestData.temperature}°C` : 'Loading...'}</Text>
            </View>
          </View>
          {/* Humidity */}
          <View className="bg-white rounded-lg shadow-md p-4 w-26 items-center">
            <Image
              source={require("../../assets/homepage/humidity.png")}
              className="w-16 h-16 my-auto"
            />
            <View className="items-center">
              <Text className="text-md font-bold text-gray-600">Humidity</Text>
              <Text className="text-md font-medium text-gray-600">{latestData ? `${latestData.humidity}%` : 'Loading...'}</Text>
            </View>
          </View>
          {/* Light Intensity */}
          <View className="bg-white rounded-lg shadow-md p-4 w-26 items-center">
            <Image
              source={require("../../assets/homepage/light_intensity.png")}
              className="w-16 h-16"
            />
            <View className="mt-2 items-center">
              <Text className="text-md font-bold text-gray-600">Light</Text>
              <Text className="text-md font-medium text-gray-600">{latestData ? `${latestData.light_intensity} Lux` : 'Loading...'}</Text>
            </View>
          </View>
          {/* Logs */}
          <View className="bg-white rounded-lg shadow-md p-4 w-26 items-center">
            <Image
              source={require("../../assets/homepage/growth_score.png")}
              className="w-16 h-16"
            />
            <View className="mt-2 items-center">
              <Text className="text-md font-bold text-gray-600">Score</Text>
              <Text className="text-md font-medium text-gray-600">{fuzzyScore !== null ? `${fuzzyScore.toFixed(2)}%` : "Loading..."}</Text>
            </View>
          </View>
        </View>

        {/* Banner */}
        <View className="relative mt-6 bg-white rounded-lg shadow-md">
          <Image
            source={require("../../assets/homepage/orchid-img.png")}
            className="w-full h-48 rounded-lg"
          />
          {/* Teks di atas gambar */}
          <View className="absolute inset-0 flex justify-center items-start mx-4">
            <Text className="text-violet-600 text-2xl font-bold mr-40">
              Take care of your plants
            </Text>
            <Text className="text-slate-400 text-md font-normal mr-40 my-2">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </Text>
          </View>
        </View>


        {/* Growth Graph */}
        <View className="mt-6">
          <Text className="text-purple-600 text-lg font-bold">Growth Graph</Text>
          <Image
            source={{ uri: "https://via.placeholder.com/300x150" }}
            className="w-full h-32 mt-4 rounded-lg"
          />
        </View>
    </ScrollView>
  );
};

export default Homepage;