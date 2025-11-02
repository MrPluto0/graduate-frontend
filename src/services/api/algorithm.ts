import { request } from '../request';

export function fetchStartAlg(data: Partial<Api.Alg.UserTask>[]) {
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
  return request<Api.Alg.AlgStatus>({
    url: '/algorithm/info',
    method: 'get'
  });
}

/** 查询任务列表 */
export function fetchTaskList(params: Api.Common.CommonSearchParams) {
  return request<Api.Common.PaginatingQueryRecord<Api.Alg.UserTask>>({
    url: '/algorithm/tasks',
    method: 'get',
    params
  });
}

/** 获取任务详情 */
export function fetchTaskDetail(id: string) {
  return request<Api.Alg.UserTask>({
    url: `/algorithm/tasks/${id}`,
    method: 'get'
  });
}

/** 提交单个任务 */
export function fetchSubmitTask(data: Partial<Api.Alg.UserTask>) {
  return request<Api.Alg.UserTask>({
    url: '/algorithm/tasks',
    method: 'post',
    data
  });
}

/** 删除任务 */
export function fetchDeleteTask(id: string) {
  return request({
    url: `/algorithm/tasks/${id}`,
    method: 'delete'
  });
}

/** 清除历史记录 */
export function fetchClearHistory() {
  return request({
    url: '/algorithm/clear',
    method: 'post'
  });
}
