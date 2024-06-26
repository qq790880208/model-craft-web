import request from '@/utils/request'

export function listBucket() {
    return request({
        url: '/8089/minio-service/listBucketname',
        method: 'get'
        //baseURL: 'http://localhost:8089'
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function listObject(params) {
    return request({
        url: '/8089/minio-service/listObjectByPrefix',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function listObjectByPrefix(params) {
    return request({
        url: '/8089/minio-service/listObjectByPrefix',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function createBucket(params) {
    return request({
        url: '/8089/minio-service/createBucket',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function removeBucket(params) {
    return request({
        url: '/8089/minio-service/removeBucket',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function removeFile(params) {
    return request({
        url: '/8089/minio-service/removeFile',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function upload(formData) {
    return request({
        url: '/8089/minio-service/upload',
        method: 'post',
        data: formData,
        headers: {"Content-Type": "multipart/form-data;charset=utf-8"},
        timeout:1000000
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function uploadNew(formData) {
    return request({
        url: '/8089/minio-service/uploadNew',
        method: 'post',
        data: formData,
        headers: {"Content-Type": "multipart/form-data;charset=utf-8"}
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function createFolder(params) {
    return request({
        url: '/8089/minio-service/createFolder',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function listFolder(params) {
    return request({
        url: '/8089/minio-service/listFolder',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function fileRename(params) {
    return request({
        url: '/8089/minio-service/fileRename',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function fileURL(params) {
    return request({
        url: '/8089/minio-service/fileURL',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}

export function fileCopy(params) {
    return request({
        url: '/8089/minio-service/fileCopy',
        method: 'get',
        params: params
        // baseURL: 'http://127.0.0.1:8089'
    })
}