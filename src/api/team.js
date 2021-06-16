import request from '@/utils/request'

export function getTeams(params) {
  return request({
    url: '/team/getTeams',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function delTeams(params) {
  return request({
    url: '/team/delTeams',
    method: 'delete',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function addTeams(params) { 
  return request({
    url: '/team/addTeams',
    method: 'post',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function editTeams(params) {
  return request({
    url: '/team/editTeams',
    method: 'put',
    params: params,
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function getAllTeam() {
  return request({
    url: '/team/getAll',
    method: 'get',
    baseURL: 'http://10.19.1.77:8085'
  })
}

export function getSelectTeam(params) {
  return request({
    url: '/team/getSelect',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8085'
  })
}
