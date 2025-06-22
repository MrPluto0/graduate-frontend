<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import CardData from './components/card-data.vue';
import QueueLineChart from './components/queue-line-chart.vue';
import DelayLineChart from './components/delay-line-chart.vue';
import EnergyLineChart from './components/energy-line-chart.vue';
import GraphData from './components/graph-data.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));
</script>

<template>
  <NSpace vertical :size="16">
    <CardData />

    <div class="card-wrapper">
      <GraphData />
    </div>

    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:8">
        <QueueLineChart />
      </NGi>
      <NGi span="24 s:24 m:8">
        <DelayLineChart />
      </NGi>
      <NGi span="24 s:24 m:8">
        <EnergyLineChart />
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
