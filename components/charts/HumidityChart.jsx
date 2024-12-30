import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { fetchHumidityData } from '../../constants/fetchData';

const HumidityChart = () => {
  const [humidityData, setHumidityData] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHumidityData();
        if (data.length > 0) {
          setHumidityData(data.map(item => ({ value: parseFloat(item.value) })));
          setXAxisLabels(data.map(item => item.label));
        } else {
          console.warn('No humidity data fetched');
          setHumidityData([]);
          setXAxisLabels([]);
        }
      } catch (error) {
        console.error('Error fetching humidity data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-[#F7FBFF] justify-center items-center">
      <Text className="text-2xl font-bold mb-4">Humidity Chart</Text>
      <LineChart
        areaChart
        curved
        width={300}
        data={humidityData.length > 0 ? humidityData : [{ value: 0 }]}
        xAxisLabelTexts={xAxisLabels.length > 0 ? xAxisLabels : ['--']}
        spacing={68}
        color1="#56acce"
        startFillColor1="#56acce"
        endFillColor1="#56acce"
        endFillColor2="#8a56ce"
        startOpacity={0.9}
        endOpacity={0.2}
        noOfSections={4}
        yAxisColor="white"
        yAxisThickness={0}
        rulesType="solid"
        rulesColor="gray"
        yAxisTextStyle={{ color: 'gray' }}
        xAxisColor="lightgray"
        pointerConfig={{
          pointerStripUptoDataPoint: true,
          pointerStripColor: 'lightgray',
          pointerStripWidth: 2,
          strokeDashArray: [2, 5],
          pointerColor: 'lightgray',
          radius: 4,
          pointerLabelWidth: 100,
          pointerLabelHeight: 50,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: items => (
            <View
              style={{
                height: 50,
                width: 100,
                backgroundColor: '#282C3E',
                borderRadius: 4,
                justifyContent: 'center',
                paddingLeft: 16,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{items[0]?.value}%</Text>
            </View>
          ),
        }}
      />
    </View>
  );
};

export default HumidityChart;
