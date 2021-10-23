import request from '@/utils/request'

export function getTagApi(params) {
  return request({
    url: '/dataset/tag',
    method: 'get',
    params: params,
    baseURL: 'http://127.0.0.1:8082'
  })
}

export function saveTagApi(data) {
  return request({
    url: '/tag/saveTags',
    method: 'post',
    data: data,
    baseURL: 'http://127.0.0.1:8085'
  })
}

export function updateTagApi(data) {
  return request({
    url: '/tag/updateTags',
    method: 'put',
    data: data,
    baseURL: 'http://127.0.0.1:8085'
  })
}
