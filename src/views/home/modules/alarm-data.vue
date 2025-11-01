<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { NCard, NEmpty, NList, NListItem, NText, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { Icon } from '@iconify/vue';
import { useAlarmStore } from '@/store/modules/alarm/index';

const alarmStore = useAlarmStore();
const { events, loading } = storeToRefs(alarmStore);

let intervalId: NodeJS.Timeout | null = null;

onMounted(() => {
  // 初始加载
  alarmStore.fetchAlarms(1, 10);

  // 每5秒刷新一次
  intervalId = setInterval(() => {
    alarmStore.fetchAlarms(1, 10);
  }, 5000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <NCard title="异常报警" class="card-wrapper">
    <template #header-extra>
      <Icon icon="tabler:alert-circle" class="text-xl text-red" />
    </template>

    <NList v-if="events.length" class="alarm-list">
      <TransitionGroup name="list">
        <NListItem v-for="alarm in events.slice(0, 4)" :key="alarm.id">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <NTag type="warning" class="mr-2">{{ alarm.eventType }}</NTag>
              <NText>{{ alarm.name }}</NText>
            </div>
            <NText depth="3" size="small">{{ dayjs(alarm.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</NText>
          </div>
        </NListItem>
      </TransitionGroup>
    </NList>
    <NEmpty v-else description="暂无报警信息" />
  </NCard>
</template>

<style scoped>
.alarm-list {
  overflow: hidden;
  /* TODO */
  height: 205px;
}

.alarm-list :deep(.n-list-item) {
  padding: 12px 20px;
  margin: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease-in-out;
  position: absolute;
  width: 100%;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease-in-out;
}

/* 确保 TransitionGroup 容器有相对定位 */
.list-move,
.list-enter-active,
.list-leave-active {
  position: relative;
}
</style>
