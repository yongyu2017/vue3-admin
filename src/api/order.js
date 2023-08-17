import request from '@/utils/httpRequest.js'

// 获取订单列表
export function orderOrderPage (data) {
    return request({
        url: '/order/order/page',
        method: 'post',
        data: data
    })
}
// 删除订单
export function orderOrderDelete (data) {
    return request({
        url: '/order/order/delete',
        method: 'post',
        data: data
    })
}
