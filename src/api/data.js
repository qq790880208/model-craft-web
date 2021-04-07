import request from '@/utils/request'

export function getDataByName(params) {
  return request({
    url: '/data/getdataSet',
    method: 'get',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}

export function getDataByTeam(params) {
  return request({
    url: '/data/getDataTeam',
    method: 'get',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}

export function getDataByManager(params) {
  return request({
    url: '/data/getDataManager',
    method: 'get',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}

export function getLabel(params) {
  return request({
    url: '/userlabel/getAll',
    method: 'get',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}