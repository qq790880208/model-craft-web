import request from '@/utils/request'

export function getTagApi(params) {
  return request({
    url: '/8082/dataset/tag',
    method: 'get',
    params: params,
    //baseURL: 'http://10.19.1.181:8082'
  })
}

export function saveTagApi(data) {
    return request({
      url: '/8085/tag/saveTags',
      method: 'post',
      data: data,
      //baseURL: 'http://10.19.1.77:8085'
    })
  }
  
  export function updateTagApi(data) {
    return request({
      url: '/8085/tag/updateTags',
      method: 'put',
      data: data,
      //baseURL: 'http://10.19.1.77:8085'
    })
  }