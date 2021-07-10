import request from '@/utils/request'

export function treeMenu() {
  return request({
    url: '/8088/menu/getTree',
    method: 'get'
    // baseURL: 'http://10.19.1.77:8088'
  })
}
