const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('../utils/index.js')

// 获取员工列表
async function userPeopleList (req, res) {
    const { token } = req.headers
    const fileData = await getFileData('people');
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
            code: 401,
            data: '',
            msg: '登录过期，请重新登录！'
        })
    }
}
// 新增或修改员工信息
async function userAddOrModifyPeople (req, res) {
    const { token } = req.headers
    const { id, name, sex, age } = req['body'];
    const data = { id, name, sex, age };
    const fileData = await getFileData('people');
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
}
// 删除员工信息
async function userDeletePeople (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const ids = (id + '').split(',');
    const fileData = await getFileData('people');
    const userInfo = await verifyToken(token)

    if(userInfo){
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
}
// 获取员工信息
async function userGetPeople (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('people');
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
            code: 401,
            data: '',
            msg: '登录过期，请重新登录！'
        })
    }
}

module.exports = {
    userPeopleList,
    userAddOrModifyPeople,
    userDeletePeople,
    userGetPeople,
}