<script setup lang="ts">
import { onMounted } from 'vue';
import { Graph } from '@antv/g6';
import type { NodeData, EdgeData } from '@antv/g6';
import { useGraphStore } from '@/store/modules/graph';

const store = useGraphStore();

onMounted(async () => {
  await store.initGraphData();

  const container = document.getElementById('container');
  if (!container) return;

  const graph = new Graph({
    container,
    autoFit: 'view',
    autoResize: true,
    height: 300,
    data: {
      nodes: store.nodes as NodeData[],
      edges: store.edges as EdgeData[]
    },
    plugins: ['grid-line'],
    behaviors: ['drag-canvas', 'zoom-canvas', 'click-select', 'drag-element']
  });

  graph.render();
});
</script>

<template>
  <div class="card-wrapper overflow-hidden">
    <div id="container"></div>
  </div>
</template>
