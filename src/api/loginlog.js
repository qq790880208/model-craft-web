import request from '@/utils/request'
/* api 
*
*登录日志
*/
export function getListByPage(params) {
  return request({
    url: '/loginlog/findPage',
    method: 'get',
    params: params,
    baseURL: 'http://192.168.19.207:8091'
  })
}

export function batchRemoveList (params) {
    return request({
        url: '/loginlog/delete',
        method: 'delete',
        params: params,
        baseURL: 'http://192.168.19.207:8091'
    })
}