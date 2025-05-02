import { request } from '../request';

export function fetchDeviceList(params: Api.Common.CommonSearchParams & { keyword?: string }) {
  return request<Api.Common.PaginatingQueryRecord<Device>>({
    url: '/devices',
    method: 'get',
    params
  });
}

export function fetchCreateDevice(params: Device) {
  return request({
    url: '/devices',
    method: 'post',
    data: params
  });
}

export function fetchUpdateDevice(params: Device) {
  return request({
    url: `/devices/${params.id}`,
    method: 'put',
    data: params
  });
}
export function fetchDeleteDevice(id: string) {
  return request({
    url: `/devices/${id}`,
    method: 'delete'
  });
}
