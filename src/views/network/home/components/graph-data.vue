<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { EdgeData, NodeData } from '@antv/g6';
import { EdgeEvent, Graph, NodeEvent } from '@antv/g6';
import { Icon } from '@iconify/vue';
import { fetchStartAlg, fetchStopAlg } from '@/service/api/algorithm';
import { useGraphStore } from '@/store/modules/graph';

const isRunning = ref(false);
const showSettings = ref(false);
const timer = ref<NodeJS.Timeout>();

const store = useGraphStore();
let graph: Graph | null = null;

const selectedNode = ref<NodeData>();
const selectedEdge = ref<EdgeData>();

const stopAlg = async () => {
  isRunning.value = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = undefined;
  }
  // 停止算法
  await fetchStopAlg();
};

const startAlg = async () => {
  isRunning.value = true;
  // 构造数据，请求
  const { taskSize, taskNum, taskInterval } = store.settings;
  const fn = async () => {
    const dataList: { userId: number; dataSize: number }[] = [];
    for (let i = 0; i < taskNum; i += 1) {
      const userNodes = store.nodes.filter(node => node?.data?.nodeType === 'user_equipment');
      const targetNode = userNodes[Math.floor(Math.random() * userNodes.length)];
      const targetSize = Math.random() * taskSize + 10; // 随机任务大小
      dataList.push({ userId: Number(targetNode.id), dataSize: targetSize * 1000 });
    }
    await fetchStartAlg(dataList);
  };
  // 启动第一次任务
  fn();

  // 轮询添加任务
  if (taskInterval > 0) {
    timer.value = setInterval(fn, taskInterval * 1000);
  }
};

// const loopGetStatus = () => {
//   const fn = async () => {
//     const data = await fetchAlgStatus();
//     store.algStatus = data;
//     isRunning.value = data.isRunning;
//     setTimeout(fn, 1000);
//   };
//   fn();
// };

onMounted(async () => {
  await store.initGraphData();

  graph = new Graph({
    container: document.getElementById('container') as HTMLElement,
    autoFit: 'center',
    autoResize: true,
    height: 550,
    data: {
      nodes: store.nodes as NodeData[],
      edges: store.edges as EdgeData[]
    },
    plugins: [
      'grid-line',
      {
        type: 'minimap',
        position: 'left-bottom'
      },
      {
        type: 'tooltip',
        getContent: (_e: any, items: NodeData[] | EdgeData[]) => {
          let result = '';
          items.forEach(item => {
            result += `<p>ID: ${item?.data?.id}</p>`;
            result += `<p>名称: ${item?.data?.name}</p>`;
            result += `<p>描述: ${item?.data?.description}</p>`;
          });
          return result;
        }
      }
    ],
    behaviors: ['drag-canvas', 'zoom-canvas', 'click-select', 'drag-element']
  });

  graph.render();

  graph.on(NodeEvent.CLICK, e => {
    // @ts-ignore
    const target = e.target;
    const nodeData = graph?.getNodeData(target.id);
    selectedNode.value = nodeData;
    selectedEdge.value = undefined; // 清除选中的边
  });

  graph.on(EdgeEvent.CLICK, e => {
    // @ts-ignore
    const target = e.target;
    const edgeData = graph?.getEdgeData(target.id);
    selectedEdge.value = edgeData;
    selectedNode.value = undefined; // 清除选中的节点
  });

  graph.on('canvas:click', () => {
    selectedNode.value = undefined;
    selectedEdge.value = undefined; // 清除选中的边
    showSettings.value = false; // 点击画布时隐藏设置面板
  });
});

onBeforeUnmount(() => {
  graph?.off();
  graph?.destroy();
});
</script>

<template>
  <div class="relative card-wrapper overflow-hidden">
    <div id="container"></div>

    <div
      v-if="selectedNode || selectedEdge"
      class="absolute right-5 top-5 w-90 overflow-auto bg-white opacity-90 shadow-lg"
    >
      <NodeInfo v-if="selectedNode" :node="selectedNode" />
      <EdgeInfo v-if="selectedEdge" :edge="selectedEdge" />
    </div>

    <div class="absolute left-5 top-5 rounded-lg bg-white/80 p-2 shadow-lg">
      <div class="flex gap-2">
        <button
          v-if="isRunning"
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="停止"
          @click="stopAlg"
        >
          <Icon icon="ant-design:stop-outlined" class="text-lg" />
          <span class="absolute h-6 w-6 animate-spin border-2 border-white border-t-transparent rounded-full" />
        </button>
        <button
          v-else
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="开始"
          @click="startAlg"
        >
          <Icon icon="ant-design:play-circle-outlined" class="text-lg" />
        </button>

        <button
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="设置"
          @click="showSettings = !showSettings"
        >
          <Icon icon="ant-design:setting" class="text-lg" />
        </button>
      </div>
    </div>

    <div v-if="showSettings" class="absolute right-5 top-5 w-80 bg-white p-4 text-black shadow-lg">
      <h3 class="mb-2 text-lg font-semibold">设置</h3>
      <NForm :model="store" label-placement="left" size="small">
        <NFormItem label="任务大小(MB)">
          <NInputNumber v-model:value="store.settings.taskSize" :min="10" :max="500" :step="1" />
        </NFormItem>
        <NFormItem label="任务数量">
          <NInputNumber v-model:value="store.settings.taskNum" :min="1" :max="100" :step="1" />
        </NFormItem>
        <NFormItem label="任务间隔">
          <NInputNumber v-model:value="store.settings.taskInterval" :min="0" :max="10" :step="1" />
        </NFormItem>
      </NForm>
    </div>

    <!--
 <div v-if="showSettings" position="top-right" class="w-80 bg-white p-4 text-black shadow-lg">
      <h3 class="mb-2 text-lg font-semibold">设置</h3>
      <NForm :model="store" label-placement="left" size="small">
        <NFormItem label="布局方向">
          <NSelect
            v-model:value="store.settings.layoutDirection"
            :options="[
              { label: '水平布局', value: 'LR' },
              { label: '垂直布局', value: 'TB' }
            ]"
            @update:value="initLayout(store.settings.layoutDirection)"
          />
        </NFormItem>
        <NFormItem label="任务大小(MB)">
          <NInputNumber v-model:value="store.settings.taskSize" :min="10" :max="500" :step="1" />
        </NFormItem>
        <NFormItem label="任务数量">
          <NInputNumber v-model:value="store.settings.taskNum" :min="1" :max="100" :step="1" />
        </NFormItem>
        <NFormItem label="任务间隔">
          <NInputNumber v-model:value="store.settings.taskInterval" :min="0" :max="10" :step="1" />
        </NFormItem>
      </NForm>
    </div>
-->
  </div>
</template>
