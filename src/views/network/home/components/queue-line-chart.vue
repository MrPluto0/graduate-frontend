<script setup lang="ts">
import { ref } from 'vue';
import type { VueUiQuickChartConfig } from 'vue-data-ui';
import { VueUiQuickChart } from 'vue-data-ui';
import 'vue-data-ui/style.css';

const dataset = ref([
  {
    name: '节点一',
    values: [18500, 17000, 19000, 18000, 19500, 20000, 19000, 18500, 17500, 16500, 15500]
  },
  {
    name: '节点二',
    values: [15000, 16000, 15500, 14500, 15000, 16500, 15800, 15000, 14000, 13500, 13000]
  },
  {
    name: '节点三',
    values: [12000, 11500, 12500, 13000, 12800, 12000, 11500, 11000, 10500, 10000, 9500]
  },
  {
    name: '节点四',
    values: [8000, 7500, 8500, 8000, 7800, 7000, 6500, 6000, 5500, 5000, 5500]
  }
]);

const config = ref<VueUiQuickChartConfig>({
  title: '各网络节点时间平均队列长度',
  height: 230,
  xyPeriods: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  yAxisLabel: '负载指数',
  showUserOptions: false,
  xyPaddingBottom: 10,
  xyScaleSegments: 5
});
</script>

<template>
  <NCard class="card-wrapper">
    <VueUiQuickChart :dataset="dataset" :config="config" />
  </NCard>
</template>
