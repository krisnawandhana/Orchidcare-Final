import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import TemperatureChart from '../../components/charts/TemperatureChart';
import HumidityChart from '../../components/charts/HumidityChart';
import LightIntensityChart from '../../components/charts/LightIntensityChart';

const Charts = () => {
  return (
    <View 
      className="flex-1 bg-[#F7FBFF]" 
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} 
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center my-6">
        <Text className="text-2xl font-bold text-gray-800">Monitoring Charts</Text>
      </View>

      <ScrollView className="">
        <TemperatureChart />
        <HumidityChart />
        <LightIntensityChart />
      </ScrollView>
    </View>
  );
};

export default Charts;
