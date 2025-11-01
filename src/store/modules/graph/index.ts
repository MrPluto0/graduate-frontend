import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import type { EdgeData, NodeData } from '@antv/g6';
import { ExtensionCategory, register } from '@antv/g6';
import { fetchNetworkTopo } from '@/services/api/network';
import { toAntEdges, toAntNodes } from '@/utils/transform';
import { FlyMarkerCubic } from './data';

export const useGraphStore = defineStore('graph', () => {
  // 图配置
  const isInit = ref(false);
  const nodes = ref<NodeData[]>([]);
  const edges = ref<EdgeData[]>([]);

  // 特殊配置
  const settings = reactive({
  });

  // 算法状态
  const algStatus = ref<Api.Alg.AlgStatus>({ state: {} } as Api.Alg.AlgStatus);

  const initGraphData = async (force = false) => {
    if (isInit.value && !force) return;

    // 注册自定义标记
    register(ExtensionCategory.EDGE, 'fly-cubic', FlyMarkerCubic);

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
