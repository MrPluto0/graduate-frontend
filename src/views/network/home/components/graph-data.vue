<script setup lang="ts">
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue';
import type { EdgeData, NodeData } from '@antv/g6';
import { EdgeEvent, Graph, NodeEvent } from '@antv/g6';
import { Icon } from '@iconify/vue';
import { fetchAlgStatus, fetchStartAlg, fetchStopAlg } from '@/service/api/algorithm';
import { batchUpdateNodePosition } from '@/service/api/node';
import { useGraphStore } from '@/store/modules/graph';
import { fromAntNodes } from '@/utils/transform';

let graph: Graph | null = null;

const isRunning = ref(false);
const showSettings = ref(false);
const sendDataTimer = ref<NodeJS.Timeout>();
const getInfoTimer = ref<NodeJS.Timeout>();

const store = useGraphStore();

const selectedNode = ref<NodeData>();
const selectedEdge = ref<EdgeData>();

// 停止算法
const handleStopAlg = async () => {
  isRunning.value = false;
  if (sendDataTimer.value) {
    clearInterval(sendDataTimer.value);
    sendDataTimer.value = undefined;
  }
  await fetchStopAlg();
};

// 启动算法
const handleStartAlg = async () => {
  isRunning.value = true;
  // 构造数据，请求
  const { taskSize, taskNum, taskInterval } = store.settings;
  const fn = async () => {
    const dataList: { userId: number; dataSize: number }[] = [];
    const userNodes = store.nodes.filter(node => node?.data?.nodeType === 'user_equipment');
    for (let i = 0; i < taskNum; i += 1) {
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
    sendDataTimer.value = setInterval(fn, taskInterval * 1000);
  }
};

// 保存位置
const handleSavePosition = async () => {
  if (!graph) return;

  const nodes = graph.getNodeData();
  await batchUpdateNodePosition(fromAntNodes(nodes));
  store.nodes = nodes; // 更新store中的节点数据
  window.$message?.success('保存成功');
};

// 刷新图数据
const handleRefreshGraph = async () => {
  graph?.clear();
  await handleStopAlg();
  await store.initGraphData(true);
  graph?.addNodeData(store.nodes as NodeData[]);
  graph?.addEdgeData(store.edges as EdgeData[]);
  graph?.render();
};

// 更新图上节点的传输路径（点选中某节点时触发）
const updateTransferPath = () => {
  const userId = selectedNode.value?.id;
  const transferPath = store.algStatus.transferPath;
  const updateEdges: EdgeData[] = store.edges.filter(edge => {
    if (edge.type === 'fly-cubic') {
      edge.type = 'cubic'; // 恢复为直线
      return true;
    }
    return false;
  }) as EdgeData[];

  if (userId) {
    const paths = transferPath?.[Number(userId)];
    if (paths && paths.length > 1) {
      for (let i = 1; i < paths.length; i += 1) {
        const targetEdge = store.edges.find(
          e => e.id === `e${paths[i - 1]}-${paths[i]}` || e.id === `e${paths[i]}-${paths[i - 1]}`
        ) as EdgeData;
        targetEdge.type = 'fly-cubic'; // 更新边类型为飞行曲线
        targetEdge.source = String(paths[i - 1]);
        targetEdge.target = String(paths[i]);
        updateEdges.push(targetEdge);
      }
      console.log('updateEdges', updateEdges);
      graph?.updateEdgeData(updateEdges);
    }
  }

  graph?.updateEdgeData(updateEdges);
};

// 更新激活中的节点
const updateActiveNode = () => {
  const transferPath = store.algStatus.transferPath;
  const activeUserIds = Object.keys(transferPath).filter(id => transferPath[Number(id)].length > 1);
  const updateNodes = store.nodes.map(node => {
    if (node?.data?.nodeType === 'user_equipment') {
      // @ts-ignore
      node.style.src = activeUserIds.includes(node.id) ? '/proxy-static/phone-active.png' : '/proxy-static/phone.png';
    }
    return node;
  }) as NodeData[];
  graph?.updateNodeData(updateNodes);
};

// 获取算法状态，重新渲染图内容
const loopGetStatus = () => {
  if (getInfoTimer.value) {
    clearInterval(getInfoTimer.value);
    getInfoTimer.value = undefined;
  }

  const fn = async () => {
    const data = await fetchAlgStatus();
    store.algStatus = data;
    isRunning.value = data.isRunning;

    // 更新路径和节点信息
    updateTransferPath();
    updateActiveNode();
    graph?.render();
  };

  getInfoTimer.value = setInterval(fn, 2000);
};

onUnmounted(() => {
  if (sendDataTimer.value) {
    clearInterval(sendDataTimer.value);
    sendDataTimer.value = undefined;
  }
  if (getInfoTimer.value) {
    clearInterval(getInfoTimer.value);
    getInfoTimer.value = undefined;
  }
});

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
    showSettings.value = false; // 隐藏设置面板
  });

  graph.on(EdgeEvent.CLICK, e => {
    // @ts-ignore
    const target = e.target;
    const edgeData = graph?.getEdgeData(target.id);
    selectedEdge.value = edgeData;
    selectedNode.value = undefined; // 清除选中的节点
    showSettings.value = false; // 隐藏设置面板
  });

  graph.on('canvas:click', () => {
    selectedNode.value = undefined;
    selectedEdge.value = undefined; // 清除选中的边
    showSettings.value = false; // 隐藏设置面板
  });

  loopGetStatus();

  // @ts-ignore
  window.graph = graph; // 暴露给全局，方便调试
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
          @click="handleStopAlg"
        >
          <Icon icon="ant-design:stop-outlined" class="text-lg" />
          <span class="absolute h-6 w-6 animate-spin border-2 border-white border-t-transparent rounded-full" />
        </button>
        <button
          v-else
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="开始"
          @click="handleStartAlg"
        >
          <Icon icon="ant-design:play-circle-outlined" class="text-lg" />
        </button>

        <button
          class="h-8 w-8 flex items-center justify-center rounded-md bg-gray-800 text-white transition-all duration-200 ease-in-out hover:bg-gray-700 hover:shadow-md"
          title="刷新"
          @click="handleRefreshGraph"
        >
          <Icon icon="ant-design:reload" class="text-lg" />
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
        <NFormItem>
          <NButton type="warning" @click="handleSavePosition">保存拓扑位置</NButton>
        </NFormItem>
      </NForm>
    </div>
  </div>
</template>
