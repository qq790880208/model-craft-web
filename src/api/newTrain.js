import request from '@/utils/request'
export function startTask(query){
  return request({
    url:'/newtrain/start',
    method:'post',
    params: query,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function stopTask(query){
  return request({
    url:'/newtrain/stop',
    method:'post',
    params: query,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function deleteTask(query){
  return request({
    url:'/newtrain/delete',
    method:'delete',
    params: query,
    //baseURL: 'http://localhost:9528/dev-api'
    baseURL: 'http://192.168.19.237:8084'
  })
}

// export function getTableData(){
//   return request({
//     url:'/newtrain/getTableData',
//     method:'get',
//     baseURL: 'http://localhost:9528/dev-api'
//   })
// }

export function search(data){//输入框查询
  return request({
    url:'/newtrain/search',
    method:'get',
    data,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function searchStatus(data){//下拉框查询
  return request({
    url:'/newtrain/searchStatus',
    method:'get',
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

export function submitTask(query){
  return request({
    url:'/newtrain/submitTask',
    method:'post',
    params: query,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getinitialPara(query){
  return request({
    url:'/newtrain/getinitialPara',
    method:'get',
    params: query,
    baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getTableData1(query){
  return request({
    params:query,
    url:'/train',
    method:'get',
    baseURL: 'http://192.168.19.237:8084'
  })
}