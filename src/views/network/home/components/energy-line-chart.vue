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
    data: [0]
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} J'
    }
  },
  series: [
    {
      name: '实时',
      type: 'line',
      data: [0],
      lineStyle: {
        color: '#e67e22' // 设置线条颜色为红色
      },
      itemStyle: {
        color: '#e67e22' // 设置点的颜色为红色
      }
    },
    {
      name: '累计',
      type: 'line',
      data: [0],
      lineStyle: {
        color: '#d4a010' // 设置线条颜色为红色
      },
      itemStyle: {
        color: '#d4a010' // 设置点的颜色为红色
      }
    }
  ]
}));

async function updateData() {
  updateOptions(opts => {
    const len = opts.xAxis.data.length;
    const energy = store.algStatus.state?.totalEnergy ?? 0;
    const totalEnergy = opts.series[1].data[len - 1] || 0;

    appendData(opts.xAxis, opts.xAxis.data[len - 1] + 1);
    appendData(opts.series[0], round(energy));
    appendData(opts.series[1], round((totalEnergy * (len - 1) + energy) / len));
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
