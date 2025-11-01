<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEcharts } from '@/hooks/common/echarts';
import { useMonitorStore } from '@/store/modules/monitor/index';

defineOptions({
  name: 'LineChart'
});

const monitorStore = useMonitorStore();
const { metrics } = storeToRefs(monitorStore);

let intervalId: NodeJS.Timeout | null = null;

const { domRef, updateOptions } = useEcharts(() => ({
  series: [
    {
      type: 'gauge',
      center: ['18%', '50%'],
      axisLine: {
        lineStyle: {
          width: 5,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      axisTick: {
        distance: -30,
        length: 8,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      splitLine: {
        distance: -40,
        length: 30,
        lineStyle: {
          color: '#fff',
          width: 4
        }
      },
      axisLabel: {
        color: 'inherit',
        distance: 20,
        fontSize: 10
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: 'inherit',
        fontSize: 15
      },
      title: {
        offsetCenter: [0, '100%']
      },
      data: [
        {
          value: 70,
          name: 'CPU使用率'
        }
      ]
    },
    {
      type: 'gauge',
      center: ['50%', '50%'],
      axisLine: {
        lineStyle: {
          width: 5,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      axisTick: {
        distance: -30,
        length: 8,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      splitLine: {
        distance: -40,
        length: 30,
        lineStyle: {
          color: '#fff',
          width: 4
        }
      },
      axisLabel: {
        color: 'inherit',
        distance: 20,
        fontSize: 10
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: 'inherit',
        fontSize: 15
      },
      title: {
        offsetCenter: [0, '100%']
      },
      data: [
        {
          value: 70,
          name: '内存使用率'
        }
      ]
    },
    {
      type: 'gauge',
      center: ['82%', '50%'],
      axisLine: {
        lineStyle: {
          width: 5,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      axisTick: {
        distance: -30,
        length: 8,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      splitLine: {
        distance: -40,
        length: 30,
        lineStyle: {
          color: '#fff',
          width: 4
        }
      },
      axisLabel: {
        color: 'inherit',
        distance: 20,
        fontSize: 10
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: 'inherit',
        fontSize: 15
      },
      title: {
        offsetCenter: [0, '100%']
      },
      data: [
        {
          value: 10,
          name: 'Goroutines'
        }
      ]
    }
  ]
}));

async function updateMetrics() {
  await monitorStore.fetchSystemMetrics();

  if (metrics.value) {
    updateOptions(opts => {
      opts.series[0].data[0].value = Math.round(metrics.value!.cpu_usage);
      opts.series[1].data[0].value = Math.round(metrics.value!.mem_usage_rate);
      opts.series[2].data[0].value = Math.min(100, Math.round(metrics.value!.goroutine_count * 2));
      return opts;
    });
  }
}

onMounted(() => {
  updateMetrics();
  intervalId = setInterval(() => {
    updateMetrics();
  }, 3000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <NCard title="性能指标" :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden" style="height: 210px"></div>
  </NCard>
</template>

<style scoped></style>
