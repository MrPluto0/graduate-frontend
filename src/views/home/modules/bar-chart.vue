<script setup lang="ts">
import { onMounted } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'LineChart'
});

const { domRef, updateOptions } = useEcharts(() => ({
  title: {
    text: '单位时间网络流量趋势图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
}));

async function mockData() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  updateOptions(opts => {
    opts.series[0].data.shift();
    opts.series[0].data.push(Math.floor(Math.random() * 200));
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
