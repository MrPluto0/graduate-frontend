<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

interface Props {
  metricsHistory?: Api.Alg.SlotMetrics[];
}

const props = withDefaults(defineProps<Props>(), {
  metricsHistory: () => []
});

// 图表配置 - 能耗趋势
const { domRef, updateOptions } = useEcharts(() => ({
  title: {
    text: '能耗趋势图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['传输能耗', '计算能耗', '总能耗'],
    top: '30px'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '80px',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['0']
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
      smooth: true,
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
      smooth: true,
      lineStyle: {
        color: '#d4a010'
      },
      itemStyle: {
        color: '#d4a010'
      }
    },
    {
      name: '总能耗',
      type: 'line',
      data: [0],
      smooth: true,
      lineStyle: {
        color: '#16a085'
      },
      itemStyle: {
        color: '#16a085'
      }
    }
  ]
}));

// 监听数据变化并更新图表
watch(
  () => props.metricsHistory,
  async history => {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    if (history && history.length > 0) {
      const periods = history.map(h => `时隙${h.timeSlot}`);
      const transferEnergy = history.map(h => Number(h.transferEnergy ?? 0));
      const computeEnergy = history.map(h => Number(h.computeEnergy ?? 0));
      const totalEnergy = history.map(h => Number(h.totalEnergy ?? 0));

      updateOptions(opts => {
        opts.xAxis.data = periods;
        opts.series[0].data = transferEnergy;
        opts.series[1].data = computeEnergy;
        opts.series[2].data = totalEnergy;
        return opts;
      });
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div ref="domRef" class="h-360px"></div>
</template>

<style scoped>
.h-360px {
  height: 360px;
}
</style>
