import { request } from '../request';

/** 获取节点列表 */
export function fetchNetworkTopo() {
  return request<{ nodes: Node[]; links: Link[] }>({
    url: '/network/topology',
    method: 'get'
  });
}
