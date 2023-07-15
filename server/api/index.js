const { userLogin, userGetUserInfo, userSetUserInfo, userModifyPwd, userMenuList, userNav, userAddOrModifyNav, userDeleteNav, userGetNav, userRole, userAddOrModifyRole, userDeleteRole, userGetRole, userUserList, userAddOrModifyUser, userDeleteUser, userGetUser, } = require('./user.js')
const { userPeopleList, userAddOrModifyPeople, userDeletePeople, userGetPeople } = require('./personnel.js')
const { templateGenerate } = require('./generate.js')
const { ffmpegTranscoding } = require('./ffmpeg.js')
const { dictTypePage, dictTypeGet, dictTypeDelete, dictTypeUpdate, dictDataPage, dictDataGet, dictDataDelete, dictDataUpdate, dictDataListAll } = require('./dict.js')

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
    ffmpegTranscoding: { path: '/ffmpeg/transcoding', fn: ffmpegTranscoding },
    dictTypePage: { path: '/system/dict-type/page', fn: dictTypePage },
    dictTypeGet: { path: '/system/dict-type/get', fn: dictTypeGet },
    dictTypeDelete: { path: '/system/dict-type/delete', fn: dictTypeDelete },
    dictTypeUpdate: { path: '/system/dict-type/update', fn: dictTypeUpdate },
    dictDataPage: { path: '/system/dict-data/page', fn: dictDataPage },
    dictDataGet: { path: '/system/dict-data/get', fn: dictDataGet },
    dictDataDelete: { path: '/system/dict-data/delete', fn: dictDataDelete },
    dictDataUpdate: { path: '/system/dict-data/update', fn: dictDataUpdate },
    dictDataListAll: { path: '/system/dict-data/listAll', fn: dictDataListAll },
}