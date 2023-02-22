const fs = require('fs')
const { promisify } = require('util') // promisify 异步处理
const path = require('path')
const { tokenSecret, port } = require('./setting.js')
const jwt = require('jsonwebtoken')
const os = require('os')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// 获取 json 数据
const getFileData = async (fileName) => {
    const filePath = path.join(__dirname, `../json/${fileName}.json`)
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
}
// 修改 json 数据
const setFileData = async (fileName, data) => {
    const filePath = path.join(__dirname, `../json/${fileName}.json`)
    const datas = JSON.stringify(data, null, '  ')
    await writeFile(filePath, datas)
}
// 查找父节点
const findParentNode = (ids, list) => {
    let tempList = [];
    let tree = menuToTreeMenu(deepCopy(list));

    ids.forEach((value) => {
        tempList.push(...findP(value, tree, []))
    })

    return tempList.filter((value, index, array) => {
        return (array.indexOf(value) == index) && !ids.includes(value)
    })

    function findP(id, list, result) {
        for (let i = 0; i < list.length; i += 1) {
            const item = list[i]
            if (item.id === id) {
                result.push(item.id)
                if (result.length === 1) return result
                return true
            }
            if (item.children) {
                result.push(item.id)
                const find = findP(id, item.children, result)
                if (find) {
                    return result
                }
                result.pop()
            }
        }
        return false
    }
}
// 查找子节点
const findChildNode = (id, list) => {
    let tree = menuToTreeMenu(deepCopy(list));

    return getAllChildrenNodes(tree, id)

    function getAllChildrenNodes(list, id) {
        var result = [];
        for (let i in list) {
            if (list[i].id === id) {
                if (list[i].children && list[i].children.length > 0) {
                    result = getChild(list[i].children)
                }
            } else {
                if (list[i].children && list[i].children.length > 0) {
                    getAllChildrenNodes(list[i].children, id)
                }
            }
        }
        return result
    }
    function getChild(list) {
        var arr = [];
        list.forEach(v => {
            arr.push(v.id)
            if (v.children) {
                arr.push(...getChild(v.children))
                return false
            }
        })
        return arr
    }
}
// 将一维数据转为树形结构
function menuToTreeMenu(source) {
    const len = source.length
    for (let i = 0; i < len; i++) {
        let arrTemp = []
        for (let j = 0; j < len; j++) {
            if (source[i].id == source[j].parentId) {
                arrTemp.push(source[j])
                source[i].children = arrTemp
            }
        }
    }

    let result = []
    for (let i = 0; i < source.length; i++) {
        if (source[i].parentId == 0) {
            result.push(source[i])
        }
    }

    return result
}
//深拷贝
function deepCopy(params) {
    // 如果数组类型数据
    if (Array.isArray(params)) {
        let newnew = []
        for (let i = 0; i < params.length; i++) {
            newnew[i] = deepCopy(params[i]) // 递归调用克隆
        }
        return newnew // 克隆完以后，再返回出结果
    }
    // 如果是对象类型数据
    if (Object.prototype.toString.call(params) === '[object Object]') {
        let newnew = {}
        for (const key in params) {
            newnew[key] = deepCopy(params[key]) // 递归调用克隆
        }
        return newnew // 克隆完以后，再返回出结果
    }
    // 如果是普通数据类型
    return params
}
//获取最大值
function getMax (list) {
    var arr = list.map((value) => value.id).sort((a, b) => (a - b));
    return arr.length > 0 ? arr[arr.length - 1] : 0
}
// 生成token
function generateToken (data, time) {
    return jwt.sign(data, tokenSecret, {
        expiresIn: time  // 单位：秒
    })
}
// 验证token
function verifyToken (token) {
    return new Promise((resolve) => {
        jwt.verify(token, tokenSecret, function (err, decode) {
            resolve(decode)
        })
    })
}
// 获取文件列表
function getJsonFiles (jsonPath) {
    let jsonFiles = []
    function findJsonFile(www){
        let files = fs.readdirSync(www)
        files.forEach(function (item) {
            let fPath =  path.join(www, item)
            let stat = fs.statSync(fPath)
            if(stat.isDirectory() === true) {
                findJsonFile(fPath)
            }
            if (stat.isFile() === true) {
                jsonFiles.push(fPath)
            }
        })
    }
    findJsonFile(jsonPath)

    return jsonFiles
}
// 获取文件后缀数据
function getSuffix (str) {
    return str.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)
}
// 获取当前服务ip
function getIpAddress() {
    let ifaces = os.networkInterfaces()
    for (let dev in ifaces) {
        let iface = ifaces[dev]
        for (let i = 0; i < iface.length; i++) {
            let { family, address, internal } = iface[i]
            if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
                return address
            }
        }
    }
}
// 设置完整的文件地址
function setCompleteAddress (url) {
    return 'http://' + getIpAddress() + ':' + port + '' + url
}

module.exports = {
    getFileData,
    setFileData,
    findParentNode,
    findChildNode,
    menuToTreeMenu,
    deepCopy,
    getMax,
    generateToken,
    verifyToken,
    getJsonFiles,
    getSuffix,
    getIpAddress,
    setCompleteAddress,
}



