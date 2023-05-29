const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('../utils/index.js')
const statusCodeMap = require('../utils/statusCodeMap.js')

// 获得字典类型的分页列表
async function dictTypePage (req, res) {
    const { token } = req.headers
    const fileData = await getFileData('/json/dictType.json');
    const { pageIndex, pageSize, name, type } = req['body'];
    const userInfo = await verifyToken(token)

    if(userInfo){
        let list= fileData.list,
            start= (pageIndex- 1) * pageSize,
            end= start+ pageSize;

        list = list.filter((value)=> {
            if(value.state == 1){
                if(name == '' && type == ''){
                    return true
                }else{
                    if(value.name.indexOf(name.toLocaleLowerCase()) != -1 || value.type.indexOf(type.toLocaleLowerCase()) != -1){
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
// 查询字典类型详细
async function dictTypeGet (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('/json/dictType.json');
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
// 删除字典类型
async function dictTypeDelete (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const ids = (id + '').split(',');
    const fileData = await getFileData('/json/dictType.json');
    const userInfo = await verifyToken(token)

    if(userInfo){
        fileData.list.forEach((value) => {
            if(ids.includes(value.id + '')){
                value.state = 0;
            }
        })
        await setFileData('/json/dictType.json', fileData)
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
// 新增或修改字典类型
async function dictTypeUpdate (req, res) {
    const { token } = req.headers
    const { id, name, type, status, remark } = req['body'];
    const data = { id, name, type, status, remark };
    const fileData = await getFileData('/json/dictType.json');
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
                name, type, status, remark,
                state: 1,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime(),
            })
        }
        await setFileData('/json/dictType.json', fileData)
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
// 获得字典数据的分页列表
async function dictDataPage (req, res) {
    const { token } = req.headers
    const fileData = await getFileData('/json/dictData.json');
    const { pageIndex, pageSize, label, dictType } = req['body'];
    const userInfo = await verifyToken(token)

    if(userInfo){
        let list= fileData.list,
            start= (pageIndex- 1) * pageSize,
            end= start+ pageSize;

        list = list.filter((value)=> {
            if(value.state == 1){
                if(label == '' && dictType == ''){
                    return true
                }else{
                    if(value.label.indexOf(label.toLocaleLowerCase()) != -1 || value.dictType.indexOf(dictType.toLocaleLowerCase()) != -1){
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
// 查询字典数据详细
async function dictDataGet (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const fileData = await getFileData('/json/dictData.json');
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
// 删除字典数据
async function dictDataDelete (req, res) {
    const { token } = req.headers
    const { id } = req['body'];
    const ids = (id + '').split(',');
    const fileData = await getFileData('/json/dictData.json');
    const userInfo = await verifyToken(token)

    if(userInfo){
        fileData.list.forEach((value) => {
            if(ids.includes(value.id + '')){
                value.state = 0;
            }
        })
        await setFileData('/json/dictData.json', fileData)
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
// 新增或修改字典数据
async function dictDataUpdate (req, res) {
    const { token } = req.headers
    const { id, dictType, label, value, sort, status, remark } = req['body'];
    const data = { id, dictType, label, value, sort, status, remark };
    const fileData = await getFileData('/json/dictData.json');
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
                dictType, label, value, sort, status, remark,
                state: 1,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime(),
            })
        }
        await setFileData('/json/dictData.json', fileData)
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

module.exports = {
    dictTypePage,
    dictTypeGet,
    dictTypeDelete,
    dictTypeUpdate,
    dictDataPage,
    dictDataGet,
    dictDataDelete,
    dictDataUpdate,
}