import { request } from '../request';

/** 获取节点列表 */
export function fetchNodeList(params: Api.Common.CommonSearchParams & { search?: string }) {
  return request<Api.Common.PaginatingQueryRecord<ApiNode>>({
    url: '/network/nodes',
    method: 'get',
    params
  });
}

/** 创建节点 */
export function fetchCreateNode(params: ApiNode) {
  return request({
    url: '/network/nodes',
    method: 'post',
    data: params
  });
}

/** 更新节点 */
export function fetchUpdateNode(id: string | number, data: Partial<ApiNode>) {
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
  return request<ApiNode>({
    url: `/network/nodes/${id}`,
    method: 'get'
  });
}

export function batchUpdateNodePosition(nodes: Partial<ApiNode>[]) {
  return request({
    url: '/network/nodes/batch-position',
    method: 'patch',
    data: {
      nodes
    }
  });
}
