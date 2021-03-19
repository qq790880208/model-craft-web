import request from '@/utils/request'

export function getTeams() {
  return request({
    url: '/team/getTeams',
    method: 'get',
    //baseURL: 'http://localhost:9528/dev-api'
  })
}

export function delTeams(params) {
  return request({
    url: '/team/delTeams',
    method: 'delete',
    params: params,
    //baseURL: 'http://localhost:9528/dev-api'
  })
}

export function addTeams(params) {
  return request({
    url: '/team/addTeams',
    method: 'post',
    params: params,
    //baseURL: 'http://localhost:9528/dev-api'
  })
}

export function editTeams(params) {
  return request({
    url: '/team/editTeams',
    method: 'put',
    params: params,
    //baseURL: 'http://localhost:9528/dev-api'
  })
}
