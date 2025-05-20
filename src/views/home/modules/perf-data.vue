<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { VueDataUi, type VueUiWheelConfig, type VueUiWheelDataset } from 'vue-data-ui';
import 'vue-data-ui/style.css';

const config = ref<VueUiWheelConfig>({
  userOptions: {
    show: false
  }
});

const cpuPerf = ref<VueUiWheelDataset>({
  percentage: 66.6
});
const memPerf = ref<VueUiWheelDataset>({
  percentage: 45.2
});
const diskPerf = ref<VueUiWheelDataset>({
  percentage: 78.3
});

const updatePerfData = () => {
  cpuPerf.value.percentage = Math.random() * 100;
  memPerf.value.percentage = Math.random() * 100;
  diskPerf.value.percentage = Math.random() * 100;
};

onMounted(() => {
  setInterval(() => {
    updatePerfData();
  }, 3000);
});
</script>

<template>
  <NCard title="整体监控" class="card-wrapper">
    <div class="flex items-center justify-between gap-6">
      <div class="flex flex-col flex-1 items-center">
        <VueDataUi component="VueUiWheel" :dataset="cpuPerf" :config="config" />
        <div class="mt-2 text-center">
          <div class="text-16px font-medium">CPU</div>
          <div class="text-14px text-gray-500">处理器平均使用率</div>
        </div>
      </div>

      <div class="flex flex-col flex-1 items-center">
        <VueDataUi component="VueUiWheel" :dataset="memPerf" :config="config" />
        <div class="mt-2 text-center">
          <div class="text-16px font-medium">内存</div>
          <div class="text-14px text-gray-500">内存平均使用率</div>
        </div>
      </div>

      <div class="flex flex-col flex-1 items-center">
        <VueDataUi component="VueUiWheel" :dataset="diskPerf" :config="config" />
        <div class="mt-2 text-center">
          <div class="text-16px font-medium">存储</div>
          <div class="text-14px text-gray-500">磁盘平均使用率</div>
        </div>
      </div>
    </div>
  </NCard>
</template>

<style scoped>
.text-primary {
  color: #4f46e5;
}
</style>
