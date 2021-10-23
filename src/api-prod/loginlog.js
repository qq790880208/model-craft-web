import request from '@/utils/request'
/* api 
*
*登录日志
*/
export function getListByPage(params) {
  return request({
    url: '/8083/loginlog/findPage',
    method: 'get',
    params: params
    // baseURL: 'http://127.0.0.1:8083'
  })
}

export function batchRemoveList (params) {
    return request({
        url: '/8083/loginlog/delete',
        method: 'delete',
        params: params
        // baseURL: 'http://127.0.0.1:8083'
    })
}