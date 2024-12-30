import React from 'react';
import { ScrollView, View } from 'react-native';
import TemperatureChart from '../../components/charts/TemperatureChart';
import HumidityChart from '../../components/charts/HumidityChart';
import LightIntensityChart from '../../components/charts/LightIntensityChart';

const Charts = () => {
  return (
    <ScrollView className="container flex-1 bg-[#F7FBFF]">
      <View className="my-10">
        <TemperatureChart/>
        <HumidityChart />
        <LightIntensityChart />
      </View>
    </ScrollView>
  );
};

export default Charts;
