import { request } from '../request';

/** 获取告警列表 */
export function fetchAlarmList(params: Api.Common.CommonSearchParams) {
  return request<Api.Alarm.AlarmListResponse>({
    url: '/alarms',
    method: 'get',
    params
  });
}
