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
      name: '实时',
      type: 'line',
      data: [0],
      lineStyle: {
        color: '#8d021f' // 设置线条颜色为红色
      },
      itemStyle: {
        color: '#8d021f' // 设置点的颜色为红色
      }
    },
    {
      name: '累计',
      type: 'line',
      data: [0],
      lineStyle: {
        color: '#ff6f61' // 设置线条颜色为红色
      },
      itemStyle: {
        color: '#ff6f61' // 设置点的颜色为红色
      }
    }
  ]
}));

async function updateData() {
  updateOptions(opts => {
    const len = opts.xAxis.data.length;
    const delay = store.algStatus.state?.totalDelay ?? 0;
    const totalDelay = opts.series[1].data[len - 1] || 0;

    appendData(opts.xAxis, opts.xAxis.data[len - 1] + 1);
    appendData(opts.series[0], round(delay));
    appendData(opts.series[1], round((totalDelay * (len - 1) + delay) / len));
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
