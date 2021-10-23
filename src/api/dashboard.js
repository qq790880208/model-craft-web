import request from '@/utils/request'

export function getAllUserCountApi() {
  return request({
    url: '/userManage/allUserCount',
    method: 'get',
    baseURL: 'http://10.19.1.77:8088'
  })
}

export function getActiveUserCountApi() {
  return request({
    url: '/userManage/activeUserCount',
    method: 'get',
    baseURL: 'http://10.19.1.77:8088'
  })
}
