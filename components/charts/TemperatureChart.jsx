import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useSelector } from 'react-redux';

const TemperatureChart = () => {
  const individuId = useSelector(state => state.homepage.individuId);
  const Logs = useSelector(state => state.homepage.logs);
  const [temperatureData, setTemperatureData] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (Logs && individuId) {
      const filtered = Logs
        .filter(item => item.individu_id === individuId && item.temperature != null )
        .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
        
      console.log('Filtered Logs:', filtered); // Debugging line

      const tempData = filtered.map(item => ({ value: parseFloat(item.temperature) }));
      const labels = filtered.map((item, index) =>
        index % 2 === 0
          ? item.timeStamp  // Langsung menggunakan timeStamp sebagai label
          : ''
      );

      setTemperatureData(tempData.length > 0 ? tempData : [{ value: 0 }]);
      setXAxisLabels(tempData.length > 0 ? labels : ['No Data']);
    } else {
      setTemperatureData([{ value: 0 }]);
      setXAxisLabels(['No Data']);
    }

    setLoading(false);
  }, [Logs, individuId]);

  return (
    <View className="flex-1 bg-[#F7FBFF] justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-4 text-gray-800">Temperature Chart</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#8a56ce" />
      ) : (
        <LineChart
          areaChart
          curved
          width={320}
          height={220}
          data={temperatureData}
          xAxisLabelTexts={xAxisLabels}
          spacing={60}
          color1="#8a56ce"
          startFillColor1="#8a56ce"
          endFillColor1="#8a56ce"
          endFillColor2="#56acce"
          startOpacity={0.8}
          endOpacity={0.1}
          noOfSections={4}
          yAxisThickness={1}
          yAxisColor="gray"
          yAxisTextStyle={{ color: 'gray', fontSize: 12 }}
          xAxisColor="gray"
          xAxisLabelTextStyle={{
            fontSize: 10,
            color: 'gray',
            rotation: 45,
            marginTop: 5,
          }}
          xAxisThickness={1}
          rulesColor="lightgray"
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 1.5,
            strokeDashArray: [3, 3],
            pointerColor: '#8a56ce',
            radius: 5,
            pointerLabelWidth: 80,
            pointerLabelHeight: 40,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items) => (
              <View
                style={{
                  height: 40,
                  width: 80,
                  backgroundColor: '#2D2F41',
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{items[0]?.value}°C</Text>
              </View>
            ),
          }}
        />
      )}
    </View>
  );
};

export default TemperatureChart;
