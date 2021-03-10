import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token },
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post',
    baseURL: 'http://localhost:9528/dev-api'
  })
}
