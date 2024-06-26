import request from '@/utils/request'
export function startTask(query){
  return request({
    url:'/8084/train/start',
    method:'post',
    params: query
    //baseURL: 'http://localhost:9528/dev-api'
    // baseURL: 'http://127.0.0.1:8084'
  })
}

export function stopTask(query) {
  return request({
    url: '/8084/train/stop',
    method: 'post',
    params: query
    //baseURL: 'http://localhost:9528/dev-api'
    // baseURL: 'http://127.0.0.1:8084'
  })
}

export function deleteTask(query) {
  return request({
    url: '/8084/train',
    method: 'delete',
    params: query
    //baseURL: 'http://localhost:9528/dev-api'
    // baseURL: 'http://127.0.0.1:8084'
  })
}

export function showLog() {
  return request({
    url:'/8084/train/log',
    method:'post'
    //baseURL: 'http://localhost:9528/dev-api'
    // baseURL: 'http://127.0.0.1:8084'
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
    url:'/8084/train/search',
    method:'get'
    // baseURL: 'http://127.0.0.1:8084'
  })
}

export function searchStatus(data){//下拉框查询
  return request({
    url:'/8084/newtrain/searchStatus',
    method:'get',
    data,
    baseURL: 'http://localhost:9528/dev-api'
    //  baseURL: 'http://localhost:' 目前修改的
  })
}

export function getVisualData(query){
  return request({
    url:'/8084/newtrain/getVisualData',
    method:'get',
    params: query,
    baseURL: 'http://localhost:9528/dev-api'
    // baseURL: 'http://localhost:'  目前修改的
  })
}

export function submitTask(query){
  return request({
    url:'/8084/train',
    method:'post',
    data: query
    // baseURL: 'http://127.0.0.1:8084'
  })
}

export function getinitialPara(query){
  return request({
    url:'/8084/newtrain/getinitialPara',
    method:'get',
    params: query,
    baseURL: 'http://localhost:9528/dev-api'
    // baseURL: 'http://localhost:' 目前修改的
  })
}

export function getTableData1(query){
  return request({
    params:query,
    url:'/8084/train',
    method:'get'
    // baseURL: 'http://127.0.0.1:8084'
  })
}

export function getDataByName(params) {//创建任务时获取数据集
    return request({
      url: '/8085/data/getdataSet',
      method: 'get',
      params: params
  //     baseURL: 'http://127.0.0.1:8085'
    })
  }
