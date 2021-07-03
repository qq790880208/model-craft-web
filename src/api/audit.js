import request from '@/utils/request'

export function getAuditData(params) {
  return request({
    url: '/userAudit/getAudits',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8085'
  })
}

export function getAuditDatasByUserId(params) {
  return request({
    url: '/userAudit/getAuditData',
    method: 'get',
    params: params,
    baseURL: 'http://10.19.1.77:8085'
  })
}

export function batchSaveApi(params) {
  return request({
    url: '/userAudit/batchSave',
    method: 'put',
    params: params,
    baseURL: 'http://10.19.1.77:8085'
  })
}

export function batchRejectApi(params) {
  return request({
    url: '/userAudit/batchReject',
    method: 'put',
    params: params,
    baseURL: 'http://10.19.1.77:8085'
  })
}

export function batchReSetApi(params) {
  return request({
    url: '/userAudit/batchReSet',
    method: 'put',
    params: params,
    baseURL: 'http://10.19.1.77:8085'
  })
}