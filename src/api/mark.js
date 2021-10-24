import request from '@/utils/request'

export function isnowlabel(params) {
  return request({
    url: '/label/setLabeling',
    method: 'post',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}

export function savelabel(data) {
  // console.log("hahaha",data)
  return request({
    url: '/label',
    method: 'put',
    data: data,
    baseURL: 'http://127.0.0.1:8082'
  })
}

export function automark(params, imagelength) {
  return request({
    url: '/dataset/auto',
    method: 'post',
    params: params,
    timeout: imagelength * 5000,
    baseURL: 'http://127.0.0.1:8082'
  })
}

export function generateInfo(params) {
  return request({
    url: '/dataset/save',
    method: 'post',
    params: params,
    baseURL: 'http://127.0.0.1:8082'
  })
}

export function setUnAccept(params) {
  return request({
    url: '/data/setUnAccept',
    method: 'put',
    params: params,
    baseURL: 'http://127.0.0.1:8085'
  })
}
