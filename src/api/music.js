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

