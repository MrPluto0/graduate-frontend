<script setup lang="ts">
import { onMounted } from 'vue';
import { useGraphStore } from '@/store/modules/graph';
import { useEcharts } from '@/hooks/common/echarts';
import { appendData, round } from '@/utils/data';

defineOptions({
  name: 'LineChart'
});

const store = useGraphStore();

const { domRef, updateOptions } = useEcharts(() => ({
  title: {
    text: '单位时间网络时延趋势图',
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
    data: [0]
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} ms'
    }
  },
  series: [
    {
      name: '传输时延',
      type: 'line',
      data: [0],
      lineStyle: {
        color: '#ff6f61'
      },
      itemStyle: {
        color: '#ff6f61'
      }
    },
    {
      name: '计算时延',
      type: 'line',
      data: [0],
      lineStyle: {
        color: '#587aff'
      },
      itemStyle: {
        color: '#587aff'
      }
    }
  ]
}));

async function updateData() {
  updateOptions(opts => {
    const len = opts.xAxis.data.length;
    const state = store.algStatus.state;

    // 从后端获取真实的传输时延和计算时延
    const transferDelay = round(state?.transferDelay ?? 0);
    const computeDelay = round(state?.computeDelay ?? 0);

    appendData(opts.xAxis, opts.xAxis.data[len - 1] + 1);
    appendData(opts.series[0], transferDelay); // 传输时延
    appendData(opts.series[1], computeDelay); // 计算时延
    return opts;
  });
}

onMounted(() => {
  updateData();

  setInterval(() => {
    updateData();
  }, 2000);
});
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
