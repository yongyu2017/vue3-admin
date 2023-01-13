const { userLogin, userGetUserInfo, userSetUserInfo, userModifyPwd, userMenuList, userNav, userAddOrModifyNav, userDeleteNav, userGetNav, userRole, userAddOrModifyRole, userDeleteRole, userGetRole, userUserList, userAddOrModifyUser, userDeleteUser, userGetUser, } = require('./user.js')
const { userPeopleList, userAddOrModifyPeople, userDeletePeople, userGetPeople } = require('./personnel.js')

module.exports = {
    userLogin: { path: '/user/login', component: userLogin },
    userGetUserInfo: { path: '/user/getUserInfo', component: userGetUserInfo },
    userSetUserInfo: { path: '/user/setUserInfo', component: userSetUserInfo },
    userModifyPwd: { path: '/user/modifyPwd', component: userModifyPwd },
    userMenuList: { path: '/user/menuList', component: userMenuList },
    userNav: { path: '/user/nav', component: userNav },
    userAddOrModifyNav: { path: '/user/addOrModifyNav', component: userAddOrModifyNav },
    userDeleteNav: { path: '/user/deleteNav', component: userDeleteNav },
    userGetNav: { path: '/user/getNav', component: userGetNav },
    userPeopleList: { path: '/user/peopleList', component: userPeopleList },
    userAddOrModifyPeople: { path: '/user/addOrModifyPeople', component: userAddOrModifyPeople },
    userDeletePeople: { path: '/user/deletePeople', component: userDeletePeople },
    userGetPeople: { path: '/user/getPeople', component: userGetPeople },
    userRole: { path: '/user/role', component: userRole },
    userAddOrModifyRole: { path: '/user/addOrModifyRole', component: userAddOrModifyRole },
    userDeleteRole: { path: '/user/deleteRole', component: userDeleteRole },
    userGetRole: { path: '/user/getRole', component: userGetRole },
    userUserList: { path: '/user/userList', component: userUserList },
    userAddOrModifyUser: { path: '/user/addOrModifyUser', component: userAddOrModifyUser },
    userDeleteUser: { path: '/user/deleteUser', component: userDeleteUser },
    userGetUser: { path: '/user/getUser', component: userGetUser },
}