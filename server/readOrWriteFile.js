const fs = require('fs')
// promisify 异步处理
const { promisify } = require('util')
const path = require('path')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// 获取 json 数据
const getFileData = async (fileName) => {
    const filePath = path.join(__dirname, `/json/${fileName}.json`)
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data)
}

// 修改 json 数据
const setFileData = async (fileName, data) => {
    const filePath = path.join(__dirname, `/json/${fileName}.json`)
    const datas = JSON.stringify(data, null, '  ')
    await writeFile(filePath, datas)
}

module.exports = {
    getFileData,
    setFileData,
}
