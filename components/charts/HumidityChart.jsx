import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useSelector } from 'react-redux';

const HumidityChart = () => {
  const individuId = useSelector(state => state.homepage.individuId);
  const Logs = useSelector(state => state.homepage.logs);
  const [humidityData, setHumidityData] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (Logs && individuId) {
      const filtered = Logs
        .filter(item => item.individu_id === individuId && item.humidity != null)
        .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

      console.log('Filtered Humidity Logs:', filtered); // Debugging line

      const tempData = filtered.map(item => ({ value: parseFloat(item.humidity) }));
      const labels = filtered.map((item, index) =>
        index % 2 === 0 ? item.timeStamp : ''
      );

      setHumidityData(tempData.length > 0 ? tempData : [{ value: 0 }]);
      setXAxisLabels(tempData.length > 0 ? labels : ['No Data']);
    } else {
      setHumidityData([{ value: 0 }]);
      setXAxisLabels(['No Data']);
    }

    setLoading(false);
  }, [Logs, individuId]);

  return (
    <View style={{ width: '100%', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
        Humidity Chart
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#8a56ce" />
      ) : (
      <LineChart
        areaChart
        curved
        width={330}
        data={humidityData}
        xAxisLabelTexts={xAxisLabels}
        spacing={60}
        color1="#56ACCE"
        startFillColor1="#56ACCE"
        endFillColor1="#A1C6EA"
        endFillColor2="#D4EAF7"
        startOpacity={0.9}
        endOpacity={0.2}
        noOfSections={5}
        yAxisColor="gray"
        yAxisThickness={1}
        rulesType="solid"
        rulesColor="#E0E0E0"
        yAxisTextStyle={{ color: '#666', fontSize: 12 }}
        xAxisColor="#B0BEC5"
        xAxisLabelTextStyle={{
          fontSize: 10,
          color: 'gray',
          rotation: 45,
          marginTop: 5,
        }}
        pointerConfig={{
          pointerStripUptoDataPoint: true,
          pointerStripColor: '#90A4AE',
          pointerStripWidth: 2,
          strokeDashArray: [4, 6],
          pointerColor: '#90A4AE',
          radius: 5,
          pointerLabelWidth: 90,
          pointerLabelHeight: 40,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: items => (
            <View
              style={{
                height: 40,
                width: 90,
                backgroundColor: '#37474F',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {items[0]?.value}%
              </Text>
            </View>
          ),
        }}
      />
      )}
    </View>
  );
};

export default HumidityChart;
