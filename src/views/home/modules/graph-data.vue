<script setup>
import { onMounted } from 'vue';
import { Graph } from '@antv/g6';
import { useGraphStore } from '@/store/modules/graph';

const store = useGraphStore();

onMounted(async () => {
  await store.initGraphData();

  const graph = new Graph({
    container: document.getElementById('container'),
    autoFit: 'view',
    autoResize: true,
    height: 300,
    data: {
      nodes: store.nodes,
      edges: store.edges
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
