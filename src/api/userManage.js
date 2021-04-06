import request from '@/utils/request'
/* api */
export function addUser(params) {
  return request({
    url: '/userManage/addUser',
    method: 'post',
    params: params,
    baseURL: 'http://192.168.19.239:8083'
  })
}
export function getUserListPage(params) {
  return request({
    url: '/userManage/getUserListPage',
    method: 'get',
    params: params,
    baseURL: 'http://192.168.19.239:8083'
  })
}
/* editUser */
export function editUser(params) {
  return request({
    url: '/userManage/editUser',
    method: 'put',
    params: params,
    baseURL: 'http://192.168.19.239:8083'
  })
}
/* removeUser */
export function removeUser(params) {
  return request({
    url: '/userManage/removeUser',
    method: 'delete',
    params: params,
    baseURL: 'http://192.168.19.239:8083'
  })
}
/* batchRemove */
export function batchRemoveUser(params) {
  return request({
    url: '/userManage/batchRemoveUser',
    method: 'delete',
    params: params,
    baseURL: 'http://192.168.19.239:8083'
  })
}
