import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Edge, Node } from '@vue-flow/core';
import { initialEdges, initialNodes } from './data';

export const useGraphStore = defineStore('', () => {
  const nodes = ref<Node[]>(initialNodes);
  const edges = ref<Edge[]>(initialEdges);

  return {
    nodes,
    edges
  };
});
