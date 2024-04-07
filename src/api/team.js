import request from '@/utils/request'

export function getTeams(params) {
  return request({
    url: '/8088/team/getTeams',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8088'
  })
}

export function delTeams(params) {
  return request({
    url: '/8088/team/delTeams',
    method: 'delete',
    params: params,
    //baseURL: 'http://10.19.1.77:8088'
  })
}

export function addTeams(params) { 
  return request({
    url: '/8088/team/addTeams',
    method: 'post',
    params: params,
    //baseURL: 'http://10.19.1.77:8088'
  })
}

export function editTeams(params) {
  return request({
    url: '/8088/team/editTeams',
    method: 'put',
    params: params,
    //baseURL: 'http://10.19.1.77:8088'
  })
}

export function getAllTeam(params) {
  return request({
    url: '/8085/team/getAll',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function getSelectTeam(params) {
  return request({
    url: '/8085/team/getSelect',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}
