import request from '@/utils/request'

export function getAcceptPieDataApi(params) {
  return request({
    url: '/8085/userAccept/getAcceptPieData',
    method: 'get',
    params: params,
    ////baseURL: 'http://127.0.0.1:8085'
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function getAcceptPieDataPassApi(params) {
  return request({
    url: '/8085/userAccept/getAcceptPieDataPass',
    method: 'get',
    params: params,
    ////baseURL: 'http://127.0.0.1:8085'
    //baseURL: 'http://10.19.1.77:8085'
  })
}
