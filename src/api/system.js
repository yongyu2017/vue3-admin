import request from '@/utils/httpRequest.js'

// 模版生成
export function templateGenerate (data) {
    return request({
        url: '/template/generate',
        method: 'post',
        data: data
    })
}