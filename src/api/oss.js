import request from '@/utils/request'

export function listBucket() {
    return request({
        url: '/minio-service/listBucketname',
        method: 'get',
        baseURL: 'http://localhost:8089'
    })
}

export function listObject(params) {
    return request({
        url: '/minio-service/listObjectByPrefix',
        method: 'get',
        params: params,
        baseURL: 'http://localhost:8089'
    })
}

export function listObjectByPrefix(params) {
    return request({
        url: '/minio-service/listObjectByPrefix',
        method: 'get',
        params: params,
        baseURL: 'http://localhost:8089'
    })
}

export function createBucket(params) {
    return request({
        url: '/minio-service/createBucket',
        method: 'get',
        params: params,
        baseURL: 'http://localhost:8089'
    })
}

export function removeBucket(params) {
    return request({
        url: '/minio-service/removeBucket',
        method: 'get',
        params: params,
        baseURL: 'http://localhost:8089'
    })
}

export function removeFile(params) {
    return request({
        url: '/minio-service/removeFile',
        method: 'get',
        params: params,
        baseURL: 'http://localhost:8089'
    })
}

export function upload(params) {
    return request({
        url: '/minio-service/upload',
        method: 'post',
        params: params,
        baseURL: 'http://localhost:8089',
    })
}