import { request } from '../request';

/** 获取节点列表 */
export function fetchLinkList(params: Api.Common.CommonSearchParams & { search?: string }) {
  return request<Api.Common.PaginatingQueryRecord<Link>>({
    url: '/network/links',
    method: 'get',
    params
  });
}

/** 创建节点 */
export function fetchCreateLink(params: Link) {
  return request({
    url: '/network/links',
    method: 'post',
    data: params
  });
}

/** 更新节点 */
export function fetchUpdateLink(id: string | number, data: Partial<Link>) {
  return request({
    url: `/network/links/${id}`,
    method: 'put',
    data
  });
}

/** 删除节点 */
export function fetchDeleteLink(id: string | number) {
  return request({
    url: `/network/links/${id}`,
    method: 'delete'
  });
}

/** 获取节点详情 */
export function fetchLinkDetail(id: string | number) {
  return request<Link>({
    url: `/network/links/${id}`,
    method: 'get'
  });
}
