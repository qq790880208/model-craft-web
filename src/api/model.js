import request from '@/utils/request'

export function getList(param) {
    return request({
       url:  '/model',
       method: 'get',
       param,
       baseURL: 'http://192.168.19.237:8081'
    }
    )
}