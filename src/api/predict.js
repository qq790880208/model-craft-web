import request from '@/utils/request'
export function startTask(query){
  return request({
    url:'/8084/predict/start',
    method:'post',
    params: query,
    ////baseURL: 'http://localhost:9528/dev-api'
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function stopTask(query) {
  return request({
    url: '/8084/predict/stop',
    method: 'post',
    params: query,
    ////baseURL: 'http://localhost:9528/dev-api'
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function deleteTask(query) {
  return request({
    url: '/8084/predict',
    method: 'delete',
    params: query,
    ////baseURL: 'http://localhost:9528/dev-api'
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function showLog(data) {
  return request({
    url:'/8084/predict/log?trainjob_id=' + data,
    method:'post',
    params: data,
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
    url:'/8084/predict/search',
    method:'get',
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function searchStatus(data){//下拉框查询
  return request({
    url:'/8084/predict/search',
    method:'get',
    data: data,
    //baseURL: 'http://10.19.1.181:8084'
  })
}

export function getVisualData(query){
  return request({
    url:'/8084/8084/newtrain/getVisualData',
    method:'get',
    params: query,
    // //baseURL: 'http://localhost:9528/dev-api'
  })
}

export function submitTask(query){
  return request({
    url:'/8084/predict',
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
    // //baseURL: 'http://localhost:9528/dev-api'
  })
}

// export function getTableData1(query){
//   return request({
//     params:query,
//     url:'/8084/predict',
//     method:'get',
//     //baseURL: 'http://10.19.1.181:8084'
//   })
// }

export function getTableData2(params){
  return request({
    params:params,
    url:'/8084/train/search',
    method:'get',
    //baseURL: 'http://10.19.1.181:8084'
  })
}
export function getModels(params){
  return request({
    params:params,
    url:'/8081/model/nopage',
    method:'get',
    //baseURL: 'http://10.19.1.181:8081'
  })
}

export function getTargetDataSets(params) {//创建任务时获取数据集
    return request({
      url: '/8081/model/getTargetDatasets',
      method: 'get',
      params:params,
      //baseURL: 'http://10.19.1.181:8081'
    })
  }

export function getDataByName(params) {//创建任务时获取数据集
    return request({
      url: '/8085/data/getdataSet',
      method: 'get',
      params: params,
      //baseURL: 'http://10.19.1.77:8085'
    })
  }

export function uploadPic(formData) {
    return request({
        url: '/8084/predict/pic0',
        method: 'post',
        data: formData,
        headers: {"Content-Type": "multipart/form-data;charset=utf-8"},
        //////baseURL: 'http://localhost:8089'
        //baseURL: 'http://10.19.1.181:8084'
    })
  }
    export function getAccess() {
      return request({
        url: '/8084/predict/getAccess',
        method: 'get',
        ////baseURL: 'http://localhost:8089'
        //baseURL: 'http://10.19.1.181:8084'
    })
}
