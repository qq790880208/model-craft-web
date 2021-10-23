import request from '@/utils/request'
/* api */
export function addUser(params) {
  return request({
    url: '/userManage/addUser',
    method: 'post',
    data: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}
export function getUserListPage(params) {
  return request({
    url: '/userManage/getUserListPage',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}
/* editUser */
export function editUser(params) {
  return request({
    url: '/userManage/editUser',
    method: 'put',
    data: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}
/* removeUser */
export function removeUser(params) {
  return request({
    url: '/userManage/removeUser',
    method: 'delete',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}
/* batchRemove */
export function batchRemoveUser(params) {
  return request({
    url: '/userManage/batchRemoveUser',
    method: 'delete',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}
/* 获取团队管理的权限 */
export function getTeamPerm(params) {
  return request({
    url: '/userManage/getTeamPerm',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}
// 修改用户密码
export function updatePassword(params) {
  return request({
    url: '/userManage/updatePassword',
    method: 'put',
    data: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}
export function getAllUser(params) {
  return request({
    url: '/userManage/getAll',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}
// 第一次登录，修改用户密码
export function changePasswordApi(data) {
  return request({
    url: '/userManage/changePassword',
    method: 'put',
    data: data,
    baseURL: 'http://10.19.1.77:8088'
  })
}
export function getAuthorityApi(params) {
  return request({
    url: '/userManage/authority',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}