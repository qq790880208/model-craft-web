import request from '@/utils/request'

export function treeMenu() {
  return request({
    url: '/menu/getTree',
    method: 'get',
    baseURL: 'http://192.168.19.207:8088'
  })
}
