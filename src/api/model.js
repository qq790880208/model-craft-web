import request from '@/utils/request'

// export function getList(tmp) {
//   return request({
//     url: '/8081/model/group',
//     method: 'get',
//     params: tmp,
//     //baseURL: 'http://10.19.1.181:8081'
//   })
// }

export function getListByName(tmp) {
  return request({
    url: '/8081/model/name/',
    method: 'get',
    params: tmp,
    //baseURL: 'http://10.19.1.181:8081'
  })
}

export function delModelById(mid) {
  return request({
    url: '/8081/model?label_uuid=' + mid,
    method: 'delete',
    data: mid,
    //baseURL: 'http://10.19.1.181:8081'
  })
}

export function addModel(data) {
  return request({
    url: '/8081/model',
    method: 'post',
    data: data,
    //baseURL: 'http://10.19.1.181:8081'
  })
}

