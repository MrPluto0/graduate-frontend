<script setup lang="ts">
import { computed } from 'vue';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from '@vue-flow/core';

defineOptions({
  inheritAttrs: false
});

const props = defineProps<EdgeProps>();

const path = computed(() => getBezierPath(props));

const isInterUPF = computed(
  () => props.sourceNode.data.nodeType === 'base_station' && props.targetNode.data.nodeType === 'base_station'
);
</script>

<template>
  <!-- You can use the `BaseEdge` component to create your own custom edge more easily -->
  <BaseEdge
    v-if="isInterUPF"
    :path="path[0]"
    :style="{
      stroke: '#79a9e2',
      strokeWidth: 2
    }"
  />
  <BaseEdge v-else :path="path[0]" />

  <!-- Use the `EdgeLabelRenderer` to escape the SVG world of edges and render your own custom label in a `<div>` ctx -->
  <EdgeLabelRenderer>
    <div
      v-if="isInterUPF"
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
        color: '#fff',
        backgroundColor: '#3662e3',
        borderRadius: '4px',
        padding: '2px 6px'
      }"
    >
      Inter-UPF
    </div>
  </EdgeLabelRenderer>
</template>
