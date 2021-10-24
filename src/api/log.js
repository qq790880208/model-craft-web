import request from '@/utils/request'
/*
* 操作日志
*/
export function getListByPage(params) {
  return request({
    url: '/log/findPage',
    method: 'get',
    params: params,
    baseURL: 'http://127.0.0.1:8083'
  })
}

export function batchRemoveList(params) {
  return request({
    url: '/log/delete',
    method: 'delete',
    params: params,
    baseURL: 'http://127.0.0.1:8083'
  })
}
