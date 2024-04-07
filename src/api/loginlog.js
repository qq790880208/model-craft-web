import request from '@/utils/request'
/* api
*
*登录日志
*/
export async function getListByPage(params) {
  return request({
    url: '/8083/loginlog/findPage',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8083'
  })
}

export function batchRemoveList (params) {
    return request({
        url: '/8083/loginlog/delete',
        method: 'delete',
        params: params,
        //baseURL: 'http://10.19.1.77:8083'
    })
}
