import request from '@/utils/request'

export function treeMenu() {
  return request({
    url: '/8088/menu/getTree',
    method: 'get'
    // baseURL: 'http://127.0.0.1:8088'
  })
}
