import request from '@/utils/request'
/* api */
export function addUser(params) {
  return request({
    url: '/8088/userManage/addUser',
    method: 'post',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
export function getUserListPage(params) {
  return request({
    url: '/8088/userManage/getUserListPage',
    method: 'get',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
/* editUser */
export function editUser(params) {
  return request({
    url: '/8088/userManage/editUser',
    method: 'put',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
/* removeUser */
export function removeUser(params) {
  return request({
    url: '/8088/userManage/removeUser',
    method: 'delete',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
/* batchRemove */
export function batchRemoveUser(params) {
  return request({
    url: '/8088/userManage/batchRemoveUser',
    method: 'delete',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
/* 获取团队管理的权限 */
export function getTeamPerm(params) {
  return request({
    url: '/8088/userManage/getTeamPerm',
    method: 'get',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
// 修改用户密码
export function updatePassword(params) {
  return request({
    url: '/8088/userManage/updatePassword',
    method: 'put',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
export function getAllUser(params) {
  return request({
    url: '/8088/userManage/getAll',
    method: 'get',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
  })
}
