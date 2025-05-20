<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import CardData from './modules/card-data.vue';
import UserLog from './modules/user-log.vue';
import AlarmData from './modules/alarm-data.vue';
import PerfData from './modules/perf-data.vue';
import GraphData from './modules/graph-data.vue';
import LinePieChart from './modules/line-pie-chart.vue';
import LineChart from './modules/line-chart.vue';
import NodeTable from './modules/node-table.vue';
import LinkTable from './modules/link-table.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));
</script>

<template>
  <NSpace vertical :size="16">
    <!-- <HeaderBanner /> -->
    <CardData />

    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:8">
        <PerfData />
      </NGi>
      <NGi span="24 s:24 m:9">
        <GraphData />
      </NGi>
      <NGi span="24 s:24 m:7">
        <AlarmData />
      </NGi>
    </NGrid>

    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:9">
        <LineChart />
      </NGi>
      <NGi span="24 s:24 m:9">
        <LinePieChart />
      </NGi>
      <NGi span="24 s:24 m:6">
        <UserLog />
      </NGi>
    </NGrid>

    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:12">
        <NodeTable />
      </NGi>
      <NGi span="24 s:24 m:12">
        <LinkTable />
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
