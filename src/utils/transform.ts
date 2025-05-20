import type { Edge, Node as VueFlowNode } from '@vue-flow/core';

/** 将 API 的节点格式转换为 VueFlow 格式 */
function apiToVueFlowNode(node: Node): VueFlowNode {
  return {
    id: String(node.id),
    position: { x: node.x, y: node.y },
    type: 'special',
    data: node
  };
}

/** 将 VueFlow 的节点格式转换为 API 格式 */
function vueFlowToNode(node: VueFlowNode): Partial<Node> {
  return {
    id: Number(node.id),
    name: node.data?.name,
    x: node.position.x,
    y: node.position.y,
    deviceId: node.data?.deviceId,
    properties: node.data?.properties,
    description: node.data?.description
  };
}

/** 将 API 的连线格式转换为 VueFlow 格式 */
function apiToVueFlowEdge(link: Link): Edge {
  return {
    id: `e${link.sourceId}-${link.targetId}`,
    source: String(link.sourceId),
    target: String(link.targetId),
    type: 'special',
    animated: true,
    data: link
  };
}

/** 将 VueFlow 的边格式转换为 API 格式 */
function vueFlowToApiEdge(edge: Edge): Partial<Link> {
  return {
    name: edge.data?.name,
    status: edge.data?.status,
    sourceId: Number(edge.source),
    targetId: Number(edge.target),
    properties: edge.data?.properties,
    description: edge.data?.description
  };
}

/** 批量转换节点列表：API -> VueFlow */
export function apiToVueFlowNodes(nodes: Node[]): VueFlowNode[] {
  return nodes.map(apiToVueFlowNode);
}

/** 批量转换节点列表：VueFlow -> API */
export function vueFlowToNodes(nodes: VueFlowNode[]): Partial<Node>[] {
  return nodes.map(vueFlowToNode);
}

/** 批量转换连线列表：API -> VueFlow */
export function apiToVueFlowEdges(links: Link[]): Edge[] {
  return links.map(apiToVueFlowEdge);
}

/** 批量转换连线列表：VueFlow -> API */
export function vueFlowToApiEdges(edges: Edge[]): Partial<Link>[] {
  return edges.map(vueFlowToApiEdge);
}
