import request from '@/utils/httpRequest.js'

//获取员工列表
export function personnelPeopleList(data) {
    return request({
        url: '/personnel/peopleList',
        method: 'post',
        data: data
    })
}

//新增或修改员工信息
export function personnelAddOrModifyPeople(data) {
    return request({
        url: '/personnel/addOrModifyPeople',
        method: 'post',
        data: data
    })
}

//删除员工信息
export function personnelDeletePeople(data) {
    return request({
        url: '/personnel/deletePeople',
        method: 'post',
        data: data
    })
}

//获取员工信息
export function personnelGetPeople(data) {
    return request({
        url: '/personnel/getPeople',
        method: 'post',
        data: data
    })
}
