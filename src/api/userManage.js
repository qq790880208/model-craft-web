import request from '@/utils/request'
/* api */
export function addUser(params) {
  return request({
    url: '/userManage/addUser',
    method: 'post',
    params: params,
    // baseURL: 'http://localhost:9528/dev-api'
  })
}
export function getUserListPage(params) {
  return request({
    url: '/userManage/getUserListPage',
    method: 'get',
    params: params,
    // baseURL: 'http://localhost:9528/dev-api'
  })
}
/* editUser */
export function editUser(params) {
  return request({
    url: '/userManage/editUser',
    method: 'put',
    params: params,
    // baseURL: 'http://localhost:9528/dev-api'
  })
}
/* removeUser */
export function removeUser(params) {
  return request({
    url: '/userManage/removeUser',
    method: 'delete',
    params: params,
    // baseURL: 'http://localhost:9528/dev-api'
  })
}
/* batchRemove */
export function batchRemoveUser(params) {
  return request({
    url: '/userManage/batchRemoveUser',
    method: 'delete',
    params: params,
    //baseURL: 'http://localhost:9528/dev-api'
  })
}
