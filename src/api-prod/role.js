import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/8088/role/roles',
    method: 'get'
    // baseURL: 'http://127.0.0.1:8088'
  })
}

export function getRoleMenuByRoleId(param) {
  return request({
    url: '/8088/role/getRoleMenu',
    method: 'get',
    params: param
    // baseURL: 'http://127.0.0.1:8088'
  })
}

export function addRoleMenu(params) {
  return request({
    url: '/8088/role/addRoleMenu',
    method: 'put',
    params: params
    // baseURL: 'http://127.0.0.1:8088'
  })
}

export function getRolesListApi() {
  return request({
    url: '/8088/role/rolesList',
    method: 'get'
    // baseURL: 'http://127.0.0.1:8088'
  })
}
