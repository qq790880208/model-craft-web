import request from '@/utils/request'
/* api */
export function getTeamsUser(params) {
  return request({
    url: '/8088/teamUser/getTeamUser',
    method: 'get',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
/* 获取用户列表分页 */
export function getTeamsUserPage(params) {
  return request({
    url: '/8088/teamUser/getTeamUserPage',
    method: 'get',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
/* 添加用户 */
export function addUser(params) {
  return request({
    url: '/8088/teamUser/addUser',
    method: 'post',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
/* 修改信息 */
export function editUser(params) {
  return request({
    url: '/8088/teamUser/editUser',
    method: 'put',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
/* 删除用户 */
export function delUser(params) {
  return request({
    url: '/8088/teamUser/delUser',
    method: 'delete',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
/* 批量删除用户 */
export function batchDelUser(params) {
  return request({
    url: '/8088/teamUser/batchDelUser',
    method: 'delete',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
