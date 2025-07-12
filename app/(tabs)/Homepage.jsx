  // app/(tabs)/homepage.jsx
  import React, { useEffect, useState } from 'react';
  import { View, Text, ScrollView, Image } from 'react-native';
  import { useSelector, useDispatch } from 'react-redux';
  import { supabase, subscribeToDataTable  } from '../../lib/supabase';
  import { calculateFuzzyScore } from '../../constants/fuzzyLogic';
  import * as Notifications from 'expo-notifications';
  import { initializeNotifications } from '../../lib/notification';
  import { sendNotification } from '../../constants/fetchNotif';
  import { useRealtimeSubscription } from '../../hook/useRealtimeSubscription';
  import OverallGrowthChart from '../../components/charts/OverallGrowthChart';
  import { setLatestData, setFuzzyScore, setLogs, setIndividuId  } from '../features/homepageSlice';
  import { fetchHumidityData } from '../../constants/fetchData';
  import { fetchLightIntensityData } from '../../constants/fetchData';
  import { fetchTemperatureData } from '../../constants/fetchData';
  import DropdownMenu from '../../components/DropdownMenu';
  import { fetchLatestData } from '../../constants/fetchLatestData';

  initializeNotifications();
    
  const Homepage = () => {
    const dispatch = useDispatch();
    const latestData = useSelector((state) => state.homepage.latestData);
    const fuzzyScore = useSelector((state) => state.homepage.fuzzyScore);
    const individuId = useSelector((state) => state.homepage.individuId);
    const [notified, setNotified] = useState(false);
    const [Cards, setCards] = useState(null);

    const orchidVariants = Array.from({ length: 30 }, (_, index) => ({
      label: `Individu Anggrek ${index + 1}`,
      value: index + 1, // Pastikan ini berupa angka
    }));
    

    const fetchDataFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('data_table')
          .select('id, temperature, humidity, light_intensity, time_stamp')
          .eq('individu_id', individuId)
          .order('time_stamp', { ascending: false })
          .limit(1);

        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error fetching data from Supabase:', error.message);
        return null;
      }
    };

    const fetchLogsData = async () => {
      if (!individuId) return;

      try {
        const [temperatureData, humidityData, lightIntensityData] = await Promise.all([
          fetchTemperatureData(individuId),
          fetchHumidityData(individuId),
          fetchLightIntensityData(individuId),
        ]);

        if (!temperatureData.length || !humidityData.length || !lightIntensityData.length) {
          // console.log("Data not complete for individuId:", individuId);
          return;
        }

        const combinedLogs = temperatureData.map((temp, index) => {
          const humidity = humidityData[index]?.value || 0;
          const lightIntensity = lightIntensityData[index]?.value || 0;
          const fuzzyScore = calculateFuzzyScore(temp.value, humidity, lightIntensity);
          const color =
            fuzzyScore.score >= 60 ? 'text-green-500' : fuzzyScore.score >= 40 ? 'text-yellow-400' : 'text-red-500';

          return {
            id: index + 1,
            temperature: temp.value,
            humidity,
            lightIntensity,
            value: fuzzyScore.score,
            color,
            timeStamp: temp.label,
            individu_id: individuId,
          };
        });

        // console.log("Logs data before dispatch:", combinedLogs);
        dispatch(setLogs(combinedLogs));
      } catch (error) {
        console.error('Error fetching logs data:', error.message);
      }
    };

    const scheduleNotification = async (title, body) => {
      if (!notified) {
        console.log("Scheduling notification:", { title, body });  // Debug log
    
        await Notifications.scheduleNotificationAsync({
          content: { title, body },
          trigger: { seconds: 1 },
        });
    
        setNotified(true);
        setTimeout(() => setNotified(false), 1); // Reset setelah 1 menit
      }
    };

    const getData = async () => {
      if (!individuId) return;

      const data = await fetchDataFromSupabase();
      dispatch(setLatestData(data)); // Set data terbaru ke Redux store
      
      const cardData = await fetchLatestData(individuId);
      setCards(cardData);
      console.log("Latest data:", cardData);

      if (data) {
        const thresholds = [individuId];

        const score = calculateFuzzyScore(
          data.temperature,
          data.humidity,
          data.light_intensity,
          thresholds
        );
        dispatch(setFuzzyScore(score)); // Set fuzzy score ke Redux store

        if (cardData.fuzzyScore.score < 20) {
          console.log("Fuzzy score is low:", cardData.fuzzyScore.score);
          console.log("Recommendation:", Cards.fuzzyScore.recommendation);

          const title = "Growth Alert!";
          const body = `Fuzzy score is low (${cardData.fuzzyScore.score}%).${'\n'} ${mappedRecommendations} .`;
          scheduleNotification(title, body);

          const message = body;
          console.log("Sending notification:", message);
          const result = await sendNotification(message);

          if (result) {
            console.log("Notification saved to database:", result);
          } else {
            console.error("Failed to save notification to database.");
          }
        }
      }
    };

    const mappedRecommendations = Cards?.fuzzyScore?.recommendation
      ?.map((item, index) => `${index + 1}. ${item.trim()}`)
      .join('\n');

    // Berlangganan ke perubahan tabel Supabase
    useRealtimeSubscription(() => {
      if (individuId) {
        getData();
        fetchLogsData();
      }
    });

    useEffect(() => {
      if (individuId) {
        getData();
        fetchLogsData(); // Pastikan logs diperbarui sesuai anggrek yang dipilih
      }

      const unsubscribe = subscribeToDataTable(() => {
        getData();
        fetchLogsData();
      });

      return () => {
        if (unsubscribe) {
          unsubscribe(); // Pastikan unsubscribe dipanggil
        }
      };
    }, [individuId]); 

    return (
      <ScrollView className="container bg-[#F7FBFF]">
        {/* Header */}
        <View className="flex-row justify-left items-center mt-4">
          <View className="flex-row items-center">
            <Image
              source={require("../../assets/profile/profile.png")}
              className="w-14 h-14 rounded-full"
            />
          </View>
          <View className="mx-4">
            <Text className=" text-purple-600 text-xl font-semibold">Hi, Tari</Text>
            <Text className="text-purple-600 text-sm">Welcome to Orchidcare</Text>
          </View>
        </View>

        {/* Dropdown Menu */}
        <View className="mt-6 bg-white rounded-full shadow-md px-4 py-2">
        <DropdownMenu
            data={orchidVariants}
            selectedValue={individuId}
            onSelect={(value) => {
              dispatch(setIndividuId(value)); // Simpan individu yang dipilih di Redux
            }}
            placeholder="Pilih Individu Anggrek..."
          />
        </View>

        {/* Recent Updates */}
        <View className="flex-row justify-between items-center my-4">
          <Text className="text-purple-600 text-lg font-bold">
            Recent Updates
          </Text>
          <Text className="text-purple-600 text-lg font-semibold">
            {Cards ?
              new Intl.DateTimeFormat('en-US', {
                weekday: 'short',
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }).format(new Date(Cards.time_stamp))
              : "Loading..."}
          </Text>
        </View>

        {/* Data Cards */}
        <View className="flex-row justify-between h-36">
          {/* Temperature */}
          <View className="bg-white rounded-lg shadow-md p-4 w-26 items-center">
            <Image
              source={require("../../assets/homepage/temperature.png")}
              className="w-16 h-16"
            />
            <View className="mt-2 items-center">
              <Text className="text-md font-bold text-gray-600">Temp</Text>
              <Text className="text-md font-medium text-gray-600">{Cards ? `${Cards.temperature}°C` : 'Loading...'}</Text>
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
              <Text className="text-md font-medium text-gray-600">{Cards ? `${Cards.humidity}%` : 'Loading...'}</Text>
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
              <Text className="text-md font-medium text-gray-600">{Cards ? `${Cards.light_intensity} Lux` : 'Loading...'}</Text>
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
              <Text className="text-md font-medium text-gray-600">{Cards ? `${Cards.fuzzyScore.score}%` : "Loading..."}</Text>
            </View>
          </View>
        </View>

        {/* Banner */}
        <View className="relative mt-6 bg-white rounded-lg shadow-md">
          <Image
            source={require("../../assets/homepage/orchid-img.png")}
            className="w-full h-72 rounded-lg"
          />
          <View className="absolute inset-0 flex justify-center items-start mx-4">
            <Text className="text-violet-600 text-2xl font-bold mr-40">
              Recommendation
            </Text>
            <Text className="text-slate-400 text-md font-normal mr-24 my-2">
              {mappedRecommendations || 'Loading...'}
            </Text>
          </View>
        </View>

        {/* Growth Graph */}
        <View className="mb-6">
          <Text className="text-purple-600 text-lg font-bold my-4">Growth Graph</Text>
          <OverallGrowthChart selectedOrchid={individuId}/>
        </View>
      </ScrollView>
    );
  };

  export default Homepage;