import request from '@/utils/request'

export function getList(id) {
  return request({
    url: '/model/group' + '?user_id=' + id,
    method: 'get',
    baseURL: 'http://192.168.19.237:8081'
  })
}

export function getListByName(uid, name) {
  return request({
    url: '/model/name/' + "?name=" + name + '&user_id=' + uid ,
    method: 'get',
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