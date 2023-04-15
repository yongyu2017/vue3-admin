const { userLogin, userGetUserInfo, userSetUserInfo, userModifyPwd, userMenuList, userNav, userAddOrModifyNav, userDeleteNav, userGetNav, userRole, userAddOrModifyRole, userDeleteRole, userGetRole, userUserList, userAddOrModifyUser, userDeleteUser, userGetUser, } = require('./user.js')
const { userPeopleList, userAddOrModifyPeople, userDeletePeople, userGetPeople } = require('./personnel.js')
const { templateGenerate } = require('./generate.js')

module.exports = {
    userLogin: { path: '/user/login', fn: userLogin },
    userGetUserInfo: { path: '/user/getUserInfo', fn: userGetUserInfo },
    userSetUserInfo: { path: '/user/setUserInfo', fn: userSetUserInfo },
    userModifyPwd: { path: '/user/modifyPwd', fn: userModifyPwd },
    userMenuList: { path: '/user/menuList', fn: userMenuList },
    userNav: { path: '/user/nav', fn: userNav },
    userAddOrModifyNav: { path: '/user/addOrModifyNav', fn: userAddOrModifyNav },
    userDeleteNav: { path: '/user/deleteNav', fn: userDeleteNav },
    userGetNav: { path: '/user/getNav', fn: userGetNav },
    userPeopleList: { path: '/personnel/peopleList', fn: userPeopleList },
    userAddOrModifyPeople: { path: '/personnel/addOrModifyPeople', fn: userAddOrModifyPeople },
    userDeletePeople: { path: '/personnel/deletePeople', fn: userDeletePeople },
    userGetPeople: { path: '/personnel/getPeople', fn: userGetPeople },
    userRole: { path: '/user/role', fn: userRole },
    userAddOrModifyRole: { path: '/user/addOrModifyRole', fn: userAddOrModifyRole },
    userDeleteRole: { path: '/user/deleteRole', fn: userDeleteRole },
    userGetRole: { path: '/user/getRole', fn: userGetRole },
    userUserList: { path: '/user/userList', fn: userUserList },
    userAddOrModifyUser: { path: '/user/addOrModifyUser', fn: userAddOrModifyUser },
    userDeleteUser: { path: '/user/deleteUser', fn: userDeleteUser },
    userGetUser: { path: '/user/getUser', fn: userGetUser },
    templateGenerate: { path: '/template/generate', fn: templateGenerate },
}