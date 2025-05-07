import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useSelector } from 'react-redux';

const OverallGrowthChart = () => {
  const Logs = useSelector(state => state.homepage.logs);
  const individuId = useSelector(state => state.homepage.individuId);

  const [growthScores, setGrowthScores] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);

  useEffect(() => {
    if (Logs && individuId) {
      const filtered = Logs
        .filter(log => log.individu_id === individuId && log.value != null)
        .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

      const scores = filtered.map(item => ({ value: Math.round(item.value) }));
      const labels = filtered.map((item, index) =>
        index % 2 === 0 ? item.timeStamp : '' // supaya tidak terlalu padat label-nya
      );

      setGrowthScores(scores.length > 0 ? scores : [{ value: 0 }]);
      setXAxisLabels(labels.length > 0 ? labels : ['No Data']);
    } else {
      setGrowthScores([{ value: 0 }]);
      setXAxisLabels(['No Data']);
    }
  }, [Logs, individuId]);

  return (
    <View className="flex-1 bg-[#F7FBFF] justify-center items-center">
      <Text className="text-lg font-bold mb-2 text-gray-800">Fuzzy Growth Chart</Text>
      <LineChart
        areaChart
        curved
        width={300}
        height={200}
        data={growthScores}
        xAxisLabelTexts={xAxisLabels}
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
