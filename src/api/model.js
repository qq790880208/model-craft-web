import request from '@/utils/request'

export function getList(param) {
  return request({
    url: '/model',
    method: 'get',
    param,
    baseURL: 'http://192.168.19.237:8081'
  })
}

export function getListByName(name) {
  return request({
    url: '/model/name/' + name,
    method: 'get',
    baseURL: 'http://192.168.19.237:8081'
  })
}
