<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { VueUiQuickChartConfig } from 'vue-data-ui';
import { VueUiQuickChart } from 'vue-data-ui';
import 'vue-data-ui/style.css';

const dataset = ref([
  {
    name: '节点一',
    values: [28, 26, 29, 27, 30, 29, 28, 27, 25, 24, 23]
  },
  {
    name: '节点二',
    values: [22, 23, 21, 22, 24, 25, 23, 22, 20, 19, 18]
  },
  {
    name: '节点三',
    values: [17, 16, 18, 19, 18, 17, 16, 15, 14, 13, 12]
  },
  {
    name: '节点四',
    values: [13, 12, 14, 13, 12, 11, 10, 11, 12, 11, 10]
  }
]);

const config = ref<VueUiQuickChartConfig>({
  title: '各网络节点时间总时延',
  height: 230,
  xyPeriods: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  yAxisLabel: '时延(ms)',
  showUserOptions: false,
  xyPaddingBottom: 10,
  xyScaleSegments: 5
});

onMounted(() => {
  setInterval(() => {
    dataset.value.forEach(item => {
      item.values.shift();
      item.values.push(Math.floor(Math.random() * 20) + 10);
    });
  }, 3000);
});
</script>

<template>
  <NCard class="card-wrapper">
    <VueUiQuickChart :dataset="dataset" :config="config" />
  </NCard>
</template>
