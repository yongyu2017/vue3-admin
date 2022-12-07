let express = require('express');
let app = express();
let bodyParser = require('body-parser');
// 更新 json 数据
// const { getFileData, setFileData } = require('./readOrWriteFile')
const { getFileData, setFileData, findParentNode, findChildNode, getMax } = require('./utils/index.js');

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
app.post('/user/login', async (req, res) => {
    const { name, pwd } = req['body'];

    if(name && pwd){
        const userFileData = await getFileData('user');
        const roleFileData = await getFileData('role');
        const menuFileData = await getFileData('menu');
        let data = {};
        let userRole = '';
        let roleIds = [];
        userFileData.list.forEach((value) => {
            if (value.name == name && value.pwd == pwd) {
                const { name, email, id, role } = value;
                data = { name, email, id, token: id, permission: [] }
                userRole = role;
            }
        })
        roleFileData.list.forEach((value) => {
            if (value.id == userRole) {
                roleIds = value.role ? value.role.split(',') : [];
            }
        })
        menuFileData.menuList.forEach((value) => {
            if (roleIds.includes(value.id + '') && value.roleUrl) {
                data.permission.push(value.roleUrl)
            }
        })
        
        res.send({
            code: 200,
            data,
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

// 获取当前用户信息
app.post('/user/getUserInfo', async (req, res) => {
    const { token } = req.headers;
    
    if(token){
        const userFileData = await getFileData('user');
        const roleFileData = await getFileData('role');
        const menuFileData = await getFileData('menu');
        let data = {};
        let userRole = '';
        let roleIds = [];
        userFileData.list.forEach((value) => {
            if (value.id == token) {
                const { name, email, id, role } = value;
                data = { name, email, id, token: id, permission: [] }
                userRole = role;
            }
        })
        roleFileData.list.forEach((value) => {
            if (value.id == userRole) {
                roleIds = value.role ? value.role.split(',') : [];
            }
        })
        menuFileData.menuList.forEach((value) => {
            if (roleIds.includes(value.id + '') && value.roleUrl) {
                data.permission.push(value.roleUrl)
            }
        })
        res.send({
            code: 200,
            data,
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

// 修改当前用户信息
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

// 获取当前用户菜单
app.post('/user/menuList', async (req, res) => {
    const { token } = req.headers
    
    if(token){
        const userFileData = await getFileData('user');
        const roleFileData = await getFileData('role');
        const menuFileData = await getFileData('menu');
        let userRole = '';
        let roleIds = [];
        userFileData.list.forEach((value) => {
            if (value.id == token) {
                userRole = value.role;
            }
        })
        roleFileData.list.forEach((value) => {
            if (value.id == userRole) {
                roleIds = value.role ? value.role.split(',') : [];
            }
        })
        roleIds = roleIds.map((value) => {
            return Number(value)
        })
        const parentIds = findParentNode(roleIds, menuFileData.menuList)
        roleIds.push(...parentIds)
        menuFileData.menuList = menuFileData.menuList.filter((value) => {
            value['menuId'] = value.id;
            value['name'] = value.menuName;
            value['url'] = value.jumpUrl;
            return value.type != 2 && roleIds.includes(value.id) && value.status == 1
        })
        res.send({
            code: 200,
            data: menuFileData,
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

        fileData.menuList = fileData.menuList.filter((value) => {
            return value.status == 1
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
            const max = getMax(fileData.menuList);
            fileData.menuList.push({
                id: max + 1, 
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

// 删除菜单
app.post('/user/deleteNav', async (req, res) => {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('menu');

    if(token){
        const ids = [id];
        ids.push(...findChildNode(id, fileData.menuList))
        fileData.menuList.forEach((value) => {
            if(ids.includes(value.id)){
                value.status = 0;
            }
        })
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
app.post('/user/peopleList', async (req, res) => {
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
            const max = getMax(fileData.list);
            fileData.list.push({
                id: max + 1, 
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

// 获取角色列表
app.post('/user/role', async (req, res) => {
    const { token } = req.headers
    const fileData = await getFileData('role');
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

// 新增或修改角色信息
app.post('/user/addOrModifyRole', async (req, res) => {
    const { token } = req.headers
    const { id, name, des, role } = req['body'];
    const data = { id, name, des, role };
    const fileData = await getFileData('role');

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
            const max = getMax(fileData.list);
            fileData.list.push({
                id: max + 1, 
                name, 
                des,
                role,
                state: 1,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime(),
            })
        }
        await setFileData('role', fileData)
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

// 删除角色信息
app.post('/user/deleteRole', async (req, res) => {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('role');

    if(token){
        fileData.list.forEach((value) => {
            if(value.id == id){
                value.state = 0;
            }
        })
        await setFileData('role', fileData)
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

// 获取角色信息
app.post('/user/getRole', async (req, res) => {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('role');

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

// 获取用户列表
app.post('/user/userList', async (req, res) => {
    const { token } = req.headers
    const fileData = await getFileData('user');
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

// 新增或修改用户信息
app.post('/user/addOrModifyUser', async (req, res) => {
    const { token } = req.headers
    const { id, name, des, role, email, pwd } = req['body'];
    const data = { id, name, des, role, email, pwd };
    const fileData = await getFileData('user');

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
            const max = getMax(fileData.list);
            fileData.list.push({
                id: max + 1, 
                name, 
                des,
                role,
                email,
                pwd,
                state: 1,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime(),
            })
        }
        await setFileData('user', fileData)
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

// 删除用户信息
app.post('/user/deleteUser', async (req, res) => {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('user');

    if(token){
        fileData.list.forEach((value) => {
            if(value.id == id){
                value.state = 0;
            }
        })
        await setFileData('user', fileData)
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

// 获取用户信息
app.post('/user/getUser', async (req, res) => {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('user');

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