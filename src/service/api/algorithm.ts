import { request } from '../request';

export function fetchStartAlg(userDataList: { userId: number; dataSize: any }[]) {
  return request({
    url: '/algorithm/start',
    method: 'post',
    data: { userDataList }
  });
}

export function fetchStopAlg() {
  return request({
    url: '/algorithm/stop',
    method: 'post'
  });
}

export function fetchAlgStatus() {
  return request<Api.Alg.AlgStatus>({
    url: '/algorithm/info',
    method: 'get'
  });
}
