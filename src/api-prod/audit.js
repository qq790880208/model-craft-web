import request from '@/utils/request'

export function getAuditData(params) {
  return request({
    url: '/8085/userAudit/getAudits',
    method: 'get',
    params: params
    // baseURL: 'http://127.0.0.1:8085'
  })
}

export function getAuditDatasByUserId(params) {
  return request({
    url: '/8085/userAudit/getAuditData',
    method: 'get',
    params: params
    // baseURL: 'http://127.0.0.1:8085'
  })
}

export function batchSaveApi(params) {
  return request({
    url: '/8085/userAudit/batchSave',
    method: 'put',
    params: params
    // baseURL: 'http://127.0.0.1:8085'
  })
}

export function batchRejectApi(params) {
  return request({
    url: '/8085/userAudit/batchReject',
    method: 'put',
    params: params
    // baseURL: 'http://127.0.0.1:8085'
  })
}

export function batchReSetApi(params) {
  return request({
    url: '/8085/userAudit/batchReSet',
    method: 'put',
    params: params
    // baseURL: 'http://127.0.0.1:8085'
  })
}

export function passApi(params) {
  return request({
    url: '/8085/userAudit/isAudit',
    method: 'put',
    params: params
    // baseURL: 'http://127.0.0.1:8085'
  })
}

export function reSetApi(params) {
  return request({
    url: '/8085/userAudit/isReSet',
    method: 'put',
    params: params
    // baseURL: 'http://127.0.0.1:8085'
  })
}

export function rejectApi(params) {
  return request({
    url: '/8085/userAudit/isReject',
    method: 'put',
    params: params
    // baseURL: 'http://127.0.0.1:8085'
  })
}

export function getIsAuditApi(params) {
  return request({
    url: '/8085/userAudit/getAudit',
    method: 'get',
    params: params
    // baseURL: 'http://127.0.0.1:8085'
  })
}