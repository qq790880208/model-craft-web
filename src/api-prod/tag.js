import request from '@/utils/request'

export function getTagApi(params) {
  return request({
    url: '/8082/dataset/tag',
    method: 'get',
    params: params
    // baseURL: 'http://127.0.0.1:8082'
  })
}