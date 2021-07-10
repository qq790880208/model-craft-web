import request from '@/utils/request'
export function startTask(query){
  return request({
    url:'/predict/start',
    method:'post',
    params: query,
    //baseURL: 'http://localhost:9528/dev-api'
    baseURL: 'http://10.19.1.181:8084'
  })
}

export function stopTask(query) {
  return request({
    url: '/predict/stop',
    method: 'post',
    params: query,
    //baseURL: 'http://localhost:9528/dev-api'
    baseURL: 'http://10.19.1.181:8084'
  })
}

export function deleteTask(query) {
  return request({
    url: '/predict',
    method: 'delete',
    params: query,
    //baseURL: 'http://localhost:9528/dev-api'
    baseURL: 'http://10.19.1.181:8084'
  })
}

export function showLog() {
  return request({
    url:'/predict/log',
    method:'post',
    //baseURL: 'http://localhost:9528/dev-api'
    baseURL: 'http://10.19.1.181:8084'
  })
}

// export function getTableData(){
//   return request({
//     url:'/newtrain/getTableData',
//     method:'get',
//     baseURL: 'http://localhost:9528/dev-api'
//   })
// }

export function search(query){//输入框查询
  return request({
    params:query,
    url:'/train/search',
    method:'get',
    baseURL: 'http://10.19.1.181:8084'
  })
}

export function searchStatus(data){//下拉框查询
  return request({
    url:'/newtrain/searchStatus',
    method:'get',
    data
    // baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getVisualData(query){
  return request({
    url:'/8084/newtrain/getVisualData',
    method:'get',
    params: query,
    // baseURL: 'http://localhost:9528/dev-api'
  })
}

export function submitTask(query){
  return request({
    url:'/predict',
    method:'post',
    data: query,
    baseURL: 'http://10.19.1.181:8084'
  })
}

export function getinitialPara(query){
  return request({
    url:'/newtrain/getinitialPara',
    method:'get',
    params: query,
    // baseURL: 'http://localhost:9528/dev-api'
  })
}

export function getTableData1(query){
  return request({
    params:query,
    url:'/predict',
    method:'get',
    baseURL: 'http://10.19.1.181:8084'
  })
}

export function getTableData2(params){
  return request({
    params:params,
    url:'/train/search',
    method:'get',
    baseURL: 'http://10.19.1.181:8084'
  })
}

export function getDataByName(params) {//创建任务时获取数据集
    return request({
      url: '/data/getdataSet',
      method: 'get',
      params: params,
      baseURL: 'http://10.19.1.77:8085'
    })
  }