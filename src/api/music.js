import request from '@/utils/httpRequest.js'

// 获取音乐目录列表
export function musicDirectoryList(data) {
    return request({
        url: '/music/directory/list',
        method: 'post',
        data: data
    })
}
// 获取音乐目录详情
export function musicDirectoryGet(data) {
    return request({
        url: '/music/directory/get',
        method: 'post',
        data: data
    })
}
// 音乐目录新增或修改
export function musicDirectoryAddOrModify(data) {
    return request({
        url: '/music/directory/addOrModify',
        method: 'post',
        data: data
    })
}
// 获取音乐目录删除
export function musicDirectoryDelete(data) {
    return request({
        url: '/music/directory/delete',
        method: 'post',
        data: data
    })
}

// 获取曲库列表
export function musicLibraryList(data) {
    return request({
        url: '/music/library/list',
        method: 'post',
        data: data
    })
}
// 获取曲库详情
export function musicLibraryGet(data) {
    return request({
        url: '/music/library/get',
        method: 'post',
        data: data
    })
}
// 曲库信息修改或新增
export function musicLibraryAddOrModify(data) {
    return request({
        url: '/music/library/addOrModify',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    })
}
// 曲库删除
export function musicLibraryDelete(data) {
    return request({
        url: '/music/library/delete',
        method: 'post',
        data: data
    })
}

// 获取音乐标签列表
export function musicLabelList(data) {
    return request({
        url: '/music/label/list',
        method: 'post',
        data: data
    })
}
// 获取音乐标签详情
export function musicLabelGet(data) {
    return request({
        url: '/music/label/get',
        method: 'post',
        data: data
    })
}
// 新增或修改音乐标签
export function musicLabelAddOrModify(data) {
    return request({
        url: '/music/label/addOrModify',
        method: 'post',
        data: data
    })
}
// 删除音乐标签
export function musicLabelDelete(data) {
    return request({
        url: '/music/label/delete',
        method: 'post',
        data: data
    })
}
// 获取所有音乐标签
export function musicLabelListAll(data) {
    return request({
        url: '/music/label/listAll',
        method: 'post',
        data: data
    })
}
