import request from '@/utils/request'

export function getList(tmp) {
  return request({
    url: '/8081/model/group',
    method: 'get',
    params: tmp
    // baseURL: 'http://127.0.0.1:8081'
  })
}

export function getListByName(tmp) {
  return request({
    url: '/8081/model/name/',
    method: 'get',
    params: tmp
    // baseURL: 'http://127.0.0.1:8081'
  })
}

export function delModelById(mid) {
  return request({
    url: '/8081/model?label_uuid=' + mid,
    method: 'delete',
    data: mid
    // baseURL: 'http://127.0.0.1:8081'
  })
}
