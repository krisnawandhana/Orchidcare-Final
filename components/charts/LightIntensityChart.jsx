import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useSelector } from 'react-redux';

const LightIntensityChart = () => {
  const individuId = useSelector(state => state.homepage.individuId);
  const Logs = useSelector(state => state.homepage.logs);
  const [lightIntensityData, setLightIntensityData] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (Logs && individuId) {
      const filtered = Logs
        .filter(item => item.individu_id === individuId && item.lightIntensity != null)
        .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

      console.log('Filtered Light Logs:', filtered);

      const tempData = filtered.map(item => ({ value: parseFloat(item.lightIntensity) }));
      const labels = filtered.map((item, index) =>
        index % 2 === 0 ? item.timeStamp : ''
      );

      setLightIntensityData(tempData.length > 0 ? tempData : [{ value: 0 }]);
      setXAxisLabels(tempData.length > 0 ? labels : ['No Data']);
    } else {
      setLightIntensityData([{ value: 0 }]);
      setXAxisLabels(['No Data']);
    }

    setLoading(false);
  }, [Logs, individuId]);

  return (
    <View style={{ width: '100%', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
        Light Intensity Chart
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#8a56ce" />
      ) : (
      <LineChart
        areaChart
        curved
        width={330}
        data={lightIntensityData.length > 0 ? lightIntensityData : [{ value: 0 }]}
        xAxisLabelTexts={xAxisLabels.length > 0 ? xAxisLabels : ['--']}
        spacing={60}
        color1="#FFD700"
        startFillColor1="#FFD700"
        endFillColor1="#FFECB3"
        endFillColor2="#FFF9C4"
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
          pointerStripColor: '#FBC02D',
          pointerStripWidth: 2,
          strokeDashArray: [4, 6],
          pointerColor: '#FBC02D',
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
                {items[0]?.value} lux
              </Text>
            </View>
          ),
        }}
      />
      )}
    </View>
  );
};

export default LightIntensityChart;
