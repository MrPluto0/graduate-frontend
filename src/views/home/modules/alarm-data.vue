<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { NCard, NEmpty, NList, NListItem, NText } from 'naive-ui';
import dayjs from 'dayjs';
import { Icon } from '@iconify/vue';
import { useAlarmStore } from '@/store/modules/alarm/index';

const alarmStore = useAlarmStore();
const { events } = storeToRefs(alarmStore);

onMounted(() => {
  setInterval(() => {
    events.value.unshift({
      id: events.value.length + 1,
      createdAt: Date(),
      updatedAt: Date(),
      name: 'CPU Usage High',
      eventType: 'CPU',
      status: 'resolved',
      description: 'CPU usage above 80%',
      deviceId: 1
    });
  }, 3000);
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
