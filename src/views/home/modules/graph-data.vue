<script setup lang="ts">
import { nextTick, onMounted, toRefs } from 'vue';
import { SelectionMode, VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { useGraphStore } from '@/store/modules/graph';
import { useLayout } from '@/hooks/common/flow';
import SpecialNode from '@/components/business/SpecialNode.vue';
import SpecialEdge from '@/components/business/SpecialEdge.vue';

// import default controls styles
import '@vue-flow/controls/dist/style.css';

const { layout } = useLayout();
const { fitView } = useVueFlow();

const store = useGraphStore();
const { nodes, edges } = toRefs(store);

const initLayout = (direction: string) => {
  nodes.value = layout(nodes.value, edges.value, direction);
  nextTick(() => {
    setTimeout(() => {
      fitView();
    }, 100);
  });
};

onMounted(async () => {
  await store.initGraph();
  initLayout('LR');
});
</script>

<template>
  <div class="h-full w-full card-wrapper bg-white dark:bg-[#18181c]">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :default-viewport="{ zoom: 1.5 }"
      :selection-mode="SelectionMode.Full"
      @init="initLayout('LR')"
    >
      <template #node-special="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" />
      </template>

      <template #edge-special="specialEdgeProps">
        <SpecialEdge v-bind="specialEdgeProps" />
      </template>

      <Background pattern-color="#aaa" :gap="16" />

      <Controls />
    </VueFlow>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.vue-flow {
  height: 100%;
}
</style>
