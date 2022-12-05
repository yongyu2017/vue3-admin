import request from '@/utils/httpRequest.js'

//登录
export function userLogin(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data: data
    })
}

//获取用户信息
export function userGetUserInfo(data) {
    return request({
        url: '/user/getUserInfo',
        method: 'post',
        data: data
    })
}

//设置用户信息
export function userSetUserInfo(data) {
    return request({
        url: 'user/setUserInfo',
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

//获取员工列表
export function userUserList(data) {
    return request({
        url: '/user/userList',
        method: 'post',
        data: data
    })
}

//新增或修改员工信息
export function userAddOrModifyPeople(data) {
    return request({
        url: '/user/addOrModifyPeople',
        method: 'post',
        data: data
    })
}

//删除员工信息
export function userDeletePeople(data) {
    return request({
        url: '/user/deletePeople',
        method: 'post',
        data: data
    })
}

//获取员工信息
export function userGetPeople(data) {
    return request({
        url: '/user/getPeople',
        method: 'post',
        data: data
    })
}

