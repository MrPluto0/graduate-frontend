<script setup lang="ts">
import { computed } from 'vue';
import { NDescriptions, NDescriptionsItem, NTag } from 'naive-ui';
import type { Edge } from '@vue-flow/core';

const props = defineProps<{
  edge: Edge;
}>();

const edgeData = computed(() => props.edge.data || {});

const statusType = computed(() => {
  switch (edgeData.value.status) {
    case 'up':
      return 'success';
    case 'down':
      return 'error';
    default:
      return 'warning';
  }
});

const statusText = computed(() => {
  switch (edgeData.value.status) {
    case 'up':
      return '活动';
    case 'down':
      return '错误';
    default:
      return '非活动';
  }
});
</script>

<template>
  <div class="p-4">
    <NDescriptions
      title="链路信息"
      label-placement="left"
      bordered
      :column="1"
      size="small"
      :label-style="{ whiteSpace: 'nowrap' }"
    >
      <NDescriptionsItem label="链路ID">
        {{ edge.id }}
      </NDescriptionsItem>

      <NDescriptionsItem label="链路名称">
        {{ edgeData.name }}
      </NDescriptionsItem>

      <NDescriptionsItem label="链路状态">
        <NTag :type="statusType">{{ statusText }}</NTag>
      </NDescriptionsItem>

      <NDescriptionsItem label="源节点">
        {{ edge.source }}
      </NDescriptionsItem>

      <NDescriptionsItem label="目标节点">
        {{ edge.target }}
      </NDescriptionsItem>

      <NDescriptionsItem v-if="edgeData.properties" label="属性">
        <pre>{{ edgeData.properties }}</pre>
      </NDescriptionsItem>

      <NDescriptionsItem v-if="edgeData.description" label="描述">
        {{ edgeData.description }}
      </NDescriptionsItem>
    </NDescriptions>
  </div>
</template>
