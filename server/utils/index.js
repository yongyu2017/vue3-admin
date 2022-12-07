const fs = require('fs')
// promisify 异步处理
const { promisify } = require('util')
const path = require('path')

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
    let tree = menuToTreeMenu(list);

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

// 将一维数据转为树形结构
function menuToTreeMenu (source) {
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


module.exports = {
    getFileData,
    setFileData,
    findParentNode,
    deepCopy,
}



