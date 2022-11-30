import request from '@/utils/httpRequest.js'

//登录
export function userLogin(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data: data
    })
}

//当前用户信息
export function userGetUserInfo(data) {
    return request({
        url: '/user/getUserInfo',
        method: 'post',
        data: data
    })
}

//菜单
export function userMenuList(data) {
    return request({
        url: '/user/menuList',
        method: 'post',
        data: data
    })
}

//员工列表
export function userUserList(data) {
    return request({
        url: '/user/userList',
        method: 'post',
        data: data
    })
}
