import request from '@/utils/request'

export function getList(tmp) {
  return request({
    url: '/model/group',
    method: 'get',
    params: tmp,
    baseURL: 'http://192.168.19.237:8081'
  })
}

export function getListByName(tmp) {
  return request({
    url: '/model/name/',
    method: 'get',
    params: tmp,
    baseURL: 'http://192.168.19.237:8081'
  })
}

export function delModelById(mid) {
  return request({
    url: '/model?label_uuid=' + mid,
    method: 'delete',
    data: mid,
    baseURL: 'http://192.168.19.237:8081'
  })
}
