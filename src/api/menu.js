import request from '@/utils/request'

export function treeMenu() {
  return request({
    url: '/menu/getTree',
    method: 'get'
  })
}
