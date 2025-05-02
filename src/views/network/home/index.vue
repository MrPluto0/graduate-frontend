<script setup lang="ts">
import { nextTick, toRefs } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { useGraphStore } from '@/store/modules/graph';
import { useLayout } from '@/hooks/common/flow';
import SpecialNode from './modules/SpecialNode.vue';
import SpecialEdge from './modules/SpecialEdge.vue';

const { layout } = useLayout();
const { fitView } = useVueFlow();

const store = useGraphStore();
const { nodes, edges } = toRefs(store);

const initLayout = (direction: string) => {
  nodes.value = layout(nodes.value, edges.value, direction);
  nextTick(() => {
    fitView();
  });
};
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges" @init="initLayout('LR')">
    <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
    <template #node-special="specialNodeProps">
      <SpecialNode v-bind="specialNodeProps" />
    </template>

    <!-- bind your custom edge type to a component by using slots, slot names are always `edge-<type>` -->
    <template #edge-special="specialEdgeProps">
      <SpecialEdge v-bind="specialEdgeProps" />
    </template>

    <Background pattern-color="#aaa" :gap="16" />
  </VueFlow>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';
/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>
