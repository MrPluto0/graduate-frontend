<script setup lang="ts">
import { onMounted } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'LineChart'
});

const { domRef, updateOptions } = useEcharts(() => ({
  title: {
    text: '单位时间网络各节点负载趋势图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: 30,
    data: ['Node1', 'Node2', 'Node3', 'Node4']
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
    type: 'value'
  },
  series: [
    {
      name: 'Node1',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Node2',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Node3',
      type: 'line',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Node4',
      type: 'line',
      data: [320, 332, 301, 334, 390, 330, 320]
    }
  ]
}));

async function mockData() {
  updateOptions(opts => {
    opts.series.forEach(series => {
      series.data.shift();
      series.data.push(Math.floor(Math.random() * 400));
    });
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
