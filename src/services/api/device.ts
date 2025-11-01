import { request } from '../request';

export function fetchDeviceList(params: Api.Common.CommonSearchParams & { search?: string }) {
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

export function fetchDeviceDetail(id: string | number) {
  return request<Device>({
    url: `/devices/${id}`,
    method: 'get'
  });
}

export function fetchOverviewData() {
  return request<{ deviceCount: number; activeCount: number; nodeCount: number; linkCount: number }>({
    url: '/overview',
    method: 'get'
  });
}
