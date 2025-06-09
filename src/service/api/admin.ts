import { request } from '../request';

export function fetchUserList(params: Api.Common.CommonSearchParams & { search?: string }) {
  return request<Api.Common.PaginatingQueryRecord<User>>({
    url: '/admin/users',
    method: 'get',
    params
  });
}

/** 创建用户 */
export function fetchCreateUser(data: Partial<User> & { password: string }) {
  return request({
    method: 'POST',
    url: '/admin/users',
    data
  });
}
