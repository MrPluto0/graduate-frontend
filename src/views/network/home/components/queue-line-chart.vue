<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { VueUiQuickChartConfig } from 'vue-data-ui';
import { VueUiQuickChart } from 'vue-data-ui';
import { useGraphStore } from '@/store/modules/graph';
import 'vue-data-ui/style.css';

const dataset = ref([
  {
    name: '节点一',
    values: [0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: '节点二',
    values: [0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: '节点三',
    values: [0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: '节点四',
    values: [0, 0, 0, 0, 0, 0, 0]
  }
]);

const config = ref<VueUiQuickChartConfig>({
  title: '各网络节点时间平均队列长度',
  height: 230,
  xyPeriods: [0, 1, 2, 3, 4, 5, 6],
  yAxisLabel: '队列长度(bits)',
  showUserOptions: false,
  xyPaddingBottom: 10,
  xyScaleSegments: 5
});

const store = useGraphStore();

onMounted(() => {
  setInterval(() => {
    if (dataset.value[0].values.length >= 10) {
      config.value.xyPeriods = config.value.xyPeriods?.map(v => Number(v) + 1);
    } else {
      config.value.xyPeriods?.push(config.value.xyPeriods.length);
    }
    dataset.value.forEach((item, idx) => {
      if (dataset.value[idx].values.length >= 10) {
        item.values.shift();
      }
      item.values.push(store.algStatus?.eachQueue[idx]);
    });
  }, 1000);
});
</script>

<template>
  <NCard class="card-wrapper">
    <VueUiQuickChart :dataset="dataset" :config="config" />
  </NCard>
</template>
