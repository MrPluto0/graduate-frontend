import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Edge, Node } from '@vue-flow/core';
import { fetchNetworkTopo } from '@/service/api/network';
import { apiToVueFlowEdges, apiToVueFlowNodes } from '@/utils/transform';

export const useGraphStore = defineStore('graph', () => {
  const nodes = ref<Node[]>([]);
  const edges = ref<Edge[]>([]);
  const settings = reactive({
    layoutDirection: 'LR', // Top to Bottom
    taskSize: 100,
    taskNum: 8,
    taskInterval: 0
  });
  const algStatus = ref<Api.Alg.AlgStatus>({} as Api.Alg.AlgStatus);
  const isInit = ref(false);

  // const nestNetworkNodes = () => {
  //   let leftX = 0;
  //   let topY = 0;
  //   let rightX = 0;
  //   let bottomY = 0;

  //   nodes.value.forEach(node => {
  //     if (node.data.device.deviceType === 'network_device') {
  //       node.parentNode = 'network';
  //       leftX = Math.min(leftX, node.position.x);
  //       topY = Math.min(topY, node.position.y);
  //       rightX = Math.max(rightX, node.position.x);
  //       bottomY = Math.max(bottomY, node.position.y);
  //     }
  //   });

  //   nodes.value.push({
  //     id: 'network',
  //     type: 'special',
  //     position: {
  //       x: leftX - 50,
  //       y: topY - 50
  //     },
  //     style: {
  //       backgroundColor: 'rgba(139, 92, 246, 0.5)',
  //       height: `${bottomY - topY + 100}px`,
  //       width: `${rightX - leftX + 100}px`
  //     }
  //   });
  // };

  const initGraph = async () => {
    if (isInit.value) return;
    const res = await fetchNetworkTopo();
    nodes.value = apiToVueFlowNodes(res.nodes);
    edges.value = apiToVueFlowEdges(res.links);
    // 处理节点嵌套关系
    // nestNetworkNodes();

    isInit.value = true;
  };

  return {
    nodes,
    edges,
    initGraph,
    settings,
    algStatus
  };
});
