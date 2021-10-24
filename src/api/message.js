import request from '@/utils/request'

export function getAcceptPieDataApi(params) {
  return request({
    url: '/userAccept/getAcceptPieData',
    method: 'get',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}

export function getAcceptPieDataPassApi(params) {
  return request({
    url: '/userAccept/getAcceptPieDataPass',
    method: 'get',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}
