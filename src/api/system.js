import request from '@/utils/httpRequest.js'

// 模版生成
export function templateGenerate (data) {
    return request({
        url: '/template/generate',
        method: 'post',
        data: data
    })
}

// 获得字典类型的分页列表
export function dictTypePage(data) {
    return request({
        url: '/system/dict-type/page',
        method: 'post',
        data: data
    })
}
// 获得所有字典类型
export function dictTypeListAll(data) {
    return request({
        url: '/system/dict-type/listAll',
        method: 'post',
        data: data
    })
}
// 查询字典类型详细
export function dictTypeGet(data) {
    return request({
        url: '/system/dict-type/get',
        method: 'post',
        data: data
    })
}
// 删除字典类型
export function dictTypeDelete(data) {
    return request({
        url: '/system/dict-type/delete',
        method: 'post',
        data: data
    })
}
// 修改字典类型
export function dictTypeUpdate(data) {
    return request({
        url: '/system/dict-type/update',
        method: 'post',
        data: data
    })
}
// 获得字典数据的分页列表
export function dictDataPage(data) {
    return request({
        url: '/system/dict-data/page',
        method: 'post',
        data: data
    })
}
// 查询字典数据详细
export function dictDataGet(data) {
    return request({
        url: '/system/dict-data/get',
        method: 'post',
        data: data
    })
}
// 删除字典数据
export function dictDataDelete(data) {
    return request({
        url: '/system/dict-data/delete',
        method: 'post',
        data: data
    })
}
// 修改字典数据
export function dictDataUpdate(data) {
    return request({
        url: '/system/dict-data/update',
        method: 'post',
        data: data
    })
}
// 获得字典数据所有列表
export function dictDataListAll(data) {
    return request({
        url: '/system/dict-data/listAll',
        method: 'post',
        data: data
    })
}
