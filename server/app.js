let express = require('express');
let app = express();
let bodyParser = require('body-parser');
// 更新 json 数据
const { getFileData, setFileData } = require('./readOrWriteFile')

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

// 登录
app.post('/user/login', (req, res) => {
    const { name, pwd } = req['body'];

    if((name && pwd) && (name == 'admin' && pwd == '123456')){
        res.send({
            code: 200,
            data: {
                'userName': '小猪',
                'sex': '男',
                'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9'
            },
            msg: '',
        })
    }else{
        res.send({
            code: -1,
            data: {},
            msg: '密码或者账号错误！',
        })
    }
})

// 获取用户信息
app.post('/user/getUserInfo', async (req, res) => {
    const { token } = req.headers;
    const fileData = await getFileData('user');
    
    if(token){
        res.send({
            code: 200,
            data: fileData,
            msg: '',
        })
    }else{
        res.send({
            code: -1,
            data: '',
            msg: '未登录'
        })
    }
})

// 修改用户信息
app.post('/user/setUserInfo', async (req, res) => {
    const { token } = req.headers;
    const { userName, sex } = req['body'];

    if(token){
        await setFileData('user', {
            userName,
            sex,
            token
        })
        res.send({
            code: 200,
            data: '',
            msg: '',
        })
    }else{
        res.send({
            code: -1,
            data: '',
            msg: '未登录'
        })
    }
})

// 菜单
app.post('/user/menuList', async (req, res) => {
    const { token } = req.headers
    
    if(token){
        const fileData = await getFileData('menu');
        fileData.menuList = fileData.menuList.filter((value) => {
            value['menuId'] = value.id;
            value['name'] = value.menuName;
            value['url'] = value.jumpUrl;
            return value.type === 0 || value.type === 1
        })
        res.send({
            code: 200,
            data: fileData,
            msg: '',
        })
    }else{
        res.send({
            code: -1,
            data: '',
            msg: '未登录'
        })
    }
})

// 菜单列表
app.post('/user/nav', async (req, res) => {
    const { token } = req.headers
    
    if(token){
        const fileData = await getFileData('menu');

        res.send({
            code: 200,
            data: fileData,
            msg: '',
        })
    }else{
        res.send({
            code: -1,
            data: '',
            msg: '未登录'
        })
    }
})

// 新增或修改菜单
app.post('/user/addOrModifyNav', async (req, res) => {
    const { token } = req.headers
    const { id, menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum } = req['body'];
    const data = { id, menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum };
    const fileData = await getFileData('menu');

    if(token){
        if (data.id) {
            fileData.menuList.forEach((value) => {
                if (value.id == data.id) {
                    for (let i in data) {
                        value[i] = data[i]
                    }
                    value['modifiedTime'] = new Date().getTime();
                }
            })
        } else {
            fileData.menuList.push({
                id: fileData.menuList.length + 1, 
                menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum,
                status: 1,
                createTime: new Date().getTime(),
                modifiedTime: new Date().getTime(),
            })
        }
        await setFileData('menu', fileData)
        res.send({
            code: 200,
            data: {
            },
            msg: '',
        })
    }else{
        res.send({
            code: 401,
            data: '',
            msg: '登录过期，请重新登录！'
        })
    }
})

// 获取菜单信息
app.post('/user/getNav', async (req, res) => {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('menu');

    if(token){
        let data = {};
        fileData.menuList.forEach((value) => {
            if(value.id == id){
                data = value;
            }
        })
        res.send({
            code: 200,
            data,
            msg: '',
        })
    }else{
        res.send({
            code: 401,
            data: '',
            msg: '登录过期，请重新登录！'
        })
    }
})

// 获取员工列表
app.post('/user/userList', async (req, res) => {
    const { token } = req.headers
    const fileData = await getFileData('people');
    const { pageIndex, pageSize, name } = req['body'];

    if(token){
        let list= fileData.list,
            start= (pageIndex- 1) * pageSize,
            end= start+ pageSize;

        list = list.filter((value)=> {
            if(value.state == 1){
                if(name == ''){
                    return true
                }else{
                    if(value.name.indexOf(name.toLocaleLowerCase()) != -1){
                        return true
                    }
                }
            }
        }).sort((a, b) => {
            return b.id - a.id
        })
        res.send({
            code: 200,
            data: {
                list: list.slice(start, end),
                sum: list.length,
            },
            msg: '',
        })
    }else{
        res.send({
            code: 401,
            data: '',
            msg: '登录过期，请重新登录！'
        })
    }
})

// 新增或修改员工信息
app.post('/user/addOrModifyPeople', async (req, res) => {
    const { token } = req.headers
    const { id, name, sex, age } = req['body'];
    const data = { id, name, sex, age };
    const fileData = await getFileData('people');

    if(token){
        if (data.id) {
            fileData.list.forEach((value) => {
                if (value.id == data.id) {
                    for (let i in data) {
                        value[i] = data[i]
                    }
                    value['updateTime'] = new Date().getTime();
                }
            })
        } else {
            fileData.list.push({
                id: fileData.list.length + 1, 
                name, 
                sex, 
                age,
                state: 1,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime(),
            })
        }
        await setFileData('people', fileData)
        res.send({
            code: 200,
            data: {
            },
            msg: '',
        })
    }else{
        res.send({
            code: 401,
            data: '',
            msg: '登录过期，请重新登录！'
        })
    }
})

// 删除员工信息
app.post('/user/deletePeople', async (req, res) => {
    const { token } = req.headers
    const { id } = req['body'];
    const ids = (id + '').split(',');
    const fileData = await getFileData('people');

    if(token){
        fileData.list.forEach((value) => {
            if(ids.includes(value.id + '')){
                value.state = 0;
            }
        })
        await setFileData('people', fileData)
        res.send({
            code: 200,
            data: {
            },
            msg: '',
        })
    }else{
        res.send({
            code: 401,
            data: '',
            msg: '登录过期，请重新登录！'
        })
    }
})

// 获取员工信息
app.post('/user/getPeople', async (req, res) => {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('people');

    if(token){
        let data = {};
        fileData.list.forEach((value) => {
            if(value.id == id){
                data = value;
            }
        })
        res.send({
            code: 200,
            data,
            msg: '',
        })
    }else{
        res.send({
            code: 401,
            data: '',
            msg: '登录过期，请重新登录！'
        })
    }
})

//配置服务端口
app.listen(8000, () => {
    console.log('node接口服务正常运行')
})