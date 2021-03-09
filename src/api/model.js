import request from '@/utils/request'

export function getList(param) {
  return request({
    url: '/model',
    method: 'get',
    param
  })
}

export function getListByName(name) {
  return request({
    url: '/model/name/' + name,
    method: 'get'
  })
}