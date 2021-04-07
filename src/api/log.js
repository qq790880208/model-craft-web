import request from '@/utils/request'
/* 
* 操作日志
*/
export function getListByPage(params) {
  return request({
    url: '/log/findPage',
    method: 'get',
    params: params,
    baseURL: 'http://192.168.19.239:8082'
  })
}

export function batchRemoveList(params) {
    return request({
        url: '/log/delete',
        method: 'delete',
        params: params,
        baseURL: 'http://192.168.19.239:8082'
    })
}