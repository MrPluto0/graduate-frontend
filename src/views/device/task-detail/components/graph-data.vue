<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { EdgeData, NodeData } from '@antv/g6';
import { Graph } from '@antv/g6';
import { useGraphStore } from '@/store/modules/graph';

interface Props {
  transferPath?: number[] | null;
}

const props = withDefaults(defineProps<Props>(), {
  transferPath: null
});

const store = useGraphStore();
let graph: Graph | null = null;

// 更新传输路径的显示（高亮传输路径上的边）
const updateTransferPath = () => {
  if (!graph) return;

  const paths = props.transferPath;

  // 重置所有边为默认样式
  const resetEdges: EdgeData[] = store.edges.map(edge => ({
    ...edge,
    type: 'cubic',
    style: {
      ...(edge.style || {}),
      lineWidth: 1,
      stroke: '#e2e8f0'
    }
  })) as EdgeData[];

  graph.updateEdgeData(resetEdges);

  // 如果有传输路径，高亮路径上的边
  if (paths && paths.length > 1) {
    const highlightEdges: EdgeData[] = [];

    for (let i = 1; i < paths.length; i += 1) {
      const targetEdge = store.edges.find(
        e => e.id === `e${paths[i - 1]}-${paths[i]}` || e.id === `e${paths[i]}-${paths[i - 1]}`
      );

      if (targetEdge) {
        highlightEdges.push({
          ...targetEdge,
          type: 'fly-cubic', // 使用飞行曲线动画
          source: String(paths[i - 1]),
          target: String(paths[i]),
          style: {
            ...(targetEdge.style || {}),
            lineWidth: 3,
            stroke: '#3b82f6',
            opacity: 1
          }
        } as EdgeData);
      }
    }

    if (highlightEdges.length > 0) {
      graph.updateEdgeData(highlightEdges);
    }
  }

  graph.render();
};

// 高亮传输路径上的节点
const updatePathNodes = () => {
  if (!graph) return;

  const paths = props.transferPath;
  const pathNodeIds = new Set(paths?.map(id => String(id)) || []);

  const updateNodes = store.nodes.map(node => {
    const isInPath = pathNodeIds.has(String(node.id));

    return {
      ...node,
      style: {
        ...(node.style || {}),
        opacity: isInPath ? 1 : 0.4,
        lineWidth: isInPath ? 2 : 1,
        stroke: isInPath ? '#3b82f6' : '#cbd5e1'
      }
    };
  }) as NodeData[];

  graph.updateNodeData(updateNodes);
  graph.render();
};

// 初始化图表
const initGraph = async () => {
  await store.initGraphData();

  graph = new Graph({
    container: document.getElementById('task-path-container') as HTMLElement,
    autoFit: 'center',
    autoResize: true,
    height: 400,
    data: {
      nodes: store.nodes as NodeData[],
      edges: store.edges as EdgeData[]
    },
    plugins: [
      'grid-line',
      {
        type: 'tooltip',
        getContent: (_e: any, items: NodeData[] | EdgeData[]) => {
          let result = '';
          items.forEach(item => {
            result += `<p>ID: ${item?.data?.id}</p>`;
            result += `<p>名称: ${item?.data?.name}</p>`;
            if (item?.data?.description) {
              result += `<p>描述: ${item?.data?.description}</p>`;
            }
          });
          return result;
        }
      }
    ],
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element']
  });

  graph.render();

  // 初始化后立即更新路径
  updateTransferPath();
  updatePathNodes();
};

onMounted(() => {
  initGraph();
});

onBeforeUnmount(() => {
  graph?.off();
  graph?.destroy();
});
</script>

<template>
  <div class="relative">
    <div id="task-path-container" class="rounded-lg"></div>

    <!-- 路径说明 -->
    <div v-if="transferPath && transferPath.length > 0" class="absolute left-4 top-4 rounded-lg bg-white/90 p-3 shadow-lg">
      <div class="mb-2 text-sm font-semibold text-gray-700">传输路径</div>
      <div class="flex items-center gap-2 text-sm">
        <span v-for="(nodeId, idx) in transferPath" :key="nodeId" class="flex items-center gap-2">
          <span class="rounded bg-blue-100 px-2 py-1 font-medium text-blue-700">
            节点 {{ nodeId }}
          </span>
          <span v-if="idx < transferPath.length - 1" class="text-gray-400">→</span>
        </span>
      </div>
    </div>

    <!-- 无路径提示 -->
    <div v-else class="absolute left-4 top-4 rounded-lg bg-white/90 p-3 shadow-lg">
      <div class="text-sm text-gray-500">暂无传输路径信息</div>
    </div>
  </div>
</template>

<style scoped>
#task-path-container {
  width: 100%;
  height: 400px;
}
</style>
