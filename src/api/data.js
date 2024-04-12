import request from '@/utils/request'

export function getDataByName(params) {
  return request({
    url: '/8085/data/getdataSet',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function getAssignData(params) {
  return request({
    url: '/8085/data/getAssignedData',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function getDataByTeam(params) {
  return request({
    url: '/8085/data/getDataTeam',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function getDataByManager(params) {
  return request({
    url: '/8085/data/getDataManager',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function createDataSetApi(params) {
  return request({
    url: '/8085/data/create',
    method: 'post',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

// export function deleteDataSet(params) {
//   return request({
//     url: '/8085/data/delete',
//     method: 'delete',
//     params: params,
//     //baseURL: 'http://10.19.1.77:8085'
//   })
// }

export function deleteDataSet(params) {
  return request({
    url: '/8089/dataset/delete',
    method: 'delete',
    params: params,
    //baseURL: 'http://10.19.1.77:8089'
  })
}

export function getLabel(params) {
  return request({
    url: '/8085/userlabel/getAll',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function getLabelDataApi(params) {
  return request({
    url: '/8085/userlabel/getLabel',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function deleteData(params) {
  return request({
    url: '/8085/userlabel/deleteData',
    method: 'delete',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function assignLabel(params) {
  return request({
    url: '/8085/userlabel/assignLabel',
    method: 'post',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function addNewLabels(params) {
  return request({
    url: '/8085/label/addNewLabel',
    method: 'post',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function assignNewData(params) {
  return request({
    url: '/8085/userlabel/assignNewData',
    method: 'post',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function getNewFile(params) {
  return request({
    url: '/8085/file/getFiles',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function refresh(params) {
  return request({
    url: '/8085/label/fresh',
    method: 'put',
    params: params,
    //baseURL: 'http://10.19.1.77:8089'
  })
}

export function addTags(params) {
  return request({
    url: '/8085/tag/add',
    method: 'post',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function getTags(params) {
  return request({
    url: '/8085/tag/get',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function updateTags(params) {
  return request({
    url: '/8085/tag/update',
    method: 'put',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function assignByNewTeamUser(params) {
  return request({
    url: '/8085/userlabel/reAssignByAddUser',
    method: 'put',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function assignLabelDataChange(params) {
  return request({
    url: '/8085/userlabel/assignNewData',
    method: 'post',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function outTimeReAssign(params) {
  return request({
    url: '/8085/userlabel/reAssign',
    method: 'post',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function getNewLabels(params) {
  return request({
    url: '/8085/userlabel/getNewLabel',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}

export function delTeamTaskApi(params) {
  return request({
    url: '/8085/teamdataset/delTeam',
    method: 'delete',
    params: params,
    //baseURL: 'http://10.19.1.77:8085'
  })
}
