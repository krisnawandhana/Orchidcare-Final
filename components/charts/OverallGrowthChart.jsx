import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { fetchHumidityData, fetchLightIntensityData, fetchTemperatureData } from '../../constants/fetchData';
import { calculateFuzzyScore } from '../../constants/fuzzyLogic';

const OverallGrowthChart = () => {
  const [growthScores, setGrowthScores] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);

  const fetchDataAndCalculateFuzzyScores = async () => {
    try {
      const [temperatureData, humidityData, lightIntensityData] = await Promise.all([
        fetchTemperatureData(),
        fetchHumidityData(),
        fetchLightIntensityData(),
      ]);

      const combinedData = temperatureData.map((temp, index) => {
        const humidity = humidityData[index]?.value || 0;
        const lightIntensity = lightIntensityData[index]?.value || 0;
        const fuzzyScore = calculateFuzzyScore(temp.value, humidity, lightIntensity);

        return { value: fuzzyScore, timestamp: temp.label }; // Assuming temp.label contains time information
      });

      setGrowthScores(combinedData.map(data => ({ value: Math.round(data.value) })));
      setXAxisLabels(combinedData.map(data => data.timestamp)); // Use the timestamps as x-axis labels
    } catch (error) {
      console.error('Error fetching and processing data:', error);
    }
  };

  useEffect(() => {
    fetchDataAndCalculateFuzzyScores();
  }, []);

  return (
    <View className="flex-1 bg-[#F7FBFF] justify-center items-center">
      <LineChart 
        areaChart
        curved
        width={300}
        height={200}
        data={growthScores.length > 0 ? growthScores : [{ value: 0 }]}
        xAxisLabelTexts={xAxisLabels.length > 0 ? xAxisLabels : ['--']}
        spacing={68}
        color1="#9D4EDD"
        startFillColor1="#5A189A"
        endFillColor1="#9D4EDD"
        startOpacity={0.9}
        endOpacity={0.2}
        noOfSections={10}
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
        maxValue={100}
      />
    </View>
  );
};

export default OverallGrowthChart;
