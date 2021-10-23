import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/role/roles',
    method: 'get',
    baseURL: 'http://127.0.0.1:8088'
  })
}

export function getRoleMenuByRoleId(param) {
  return request({
    url: '/role/getRoleMenu',
    method: 'get',
    params: param,
    baseURL: 'http://127.0.0.1:8088'
  })
}

export function addRoleMenu(params) {
  return request({
    url: '/role/addRoleMenu',
    method: 'put',
    params: params,
    baseURL: 'http://127.0.0.1:8088'
  })
}

export function getRolesListApi(params) {
  return request({
    url: '/role/rolesList',
    method: 'get',
    params: params,
    // baseURL: 'http://127.0.0.1:8088'
    
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function addNewRoleApi(params) {
  return request({
    url: '/role/addNewRole',
    method: 'post',
    params: params,
    // baseURL: 'http://127.0.0.1:8088'
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function delRoleApi(params) {
  return request({
    url: '/role/delRole',
    method: 'DELETE',
    params: params,
    // baseURL: 'http://127.0.0.1:8088'
    baseURL: 'http://10.19.1.77:8088'
  })
}
