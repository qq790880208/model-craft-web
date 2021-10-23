import request from '@/utils/request'

export function treeMenu() {
  return request({
    url: '/menu/getTree',
    method: 'get',
    baseURL: 'http://127.0.0.1:8088'
  })
}
