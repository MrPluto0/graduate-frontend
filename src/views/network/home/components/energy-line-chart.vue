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
      name: '传输能耗',
      type: 'line',
      data: [0],
      lineStyle: {
        color: '#e67e22'
      },
      itemStyle: {
        color: '#e67e22'
      }
    },
    {
      name: '计算能耗',
      type: 'line',
      data: [0],
      lineStyle: {
        color: '#d4a010'
      },
      itemStyle: {
        color: '#d4a010'
      }
    }
  ]
}));

async function updateData() {
  updateOptions(opts => {
    const len = opts.xAxis.data.length;
    const state = store.algStatus.state;

    // 从后端获取真实的传输能耗和计算能耗
    const transferEnergy = round(state?.transferEnergy ?? 0);
    const computeEnergy = round(state?.computeEnergy ?? 0);

    appendData(opts.xAxis, opts.xAxis.data[len - 1] + 1);
    appendData(opts.series[0], transferEnergy); // 传输能耗
    appendData(opts.series[1], computeEnergy); // 计算能耗
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
