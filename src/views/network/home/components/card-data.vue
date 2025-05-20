<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

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

const overviewData = ref({
  dataCount: 100123,
  queueLen: 12312,
  delay: 12,
  energy: 123,
  utilization: 90
});

const loading = ref(true);

const cardData = computed<CardData[]>(() => [
  {
    key: 'dataCount',
    title: '单位时间数据流量',
    value: overviewData.value.dataCount,
    unit: ' bits',
    color: {
      start: '#ec4786',
      end: '#b955a4'
    }
  },
  {
    key: 'queueLen',
    title: '系统平均队列长度',
    value: overviewData.value.queueLen,
    unit: ' bits',
    color: {
      start: '#56cdf3',
      end: '#719de3'
    }
  },
  {
    key: 'nodeCount',
    title: '系统当前时延',
    value: overviewData.value.delay,
    unit: ' ms',
    color: {
      start: '#865ec0',
      end: '#5144b4'
    }
  },
  {
    key: 'linkCount',
    title: '系统当前能耗',
    value: overviewData.value.energy,
    unit: ' J',
    color: {
      start: '#fcbc25',
      end: '#f68057'
    }
  },
  {
    key: 'utilization',
    title: '系统当前资源利用率',
    value: overviewData.value.utilization,
    unit: ' %',
    color: {
      start: '#ff4d4f',
      end: '#ff7875'
    }
  }
]);

onMounted(() => {
  setInterval(() => {
    if (!overviewData.value) return;
    // 模拟数据更新
    overviewData.value.dataCount = Math.floor(Math.random() * 100000);
    overviewData.value.queueLen = Math.floor(Math.random() * 10000);
    overviewData.value.delay = Math.floor(Math.random() * 100);
    overviewData.value.energy = Math.floor(Math.random() * 1000);
  }, 4000);

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
              <CountTo
                :suffix="item.unit"
                :start-value="0"
                :end-value="item.value"
                class="text-25px text-white dark:text-dark"
              />
            </NSpin>
          </div>
        </GradientBg>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
