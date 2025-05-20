<script setup lang="ts">
import { ref } from 'vue';
import type { VueUiQuickChartConfig } from 'vue-data-ui';
import { VueUiQuickChart } from 'vue-data-ui';
import 'vue-data-ui/style.css';

const dataset = ref([
  {
    name: '节点一',
    values: [45, 48, 52, 55, 50, 48, 46, 49, 51]
  },
  {
    name: '节点二',
    values: [62, 65, 60, 58, 63, 67, 64, 61, 63]
  },
  {
    name: '节点三',
    values: [35, 38, 42, 40, 37, 39, 41, 38, 36]
  },
  {
    name: '节点四',
    values: [55, 52, 54, 58, 56, 53, 51, 54, 57]
  }
]);

const config = ref<VueUiQuickChartConfig>({
  title: '各网络节点时间总能耗',
  height: 230,
  xyPeriods: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  yAxisLabel: '负载指数',
  showUserOptions: false,
  xyPaddingBottom: 10
});
</script>

<template>
  <NCard class="card-wrapper">
    <VueUiQuickChart :dataset="dataset" :config="config" />
  </NCard>
</template>
