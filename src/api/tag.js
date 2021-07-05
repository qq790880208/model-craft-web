import request from '@/utils/request'

export function getTagApi(params) {
  return request({
    url: '/tag/get',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8085'
  })
}