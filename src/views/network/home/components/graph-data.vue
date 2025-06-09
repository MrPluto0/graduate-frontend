<script setup lang="ts">
import { computed, nextTick, onMounted, ref, toRefs } from 'vue';
import { Panel, SelectionMode, VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { Icon } from '@iconify/vue';
import { useGraphStore } from '@/store/modules/graph';
import { useLayout } from '@/hooks/common/flow';
import SpecialNode from '@/components/business/SpecialNode.vue';
import SpecialEdge from '@/components/business/SpecialEdge.vue';
import NodeInfo from '@/components/business/NodeInfo.vue';
import LinkInfo from '@/components/business/LinkInfo.vue';

// import default controls styles
import '@vue-flow/controls/dist/style.css';

const { layout } = useLayout();
const { fitView, getSelectedNodes, getSelectedEdges } = useVueFlow();
const store = useGraphStore();
const { nodes, edges } = toRefs(store);

const isRunning = ref(false);
const showSettings = ref(false);

const selectedNode = computed(() => getSelectedNodes.value?.[0]);
const selectedEdge = computed(() => getSelectedEdges.value?.[0]);

const initLayout = (direction: string) => {
  nodes.value = layout(nodes.value, edges.value, direction);
  nextTick(() => {
    setTimeout(() => {
      fitView();
    }, 100);
  });
};

const stop = () => {
  isRunning.value = false;
};

const run = () => {
  isRunning.value = true;
};

onMounted(async () => {
  await store.initGraph();
  initLayout('LR');
});
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges" :default-viewport="{ zoom: 1.5 }" :selection-mode="SelectionMode.Full">
    <template #node-special="specialNodeProps">
      <SpecialNode v-bind="specialNodeProps" />
    </template>

    <template #edge-special="specialEdgeProps">
      <SpecialEdge v-bind="specialEdgeProps" />
    </template>

    <Background pattern-color="#aaa" :gap="16" />

    <Panel
      v-if="selectedNode || selectedEdge"
      position="top-right"
      class="w-90 overflow-auto bg-white opacity-90 shadow-lg"
    >
      <NodeInfo v-if="selectedNode" :node="selectedNode" />
      <LinkInfo v-if="selectedEdge" :edge="selectedEdge" />
    </Panel>

    <Panel position="top-left" class="rounded-lg bg-white/80 p-2 shadow-lg">
      <div class="flex gap-2">
        <button
          v-if="isRunning"
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="停止"
          @click="stop"
        >
          <Icon icon="ant-design:stop-outlined" class="text-lg" />
          <span class="absolute h-6 w-6 animate-spin border-2 border-white border-t-transparent rounded-full" />
        </button>
        <button
          v-else
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="开始"
          @click="run"
        >
          <Icon icon="ant-design:play-circle-outlined" class="text-lg" />
        </button>

        <button
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="水平布局"
          @click="initLayout('LR')"
        >
          <Icon icon="ant-design:column-width-outlined" class="text-lg" />
        </button>

        <button
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="垂直布局"
          @click="initLayout('TB')"
        >
          <Icon icon="ant-design:column-height-outlined" class="text-lg" />
        </button>

        <button
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="设置"
          @click="showSettings = !showSettings"
        >
          <Icon icon="ant-design:setting" class="text-lg" />
        </button>
      </div>
    </Panel>

    <Panel v-if="showSettings" position="top-right" class="w-80 bg-white p-4 text-black shadow-lg">
      <h3 class="mb-2 text-lg font-semibold">设置</h3>
      <NForm :model="store" label-placement="left" size="small">
        <NFormItem label="布局方向">
          <NSelect
            :value="store.settings.layoutDirection"
            :options="[
              { label: '水平布局', value: 'LR' },
              { label: '垂直布局', value: 'TB' }
            ]"
            @update:value="initLayout(store.settings.layoutDirection)"
          />
        </NFormItem>
        <NFormItem label="基站数量">
          <NInputNumber :min="1" :max="100" :step="1" />
        </NFormItem>
      </NForm>
    </Panel>

    <Controls />
  </VueFlow>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.vue-flow {
  height: 100%;
}
</style>
