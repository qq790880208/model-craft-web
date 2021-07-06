import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/role/roles',
    method: 'get',
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function getRoleMenuByRoleId(param) {
  return request({
    url: '/role/getRoleMenu',
    method: 'get',
    params: param,
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function addRoleMenu(params) {
  return request({
    url: '/role/addRoleMenu',
    method: 'put',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function getRolesListApi() {
  return request({
    url: '/role/rolesList',
    method: 'get',
    baseURL: 'http://10.19.1.77:8088'
  })
}
