<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useGraphStore } from '@/store/modules/graph';

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
}

const store = useGraphStore();

const loading = ref(true);

const cardData = computed<CardData[]>(() => [
  {
    key: 'dataCount',
    title: '单位时间数据流量',
    value: 0,
    unit: ' bits',
    color: {
      start: '#ec4786',
      end: '#b955a4'
    }
  },
  {
    key: 'queueLen',
    title: '系统平均队列长度',
    value: store.algStatus.state?.totalQueue ?? 0,
    unit: ' bits',
    color: {
      start: '#56cdf3',
      end: '#719de3'
    }
  },
  {
    key: 'nodeCount',
    title: '系统当前时延',
    value: store.algStatus.state?.totalDelay ?? 0,
    unit: ' ms',
    color: {
      start: '#865ec0',
      end: '#5144b4'
    }
  },
  {
    key: 'linkCount',
    title: '系统当前能耗',
    value: store.algStatus.state?.totalEnergy ?? 0,
    unit: ' J',
    color: {
      start: '#fcbc25',
      end: '#f68057'
    }
  },
  {
    key: 'utilization',
    title: '系统活跃任务数',
    value: (store.algStatus.activeTasks ?? 0) * 100,
    unit: ' %',
    color: {
      start: '#ff4d4f',
      end: '#ff7875'
    }
  }
]);

onMounted(() => {
  loading.value = false;
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

    <NGrid cols="s:1 m:2 l:5" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in cardData" :key="item.key">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex flex-col flex-1 items-center">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-3px">
            <NSpin :show="loading" size="small">
              <!-- <CountTo :suffix="item.unit" :start-value="0" :end-value="item.value" /> -->
              <div class="text-25px text-white dark:text-dark">{{ item.value.toFixed(2) }} {{ item.unit }}</div>
            </NSpin>
          </div>
        </GradientBg>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
