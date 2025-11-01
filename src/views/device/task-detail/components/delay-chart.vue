<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

interface Props {
  metricsHistory?: Api.Alg.SlotMetrics[];
}

const props = withDefaults(defineProps<Props>(), {
  metricsHistory: () => []
});

// 图表配置 - 时延趋势
const { domRef, updateOptions } = useEcharts(() => ({
  title: {
    text: '时延趋势图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['传输时延', '计算时延', '总时延'],
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
      formatter: '{value} ms'
    }
  },
  series: [
    {
      name: '传输时延',
      type: 'line',
      data: [0],
      smooth: true,
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
      smooth: true,
      lineStyle: {
        color: '#587aff'
      },
      itemStyle: {
        color: '#587aff'
      }
    },
    {
      name: '总时延',
      type: 'line',
      data: [0],
      smooth: true,
      lineStyle: {
        color: '#9c27b0'
      },
      itemStyle: {
        color: '#9c27b0'
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
      const transferDelay = history.map(h => Number(h.transferDelay ?? 0));
      const computeDelay = history.map(h => Number(h.computeDelay ?? 0));
      const totalDelay = history.map(h => Number(h.totalDelay ?? 0));

      updateOptions(opts => {
        opts.xAxis.data = periods;
        opts.series[0].data = transferDelay;
        opts.series[1].data = computeDelay;
        opts.series[2].data = totalDelay;
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
