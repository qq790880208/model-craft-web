import request from '@/utils/request'

export function getList(param) {
    return request({
       url:  '/model',
       method: 'get',
       param
    }
    )
}