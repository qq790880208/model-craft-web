import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/8088/user/login',
    method: 'post',
    params: params
    // baseURL: 'http://10.19.1.77:8088'
    //data,
    //baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getInfo(token) {
  return request({
    //url: '/vue-admin-template/user/info',
    url: '/8088/user/info',
    method: 'get',
    params: { token }
    // baseURL: 'http://10.19.1.77:8088'
    //baseURL: 'http://localhost:9528/dev-api'
  })
}

export function logout() {
  return request({
    url: '/8088/user/logout',
    method: 'post'
    //params: { token },
    // baseURL: 'http://10.19.1.77:8088'
    //baseURL: 'http://localhost:9528/dev-api'
  })
}
