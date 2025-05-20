<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'UserLogs'
});

interface UserLog {
  id: number;
  content: string;
  time: string;
}

const newses = computed<UserLog[]>(() => [
  { id: 1, content: '用户创建了一个设备并链接到了一个节点，命名为路由节点', time: '2021-05-28 22:22:22' },
  { id: 2, content: '用户编辑了链路的信息', time: '2021-10-27 10:24:54' },
  { id: 3, content: '用户编辑了链路的信息', time: '2021-10-27 10:24:54' },
  { id: 4, content: '用户编辑了链路的信息', time: '2021-10-27 10:24:54' }
]);
</script>

<template>
  <NCard title="操作日志" :bordered="false" size="small" segmented class="h-full card-wrapper">
    <template #header-extra>
      <a class="text-primary" href="javascript:;">更多日志</a>
    </template>
    <NList>
      <NListItem v-for="item in newses" :key="item.id">
        <template #prefix>
          <SoybeanAvatar class="size-48px!" />
        </template>
        <NThing :title="item.content" :description="item.time" />
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
