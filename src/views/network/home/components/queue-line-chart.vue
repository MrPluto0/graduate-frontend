<script setup lang="ts">
import { onMounted } from 'vue';
import { useGraphStore } from '@/store/modules/graph';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'LineChart'
});

const store = useGraphStore();

const { domRef, updateOptions } = useEcharts(() => ({
  title: {
    text: '单位时间网络队列趋势图',
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
    data: [1, 2, 3, 4, 5, 6, 7]
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} bits'
    }
  },
  series: [
    {
      name: 'Node1',
      type: 'line',
      data: [13300, 13222, 10157, 13794, 26090, 23032, 21360]
    }
  ]
}));

async function mockData() {
  updateOptions(opts => {
    opts.xAxis.data.push(opts.xAxis.data.length);
    opts.series[0].data.push(store.algStatus.queue ?? 0);
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
