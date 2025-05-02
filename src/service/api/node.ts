import { request } from '../request';

/** 获取节点列表 */
export function fetchNodeList(params: Api.Common.CommonSearchParams & { keyword?: string }) {
  return request<Api.Common.PaginatingQueryRecord<Node>>({
    url: '/network/nodes',
    method: 'get',
    params
  });
}

/** 创建节点 */
export function fetchCreateNode(params: Node) {
  return request({
    url: '/network/nodes',
    method: 'post',
    data: params
  });
}

/** 更新节点 */
export function fetchUpdateNode(id: string | number, data: Partial<Node>) {
  return request({
    url: `/network/nodes/${id}`,
    method: 'put',
    data
  });
}

/** 删除节点 */
export function fetchDeleteNode(id: string | number) {
  return request({
    url: `/network/nodes/${id}`,
    method: 'delete'
  });
}

/** 获取节点详情 */
export function fetchNodeDetail(id: string | number) {
  return request<Node>({
    url: `/network/nodes/${id}`,
    method: 'get'
  });
}
