import request from '@/utils/request'

export function getAcceptData(params) {
  return request({
    url: '/8085/userAccept/getAccepts',
    method: 'get',
    params: params
    // baseURL: 'http://10.19.1.77:8085'
  })
}

export function setAcceptDataApi(params) {
  return request({
    url: '/8085/userAccept/set',
    method: 'post',
    params: params
    // baseURL: 'http://10.19.1.77:8085'
  })
}

export function getAcceptDataApi(params) {
  return request({
    url: '/8085/userAccept/getAcceptData',
    method: 'get',
    params: params
    // baseURL: 'http://10.19.1.77:8085'
  })
}

export function batchAcceptApi(params) {
  return request({
    url: '/8085/userAccept/batchAccept',
    method: 'put',
    params: params
    // baseURL: 'http://10.19.1.77:8085'
  })
}

export function batchUnAcceptApi(params) {
  return request({
    url: '/8085/userAccept/batchUnAccept',
    method: 'put',
    params: params
    // baseURL: 'http://10.19.1.77:8085'
  })
}

export function acceptApi(params) {
  return request({
    url: '/8085/userAccept/isAccept',
    method: 'put',
    params: params
    // baseURL: 'http://10.19.1.77:8085'
  })
}

export function unAcceptApi(params) {
  return request({
    url: '/8085/userAccept/unAccept',
    method: 'put',
    params: params
    // baseURL: 'http://10.19.1.77:8085'
  })
}
