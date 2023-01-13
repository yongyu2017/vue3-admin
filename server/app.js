let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
// 更新 json 数据
// const { getFileData, setFileData } = require('./readOrWriteFile')
const { getFileData, setFileData, findParentNode, findChildNode, getMax } = require('./utils/index.js');
const { userLogin, userGetUserInfo, userSetUserInfo, userModifyPwd, userMenuList, userNav, userAddOrModifyNav, userDeleteNav, userGetNav, userRole, userAddOrModifyRole, userDeleteRole, userGetRole, userUserList, userAddOrModifyUser, userDeleteUser, userGetUser, } = require('./api/user.js')
const { userPeopleList, userAddOrModifyPeople, userDeletePeople, userGetPeople } = require('./api/personnel.js')

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())  //data参数以字典格式传输

// 设置连接信息
let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port: '3306',
    database : 'test'
})
//连接数据库
connection.connect()
//操作数据库，sql语句为函数参数
connection.query('SELECT * FROM user WHERE state=1 and username LIKE \'%管理员%\'', function (error, results, fields) {
    console.log(error, results)
})

// 登录
app.post('/user/login', userLogin)
// 获取当前用户信息
app.post('/user/getUserInfo', userGetUserInfo)
// 修改当前用户信息
app.post('/user/setUserInfo', userSetUserInfo)
// 修改当前用户密码
app.post('/user/modifyPwd', userModifyPwd)
// 获取当前用户菜单
app.post('/user/menuList', userMenuList)
// 获取菜单列表
app.post('/user/nav', userNav)
// 新增或修改菜单
app.post('/user/addOrModifyNav', userAddOrModifyNav)
// 删除菜单
app.post('/user/deleteNav', userDeleteNav)
// 获取菜单详情
app.post('/user/getNav', userGetNav)
// 获取员工列表
app.post('/user/peopleList', userPeopleList)
// 新增或修改员工信息
app.post('/user/addOrModifyPeople', userAddOrModifyPeople)
// 删除员工信息
app.post('/user/deletePeople', userDeletePeople)
// 获取员工信息
app.post('/user/getPeople', userGetPeople)
// 获取角色列表
app.post('/user/role', userRole)
// 新增或修改角色信息
app.post('/user/addOrModifyRole', userAddOrModifyRole)
// 删除角色信息
app.post('/user/deleteRole', userDeleteRole)
// 获取角色详情
app.post('/user/getRole', userGetRole)
// 获取用户列表
app.post('/user/userList', userUserList)
// 新增或修改用户信息
app.post('/user/addOrModifyUser', userAddOrModifyUser)
// 删除用户信息
app.post('/user/deleteUser', userDeleteUser)
// 获取用户详情
app.post('/user/getUser', userGetUser)

//配置服务端口
app.listen(8000, () => {
    console.log('node接口服务正常运行')
})