import { request } from '../request';

/** 获取系统性能指标 */
export function fetchSystemMetrics() {
  return request<Api.Monitor.SystemMetrics>({
    url: '/system/metrics',
    method: 'get'
  });
}
