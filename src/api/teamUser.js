import request from '@/utils/request'
/* api */
export function getTeamsUser(params) {
  return request({
    url: '/teamUser/getTeamUser',
    method: 'get',
    params: params,
    baseURL: 'http://127.0.0.1:8088'
  })
}
/* 获取用户列表分页 */
export function getTeamsUserPage(params) {
  return request({
    url: '/teamUser/getTeamUserPage',
    method: 'get',
    params: params,
    baseURL: 'http://127.0.0.1:8088'
  })
}
/* 添加用户 */
export function addUser(params) {
  return request({
    url: '/teamUser/addUser',
    method: 'post',
    params: params,
    baseURL: 'http://127.0.0.1:8088'
  })
}
/* 修改信息 */
export function editUser(params) {
  return request({
    url: '/teamUser/editUser',
    method: 'put',
    params: params,
    baseURL: 'http://127.0.0.1:8088'
  })
}
/* 删除用户 */
export function delUser(params) {
  return request({
    url: '/teamUser/delUser',
    method: 'delete',
    params: params,
    baseURL: 'http://127.0.0.1:8088'
  })
}
/* 批量删除用户 */
export function batchDelUser(params) {
  return request({
    url: '/teamUser/batchDelUser',
    method: 'delete',
    params: params,
    baseURL: 'http://127.0.0.1:8088'
  })
}
