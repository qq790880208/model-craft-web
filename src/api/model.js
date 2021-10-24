import request from '@/utils/request'

export function getList(tmp) {
  return request({
    url: '/model/group',
    method: 'get',
    params: tmp,
    baseURL: 'http://127.0.0.1:8081'
  })
}

export function getListByName(tmp) {
  return request({
    url: '/model/name/',
    method: 'get',
    params: tmp,
    baseURL: 'http://127.0.0.1:8081'
  })
}

export function delModelById(mid) {
  return request({
    url: '/model?label_uuid=' + mid,
    method: 'delete',
    data: mid,
    baseURL: 'http://127.0.0.1:8081'
  })
}

export function addModel(data) {
  return request({
    url: '/model',
    method: 'post',
    data: data,
    baseURL: 'http://127.0.0.1:8081'
  })
}

