import request from '@/utils/request'
export function startTask(query){
  return request({
    url:'/newtrain/start',
    method:'post',
    params: query,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function stopTask(data){
  return request({
    url:'/newtrain/stop',
    method:'post',
    data,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function deleteTask(data){
  return request({
    url:'/newtrain/delete',
    method:'post',
    data,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getTableData(){
  return request({
    url:'/newtrain/getTableData',
    method:'get',
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function search(data){
  return request({
    url:'/newtrain/search',
    method:'post',
    data,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function searchStatus(data){
  return request({
    url:'/newtrain/searchStatus',
    method:'post',
    data,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getVisualData(query){
  return request({
    url:'/newtrain/getVisualData',
    method:'get',
    params: query,
    baseURL: 'http://localhost:9528/dev-api'
  })
}