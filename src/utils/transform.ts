import type { EdgeData, NodeData } from '@antv/g6';

/** 将 API 的节点格式转换为 VueFlow 格式 */
function toAntNode(node: ApiNode): NodeData {
  return {
    id: String(node.id),
    type: 'image',
    style: {
      size: 40,
      x: node.x,
      y: node.y,
      labelText: node.name,
      src: node.nodeType === 'user_equipment' ? '/proxy-static/phone.png' : '/proxy-static/uav.png'
    },
    state: {
      inactive: {
        fillOpacity: 0.5
      },
      disabled: {
        fillOpacity: 0.2
      }
    },
    data: {
      ...node,
      cluster: node.nodeType === 'user_equipment' ? '用户设备' : '无人机基站'
    } as any // 使用 any 类型以兼容 VueFlow 的数据结构
  };
}

/** 将 VueFlow 的节点格式转换为 API 格式 */
function fromAntNode(node: NodeData): Partial<ApiNode> {
  return {
    id: Number(node.id),
    x: node.style?.x,
    y: node.style?.y,
    name: node.data?.name as string,
    deviceId: node.data?.deviceId as number,
    properties: node.data?.properties as string,
    description: node.data?.description as string
  };
}

/** 将 API 的连线格式转换为 VueFlow 格式 */
function toAntEdge(link: ApiEdge): EdgeData {
  return {
    id: `e${link.sourceId}-${link.targetId}`,
    type: 'cubic',
    source: String(link.sourceId),
    target: String(link.targetId),
    style: {
      lineWidth: 2
    },
    data: link as any // 使用 any 类型以兼容 VueFlow 的数据结构
  };
}

/** 将 VueFlow 的边格式转换为 API 格式 */
function fromAntEdge(edge: EdgeData): Partial<ApiEdge> {
  return {
    sourceId: Number(edge.source),
    targetId: Number(edge.target),
    name: edge.data?.name as string,
    status: edge.data?.status as string,
    properties: edge.data?.properties as string,
    description: edge.data?.description as string
  };
}

/** 批量转换节点列表：API -> VueFlow */
export function toAntNodes(nodes: ApiNode[]): NodeData[] {
  return nodes.map(toAntNode);
}

/** 批量转换节点列表：VueFlow -> API */
export function fromAntNodes(nodes: NodeData[]): Partial<ApiNode>[] {
  return nodes.map(fromAntNode);
}

/** 批量转换连线列表：API -> VueFlow */
export function toAntEdges(links: ApiEdge[]): EdgeData[] {
  return links.map(toAntEdge);
}

/** 批量转换连线列表：VueFlow -> API */
export function fromAntEdges(edges: EdgeData[]): Partial<ApiEdge>[] {
  return edges.map(fromAntEdge);
}
