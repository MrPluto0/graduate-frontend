import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import type { EdgeData, NodeData } from '@antv/g6';
import { fetchNetworkTopo } from '@/service/api/network';
import { toAntEdges, toAntNodes } from '@/utils/transform';

export const useGraphStore = defineStore('graph', () => {
  // 图配置
  const isInit = ref(false);
  const nodes = ref<NodeData[]>([]);
  const edges = ref<EdgeData[]>([]);

  // 特殊配置
  const settings = reactive({
    taskSize: 100,
    taskNum: 8,
    taskInterval: 0
  });

  // 算法状态
  const algStatus = ref<Api.Alg.AlgStatus>({} as Api.Alg.AlgStatus);

  const initGraphData = async () => {
    if (isInit.value) return;

    const res = await fetchNetworkTopo();
    nodes.value = toAntNodes(res.nodes);
    edges.value = toAntEdges(res.links);

    isInit.value = true;
  };

  return {
    nodes,
    edges,
    initGraphData,
    settings,
    algStatus
  };
});
