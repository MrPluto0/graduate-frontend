<script setup lang="ts">
import { toRef } from 'vue';
import type { NodeProps } from '@vue-flow/core';

const props = defineProps<NodeProps>();

// const sourceConnections = useNodeConnections({
//   handleType: 'target'
// });

// const targetConnections = useNodeConnections({
//   handleType: 'source'
// });

// const isSender = toRef(() => sourceConnections.value.length <= 0);

const bgColor = toRef(() => {
  switch (props.data.nodeType) {
    case 'user_equipment':
      return '#4b5563';
    case 'base_station':
      return '#2563eb';
    default:
      return '#fff';
  }
});

const processLabel = toRef(() => {
  switch (props.data.nodeType) {
    case 'user_equipment':
      return '📱';
    case 'base_station':
      return '📡';
    default:
      return '🏠';
  }
});
</script>

<template>
  <div
    class="special-node"
    :class="[{ selected: selected }]"
    :style="{
      backgroundColor: bgColor,
      boxShadow: data.isRunning ? '0 0 10px rgba(0, 0, 0, 0.5)' : ''
    }"
  >
    <span class="text-xl">
      {{ processLabel }}
    </span>
  </div>
</template>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.special-node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 99px;
}

.special-node .vue-flow__handle {
  width: unset;
  height: unset;
  font-size: 12px;
  background: transparent;
  border: none;
}

.special-node.selected {
  /* 选中状态样式 */
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.3);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 1px solid #f3f3f3;
  border-top: 1px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>
