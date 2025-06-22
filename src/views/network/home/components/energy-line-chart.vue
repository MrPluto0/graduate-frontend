<script setup lang="ts">
import { onMounted } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'LineChart'
});

const { domRef, updateOptions } = useEcharts(() => ({
  title: {
    text: '单位时间网络能耗趋势图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} J'
    }
  },
  series: [
    {
      name: 'Node1',
      type: 'line',
      data: [0.6, 0.8, 0.9, 0.1, 0.23, 0.57, 0.87]
    }
  ]
}));

async function mockData() {
  updateOptions(opts => {
    opts.series[0].data.shift();
    opts.series[0].data.push(Math.random());
    return opts;
  });
}

onMounted(() => {
  mockData();

  setInterval(() => {
    mockData();
  }, 2000);
});
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
