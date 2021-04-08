import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/role/roles',
    method: 'get'
  })
}

export function getRoleMenuByRoleId(param) {
  return request({
    url: '/role/getRoleMenu',
    method: 'get',
    params: param
  })
}

export function addRoleMenu(params) {
  return request({
    url: '/role/addRoleMenu',
    method: 'put',
    params: params
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
