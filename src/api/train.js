import request from '@/utils/request'

export function getVisualData() {
  return request({
    url: '/train/getVisualData',
    method: 'get',
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getTableData() {
  return request({
    url: '/train/getTableData',
    method: 'get',
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getcreateInfo() {
  return request({
    url: '/train/getcreateInfo',
    method: 'get',
    baseURL: 'http://localhost:9528/dev-api'
  })
}
export function sendTaskInfo(task) {
  return request({
    url: '/train/sendTaskInfo',
    method: 'get',
    params:task,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

