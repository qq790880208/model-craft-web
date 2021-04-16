import request from '@/utils/request'

export function getDataByName(params) {
  return request({
    url: '/data/getdataSet',
    method: 'get',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}

export function getAssignData(params) {
  return request({
    url: '/data/getAssignedData',
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

export function createDataSet(params) {
  return request({
    url: '/data/create',
    method: 'post',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}

export function deleteDataSet(params) {
  return request({
    url: '/data/delete',
    method: 'delete',
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

export function deleteData(params) {
  return request({
    url: '/userlabel/deleteData',
    method: 'delete',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}

export function assignLabel(params) {
  return request({
    url: '/userlabel/assignLabel',
    method: 'post',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}

export function addNewLabels(params) {
  return request({
    url: '/label/addNewLabel',
    method: 'post',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}

export function assignNewData(params) {
  return request({
    url: '/userlabel/assignNewData',
    method: 'post',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}

export function getNewFile(params) {
  return request({
    url: '/file/getFiles',
    method: 'get',
    params: params,
    baseURL: 'http://192.168.19.239:8085'
  })
}