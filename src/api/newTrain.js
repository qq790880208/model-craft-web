import request from '@/utils/request'
export function startTask(query){
  return request({
    url:'/8084/train/start',
    method:'post',
    params: query,
    ////baseURL: 'http://localhost:9528/dev-api'
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function stopTask(query) {
  return request({
    url: '/8084/train/stop',
    method: 'post',
    params: query,
    ////baseURL: 'http://localhost:9528/dev-api'
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function deleteTask(query) {
  return request({
    url: '/8084/train',
    method: 'delete',
    params: query,
    ////baseURL: 'http://localhost:9528/dev-api'
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function showLog(train_id) {
  return request({
    url:'/8084/train/log',

    method:'post',
    params:train_id,
    ////baseURL: 'http://localhost:9528/dev-api'
    //baseURL: 'http://10.19.1.181:8084'
  })
}

// export function getTableData(){
//   return request({
//     url:'/8084/newtrain/getTableData',
//     method:'get',
//     //baseURL: 'http://localhost:9528/dev-api'
//   })
// }

export function search(query){//输入框查询
  return request({
    params:query,
    url:'/8084/train/search',
    method:'get',
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function searchStatus(data){//下拉框查询
  return request({
    url:'/8084/train/search',
    method:'get',
    data,
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function getVisualData(query){
  return request({
    url:'/8084/newtrain/getVisualData',
    method:'get',
    params: query,
    //baseURL: 'http://localhost:9528/dev-api'
  })
}

export function submitTask(query){
  return request({
    url:'/8084/train',
    method:'post',
    data: query,
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function getinitialPara(query){
  return request({
    url:'/8084/newtrain/getinitialPara',
    method:'get',
    params: query,
    //baseURL: 'http://localhost:9528/dev-api'
  })
}

// export function getTableData1(query){
//   return request({
//     params:query,
//     url:'/8084/train',
//     method:'get',
//     //baseURL: 'http://10.19.1.181:8084'
//   })
// }

export function getDataByName(params) {//创建任务时获取数据集
    return request({
      url: '/8085/data/getdataSet',
      method: 'get',
      params: params,
      //baseURL: 'http://10.19.1.77:8085'
    })
  }

  export function getAcceptData(params) {
      return request({
          url: '/8085/data/getAcceptData',
          method: 'get',
          params: params,
          //baseURL: 'http://10.19.1.77:8085'
        })
  }
