import request from '@/utils/request'

export function uploadImage(data) {
  return request({
    url: '/8082/newupload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function downloadImage(fileName) {
  return request({
    url: `/8082/download/${fileName}`,
    method: 'GET',
    responseType: 'blob',
  })
}

