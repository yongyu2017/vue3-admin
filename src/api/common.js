import request from '@/utils/httpRequest.js'

// 文件上传
export function commonUpload (data) {
    return request({
        url: '/common/upload',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    })
}
