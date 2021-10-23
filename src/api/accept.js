import request from '@/utils/request'

export function getAcceptData(params) {
  return request({
    url: '/userAccept/getAccepts',
    method: 'get',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}

export function setAcceptDataApi(params) {
  return request({
    url: '/userAccept/set',
    method: 'post',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}

export function getAcceptDataApi(params) {
  return request({
    url: '/userAccept/getAcceptData',
    method: 'get',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}

export function batchAcceptApi(params) {
  return request({
    url: '/userAccept/batchAccept',
    method: 'put',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}

export function batchUnAcceptApi(params) {
  return request({
    url: '/userAccept/batchUnAccept',
    method: 'put',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}

export function acceptApi(params) {
  return request({
    url: '/userAccept/isAccept',
    method: 'put',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}

export function unAcceptApi(params) {
  return request({
    url: '/userAccept/unAccept',
    method: 'put',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}
