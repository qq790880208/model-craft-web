import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/user/login',
    method: 'post',
    // params: params,
    baseURL: 'http://10.19.1.77:8088',
    // baseURL: 'http://localhost:8088',
    data: params
    //baseURL: 'http://localhost:9528/dev-api'
   })
}

export function getInfo(token) {
  return request({
    //url: '/vue-admin-template/user/info',
    url: '/user/info',
    method: 'get',
    params: { token },
    baseURL: 'http://10.19.1.77:8088',
    // baseURL: 'http://localhost:8088',
    //baseURL: 'http://localhost:9528/dev-api'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
    //params: { token },
    baseURL: 'http://10.19.1.77:8088',
    // baseURL: 'http://localhost:8088',
    //baseURL: 'http://localhost:9528/dev-api'
  })
}
