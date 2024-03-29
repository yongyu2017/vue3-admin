import request from '@/utils/httpRequest.js'

//登录
export function userLogin(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data: data
    })
}

//获取当前用户信息
export function userGetUserInfo(data) {
    return request({
        url: '/user/getUserInfo',
        method: 'post',
        data: data
    })
}

//修改当前用户信息
export function userSetUserInfo(data) {
    return request({
        url: '/user/setUserInfo',
        method: 'post',
        data: data
    })
}

// 修改当前用户密码
export function userModifyPwd(data) {
    return request({
        url: '/user/modifyPwd',
        method: 'post',
        data: data
    })
}

//获取当前用户菜单
export function userMenuList(data) {
    return request({
        url: '/user/menuList',
        method: 'post',
        data: data
    })
}

//获取菜单列表
export function userNav(data) {
    return request({
        url: '/user/nav',
        method: 'post',
        data: data
    })
}

//新增或修改菜单
export function userAddOrModifyNav(data) {
    return request({
        url: '/user/addOrModifyNav',
        method: 'post',
        data: data
    })
}

//删除菜单
export function userDeleteNav(data) {
    return request({
        url: '/user/deleteNav',
        method: 'post',
        data: data
    })
}

//获取菜单信息
export function userGetNav(data) {
    return request({
        url: '/user/getNav',
        method: 'post',
        data: data
    })
}

//获取角色列表
export function userRole(data) {
    return request({
        url: '/user/role',
        method: 'post',
        data: data
    })
}

//新增或修改角色信息
export function userAddOrModifyRole(data) {
    return request({
        url: '/user/addOrModifyRole',
        method: 'post',
        data: data
    })
}

//删除角色信息
export function userDeleteRole(data) {
    return request({
        url: '/user/deleteRole',
        method: 'post',
        data: data
    })
}

//获取角色信息
export function userGetRole(data) {
    return request({
        url: '/user/getRole',
        method: 'post',
        data: data
    })
}

//获取用户列表
export function userUserList(data) {
    return request({
        url: '/user/userList',
        method: 'post',
        data: data
    })
}

//新增或修改用户信息
export function userAddOrModifyUser(data) {
    return request({
        url: '/user/addOrModifyUser',
        method: 'post',
        data: data
    })
}

//删除用户信息
export function userDeleteUser(data) {
    return request({
        url: '/user/deleteUser',
        method: 'post',
        data: data
    })
}

//获取用户信息
export function userGetUser(data) {
    return request({
        url: '/user/getUser',
        method: 'post',
        data: data
    })
}
