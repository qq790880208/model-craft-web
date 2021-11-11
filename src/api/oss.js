import request from '@/utils/request'

export function listBucket() {
    return request({
        url: '/minio-service/listBucketname',
        method: 'get',
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function listObject(params) {
    return request({
        url: '/minio-service/listObjectByPrefix',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function listObjectByPrefix(params) {
    return request({
        url: '/minio-service/listObjectByPrefix',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function createBucket(params) {
    return request({
        url: '/minio-service/createBucket',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function removeBucket(params) {
    return request({
        url: '/minio-service/removeBucket',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function removeFile(params) {
    return request({
        url: '/minio-service/removeFile',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function upload(formData) {
    return request({
        url: '/minio-service/upload',
        method: 'post',
        data: formData,
        headers: {"Content-Type": "multipart/form-data;charset=utf-8"},
        timeout:1000000,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function uploadZip(formData) {
    return request({
        url: '/minio-service/compressZip',
        method: 'post',
        data: formData,
        headers: {"Content-Type": "multipart/form-data;charset=utf-8"},
        timeout:1000000,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function uploadNew(formData) {
    return request({
        url: '/minio-service/uploadNew',
        method: 'post',
        data: formData,
        headers: {"Content-Type": "multipart/form-data;charset=utf-8"},
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}



export function createFolder(params) {
    return request({
        url: '/minio-service/createFolder',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function listFolder(params) {
    return request({
        url: '/minio-service/listFolder',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function fileRename(params) {
    return request({
        url: '/minio-service/fileRename',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function fileURL(params) {
    return request({
        url: '/minio-service/fileURL',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function fileCopy(params) {
    return request({
        url: '/minio-service/fileCopy',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function fileCopyNew(params) {
    return request({
        url: '/minio-service/fileCopyNew',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function fileMove(params) {
    return request({
        url: '/minio-service/fileMove',
        method: 'get',
        params: params,
        //baseURL: 'http://localhost:8089'
        baseURL: 'http://10.19.1.77:8089'
    })
}

export function downloadZipByPrefixApi(params) {
  return request({
    url: '/minio-service/downloadZipByPrefix',
    method: 'get',
    params: params,
    //baseURL: 'http://localhost:8089'
    baseURL: 'http://10.19.1.77:8089'
  })
}
