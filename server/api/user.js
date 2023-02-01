const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('../utils/index.js')
const statusCodeMap = require('../utils/statusCodeMap.js')

// 登录
async function userLogin (req, res) {
    const { name, pwd } = req['body'];

    if(name && pwd){
        const userFileData = await getFileData('user');
        const roleFileData = await getFileData('role');
        const menuFileData = await getFileData('menu');
        let data = {};
        let userRole = '';
        let roleIds = [];
        let isLogin = false;
        let token = ''
        userFileData.list.forEach((value) => {
            if (value.name == name && value.pwd == pwd) {
                const { name, email, id, role } = value;
                token = generateToken({ name, pwd, id }, 60 * 60 * 1)
                data = { name, email, id, token, permission: [] }
                userRole = role;
                isLogin = true;
            }
        })
        if (!isLogin) {
            res.send({
                code: -1,
                data: {},
                msg: '密码或者账号错误！',
            })
            return
        }
        roleFileData.list.forEach((value) => {
            if (value.id == userRole) {
                roleIds = value.permission ? value.permission.split(',') : [];
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
}
// 获取当前用户信息
async function userGetUserInfo (req, res) {
    const { token } = req.headers;
    const userInfo = await verifyToken(token)

    if(userInfo){
        const userFileData = await getFileData('user');
        const roleFileData = await getFileData('role');
        const menuFileData = await getFileData('menu');
        let data = {};
        let userRole = '';
        let roleIds = [];
        userFileData.list.forEach((value) => {
            if (value.id == userInfo.id) {
                const { name, email, id, role } = value;
                data = { name, email, id, permission: [] }
                userRole = role;
            }
        })
        roleFileData.list.forEach((value) => {
            if (value.id == userRole) {
                roleIds = value.permission ? value.permission.split(',') : [];
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 修改当前用户信息
async function userSetUserInfo (req, res) {
    const { token } = req.headers;
    const { email } = req['body'];
    const userInfo = await verifyToken(token)
    const data = { email };

    if(userInfo){
        const fileData = await getFileData('user');
        fileData.list.forEach((value) => {
            if (value.id == userInfo.id) {
                for (let i in data) {
                    value[i] = data[i];
                }
            }
        })
        await setFileData('user', fileData)
        res.send({
            code: 200,
            data: '',
            msg: '',
        })
    }else{
        res.send({
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 修改当前用户密码
async function userModifyPwd (req, res) {
    const { token } = req.headers;
    const userInfo = await verifyToken(token)
    const { oldPwd, pwd } = req['body'];

    if(userInfo){
        const fileData = await getFileData('user');
        let valid = false;
        fileData.list.forEach((value) => {
            if (value.id == userInfo.id) {
                if (value.pwd == oldPwd) {
                    value.pwd = pwd;
                    valid = true;
                } else {
                    valid = false;
                }
            }
        })
        await setFileData('user', fileData)
        res.send({
            code: valid ? 200 : 400,
            data: '',
            msg: valid ? '' : '旧密码错误！',
        })
    }else{
        res.send({
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 获取当前用户菜单
async function userMenuList (req, res) {
    const { token } = req.headers
    const userInfo = await verifyToken(token)

    if(userInfo){
        const userFileData = await getFileData('user');
        const roleFileData = await getFileData('role');
        const menuFileData = await getFileData('menu');
        let userRole = '';
        let roleIds = [];
        userFileData.list.forEach((value) => {
            if (value.id == userInfo.id) {
                userRole = value.role;
            }
        })
        roleFileData.list.forEach((value) => {
            if (value.id == userRole) {
                roleIds = value.permission ? value.permission.split(',') : [];
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 获取菜单列表
async function userNav (req, res) {
    const { token } = req.headers
    const userInfo = await verifyToken(token)

    if(userInfo){
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 新增或修改菜单
async function userAddOrModifyNav (req, res) {
    const { token } = req.headers
    const { id, menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum } = req['body'];
    const data = { id, menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum };
    const fileData = await getFileData('menu');
    const userInfo = await verifyToken(token)

    if(userInfo){
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 删除菜单
async function userDeleteNav (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('menu');
    const userInfo = await verifyToken(token)

    if(userInfo){
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 获取菜单详情
async function userGetNav (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('menu');
    const userInfo = await verifyToken(token)

    if(userInfo){
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 获取角色列表
async function userRole (req, res) {
    const { token } = req.headers
    const fileData = await getFileData('role');
    const { pageIndex, pageSize, name } = req['body'];
    const userInfo = await verifyToken(token)

    if(userInfo){
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 新增或修改角色信息
async function userAddOrModifyRole (req, res) {
    const { token } = req.headers
    const { id, name, des, permission } = req['body'];
    const data = { id, name, des, permission };
    const fileData = await getFileData('role');
    const userInfo = await verifyToken(token)

    if(userInfo){
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
                permission,
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 删除角色信息
async function userDeleteRole (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('role');
    const userInfo = await verifyToken(token)

    if(userInfo){
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 获取角色详情
async function userGetRole (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('role');
    const userInfo = await verifyToken(token)

    if(userInfo){
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 获取用户列表
async function userUserList (req, res) {
    const { token } = req.headers
    const fileData = await getFileData('user');
    const { pageIndex, pageSize, name } = req['body'];
    const userInfo = await verifyToken(token)

    if(userInfo){
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 新增或修改用户信息
async function userAddOrModifyUser (req, res) {
    const { token } = req.headers
    const { id, account, des, role, email, pwd, username } = req['body'];
    const data = { id, account, des, role, email, pwd, username };
    const fileData = await getFileData('user');
    const userInfo = await verifyToken(token)

    if(userInfo){
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
                account,
                des,
                role,
                email,
                pwd,
                username,
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 删除用户信息
async function userDeleteUser (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('user');
    const userInfo = await verifyToken(token)

    if(userInfo){
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
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 获取用户详情
async function userGetUser (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('user');
    const userInfo = await verifyToken(token)

    if(userInfo){
        let data = {};
        fileData.list.forEach((value) => {
            if(value.id == id){
                data = value;
            }
        })
        console.log(data)
        res.send({
            code: 200,
            data,
            msg: '',
        })
    }else{
        res.send({
            data: '',
            ...statusCodeMap['401']
        })
    }
}

module.exports = {
    userLogin,
    userGetUserInfo,
    userSetUserInfo,
    userModifyPwd,
    userMenuList,
    userNav,
    userAddOrModifyNav,
    userDeleteNav,
    userGetNav,
    userRole,
    userAddOrModifyRole,
    userDeleteRole,
    userGetRole,
    userUserList,
    userAddOrModifyUser,
    userDeleteUser,
    userGetUser,
}