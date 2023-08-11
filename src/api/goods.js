import request from '@/utils/httpRequest.js'

// 获取商品列表
export function goodsGoodsPage (data) {
    return request({
        url: '/goods/goods/page',
        method: 'post',
        data: data
    })
}
// 获取所有商品
export function goodsGoodsListAll (data) {
    return request({
        url: '/goods/goods/listAll',
        method: 'post',
        data: data
    })
}
// 新增或者修改商品信息
export function goodsGoodsUpdate (data) {
    return request({
        url: '/goods/goods/update',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    })
}
// 获取商品信息
export function goodsGoodsGet (data) {
    return request({
        url: '/goods/goods/get',
        method: 'post',
        data: data
    })
}
// 删除商品
export function goodsGoodsDelete (data) {
    return request({
        url: '/goods/goods/delete',
        method: 'post',
        data: data
    })
}
// 获取商品分类
export function goodsCategoryPage (data) {
    return request({
        url: '/goods/category/page',
        method: 'post',
        data: data
    })
}
// 获取所有商品分类
export function goodsCategoryListAll (data) {
    return request({
        url: '/goods/category/listAll',
        method: 'post',
        data: data
    })
}
// 新增或者修改商品分类
export function goodsCategoryUpdate (data) {
    return request({
        url: '/goods/category/update',
        method: 'post',
        data: data
    })
}
// 获取商品分类详情
export function goodsCategoryGet (data) {
    return request({
        url: '/goods/category/get',
        method: 'post',
        data: data
    })
}
// 删除商品分类
export function goodsCategoryDelete (data) {
    return request({
        url: '/goods/category/delete',
        method: 'post',
        data: data
    })
}
// 获取商品入库列表
export function goodsWarehousingPage (data) {
    return request({
        url: '/goods/warehousing/page',
        method: 'post',
        data: data
    })
}
// 新增或者修改商品入库信息
export function goodsWarehousingUpdate (data) {
    return request({
        url: '/goods/warehousing/update',
        method: 'post',
        data: data
    })
}
// 获取商品入库信息
export function goodsWarehousingGet (data) {
    return request({
        url: '/goods/warehousing/get',
        method: 'post',
        data: data
    })
}
// 删除商品入库信息
export function goodsWarehousingDelete (data) {
    return request({
        url: '/goods/warehousing/delete',
        method: 'post',
        data: data
    })
}
// 商品出入库
export function goodsWarehousingSale (data) {
    return request({
        url: '/goods/warehousing/sale',
        method: 'post',
        data: data
    })
}
