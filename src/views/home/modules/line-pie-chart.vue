<script setup lang="ts">
import { ref } from 'vue';
import { VueDataUi, type VueUiDonutEvolutionConfig, type VueUiDonutEvolutionDatasetItem } from 'vue-data-ui';
import 'vue-data-ui/style.css';

const dataset = ref<VueUiDonutEvolutionDatasetItem[]>([
  {
    name: '节点一',
    values: [25, 20, 15, 18, 22, 25, 28, 30, 25, 20, 15]
  },
  {
    name: '节点二',
    values: [15, 18, 20, 15, 18, 20, 22, 25, 20, 15, 12]
  },
  {
    name: '节点三',
    values: [10, 12, 15, 12, 15, 18, 15, 12, 15, 12, 10]
  },
  {
    name: '节点四',
    values: [5, 8, 10, 8, 5, 7, 10, 8, 5, 8, 5]
  }
]);

const config = ref<VueUiDonutEvolutionConfig>({
  userOptions: {
    show: false
  },
  style: {
    chart: {
      title: {
        text: '单位时间网络各节点流量趋势图',
        fontSize: 16,
        color: '#333'
      },
      layout: {
        height: 175,
        grid: {
          xAxis: {
            dataLabels: {
              values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
            }
          }
        }
      }
    }
  }
});
</script>

<template>
  <NCard class="card-wrapper">
    <VueDataUi component="VueUiDonutEvolution" :dataset="dataset" :config="config" />
  </NCard>
</template>
