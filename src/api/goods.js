import request from '@/utils/httpRequest.js'

// 获取商品列表
export function goodsGoodsList (data) {
    return request({
        url: '/goods/goods/goods',
        method: 'post',
        data: data
    })
}

// 新增或者修改商品信息
export function goodsGoodsAddOrModify (data) {
    return request({
        url: '/goods/goods/addOrModify',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    })
}


// 获取商品信息
export function goodsGoodsDetail (data) {
    return request({
        url: '/goods/goods/detail',
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
export function goodsCategoryList (data) {
    return request({
        url: '/goods/category/list',
        method: 'post',
        data: data
    })
}

// 新增或者修改商品分类
export function goodsCategoryAddOrModify (data) {
    return request({
        url: '/goods/category/addOrModify',
        method: 'post',
        data: data
    })
}

// 获取商品分类详情
export function goodsCategoryDetail (data) {
    return request({
        url: '/goods/category/detail',
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

