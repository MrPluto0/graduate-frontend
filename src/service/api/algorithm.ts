import { request } from '../request';

export function fetchStartAlg(data: []) {
  return request({
    url: '/algorithm/start',
    method: 'post',
    data
  });
}

export function fetchStopAlg() {
  return request({
    url: '/algorithm/stop',
    method: 'post'
  });
}

export function fetchAlgStatus() {
  return request<Partial<Api.Alg.AlgStatus>>({
    url: '/algorithm/info',
    method: 'get'
  });
}
