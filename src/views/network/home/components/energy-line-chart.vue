<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { VueUiQuickChartConfig } from 'vue-data-ui';
import { VueUiQuickChart } from 'vue-data-ui';
import { useGraphStore } from '@/store/modules/graph';
import 'vue-data-ui/style.css';

const dataset = ref([
  {
    name: '节点能耗',
    values: [0, 0, 0, 0, 0, 0, 0]
  }
]);

const config = ref<VueUiQuickChartConfig>({
  title: '系统的总能耗',
  height: 230,
  xyPeriods: [0, 1, 2, 3, 4, 5, 6],
  yAxisLabel: '能耗(J)',
  showUserOptions: false,
  xyPaddingBottom: 10,
  dataLabelRoundingValue: 2
});

const store = useGraphStore();

onMounted(() => {
  setInterval(() => {
    if (dataset.value[0].values.length >= 10) {
      dataset.value[0].values.shift();
      config.value.xyPeriods = config.value.xyPeriods?.map(v => Number(v) + 1);
    } else {
      config.value.xyPeriods?.push(config.value.xyPeriods.length);
    }
    dataset.value[0].values.push(store.algStatus?.energy ?? 0);
  }, 1000);
});
</script>

<template>
  <NCard class="card-wrapper">
    <VueUiQuickChart :dataset="dataset" :config="config" />
  </NCard>
</template>
