<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

interface Props {
  metricsHistory?: Api.Alg.SlotMetrics[];
}

const props = withDefaults(defineProps<Props>(), {
  metricsHistory: () => []
});

// 图表配置 - 任务处理进度
const { domRef, updateOptions } = useEcharts(() => ({
  title: {
    text: '任务处理进度',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['已处理数据', '队列数据'],
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
      formatter: '{value} KB'
    }
  },
  series: [
    {
      name: '已处理数据',
      type: 'line',
      data: [0],
      smooth: true,
      lineStyle: {
        color: '#18a058'
      },
      itemStyle: {
        color: '#18a058'
      }
    },
    {
      name: '队列数据',
      type: 'line',
      data: [0],
      smooth: true,
      lineStyle: {
        color: '#f0a020'
      },
      itemStyle: {
        color: '#f0a020'
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
      const processed = history.map(h => Number(h.processedData ?? 0));
      const queued = history.map(h => Number(h.queuedData ?? 0));

      updateOptions(opts => {
        opts.xAxis.data = periods;
        opts.series[0].data = processed;
        opts.series[1].data = queued;
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
