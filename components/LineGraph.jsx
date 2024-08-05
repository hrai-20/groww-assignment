import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { COLORS, SIZES } from '../constants/theme';

const LineGraph = ({ lineData }) => {
  const chartData = lineData.map(item => ({
    value: item.value,
    label: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  // Calculate the maximum value for y-axis
  const maxY = Math.max(...chartData.map(item => item.value));
  // Define a sensible upper limit based on the maximum value
  const yAxisMax = maxY > 10 ? Math.ceil(maxY / 10) * 10 : 1;

  return (
    <View style={{ paddingVertical: 5 }}>
      <LineChart
        width={SIZES.width * 0.8}
        yAxisTextStyle={{ fontSize: 8 }}
        yAxisLabelPrefix="$ "
        areaChart
        curved
        hideDataPoints
        isAnimated
        animationDuration={1000}
        startFillColor="#496ebc"
        startOpacity={0.5}
        endOpacity={0}
        initialSpacing={0}
        data={chartData}
        spacing={10}
        thickness={1}
        hideRules
        yAxisColor={COLORS.tertiary}
        xAxisColor={COLORS.tertiary}
        color="#496ebc"
        yAxisMin={0}
        yAxisMax={yAxisMax}
        yAxisLabelCount={5}
        xAxisLabelStyle={{ fontSize: 10, color: COLORS.tertiary }} // Add style for x-axis labels
        xAxisData={chartData.map(item => item.label)} // Set x-axis labels
        xAxisLabelCount={Math.min(chartData.length, 10)} // Adjust the number of x-axis labels if needed
      />
    </View>
  );
};

export default LineGraph;
