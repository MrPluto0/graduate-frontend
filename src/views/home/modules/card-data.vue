<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { fetchOverviewData } from '@/services/api/device';
import { useAlarmStore } from '@/store/modules/alarm/index';

defineOptions({
  name: 'CardData'
});

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  color: {
    start: string;
    end: string;
  };
  icon: string;
}

const alarmStore = useAlarmStore();
const { total: alarmCount } = storeToRefs(alarmStore);

const overviewData = ref({
  deviceCount: 0,
  activeCount: 0,
  nodeCount: 0,
  linkCount: 0
});

const loading = ref(true);
let intervalId: NodeJS.Timeout | null = null;

const cardData = computed<CardData[]>(() => [
  {
    key: 'deviceCount',
    title: '设备总数',
    value: overviewData.value.deviceCount,
    unit: '',
    color: {
      start: '#ec4786',
      end: '#b955a4'
    },
    icon: 'ant-design:laptop-outlined'
  },
  {
    key: 'activeCount',
    title: '在线设备',
    value: overviewData.value.activeCount,
    unit: '',
    color: {
      start: '#56cdf3',
      end: '#719de3'
    },
    icon: 'ant-design:check-circle-outlined'
  },
  {
    key: 'nodeCount',
    title: '网络节点',
    value: overviewData.value.nodeCount,
    unit: '',
    color: {
      start: '#865ec0',
      end: '#5144b4'
    },
    icon: 'ant-design:cluster-outlined'
  },
  {
    key: 'linkCount',
    title: '网络链路',
    value: overviewData.value.linkCount,
    unit: '',
    color: {
      start: '#fcbc25',
      end: '#f68057'
    },
    icon: 'ant-design:link-outlined'
  },
  {
    key: 'alarmCount',
    title: '异常报警数',
    value: alarmCount.value,
    unit: '',
    color: {
      start: '#ff4d4f',
      end: '#ff7875'
    },
    icon: 'ant-design:warning-outlined'
  }
]);

// 获取概览数据
async function getOverviewData() {
  loading.value = true;
  try {
    const data = await fetchOverviewData();
    overviewData.value = data;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getOverviewData();
  alarmStore.fetchAlarms(1, 10);

  // 每10秒刷新一次告警数量
  intervalId = setInterval(() => {
    alarmStore.fetchAlarms(1, 10);
  }, 10000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

interface GradientBgProps {
  gradientColor: string;
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

function getGradientColor(color: CardData['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <!-- define component start: GradientBg -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div class="rd-8px px-16px pb-4px pt-8px text-white" :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->

    <NGrid cols="m:2 l:5" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in cardData" :key="item.key">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <SvgIcon :icon="item.icon" class="text-32px" />
            <NSpin :show="loading" size="small">
              <CountTo
                :prefix="item.unit"
                :start-value="0"
                :end-value="item.value"
                class="text-30px text-white dark:text-dark"
              />
            </NSpin>
          </div>
        </GradientBg>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
