import request from '@/utils/request'

export function getAcceptData(params) {
  return request({
    url: '/userAccept/getAccepts',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8085'
  })
}

export function setAcceptDataApi(params) {
  return request({
    url: '/userAccept/set',
    method: 'post',
    params: params,
    baseURL: 'http://10.19.1.77:8085'
  })
}