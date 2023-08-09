const path = require('path')

const tokenSecret= 'yu123456'  // token密钥
const port = 8000  // 端口号
const tokenSurvive = 60 * 60 * 1 // token存活时间，单位：秒
const rootDir = path.join(__dirname, '..') // 根目录

module.exports = {
    tokenSecret,
    port,
    tokenSurvive,
    rootDir,
}
