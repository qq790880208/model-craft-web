import request from '@/utils/request'

export function getTagApi(params) {
  return request({
    url: '/dataset/tag',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.181:8082'
  })
}