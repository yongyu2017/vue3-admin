const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('../utils/index.js')
const statusCodeMap = require('../utils/statusCodeMap.js')
const moment = require('moment')
let fileLock = Promise.resolve() // 文件操作互斥锁
const FILE_PATH = '/json/sms.json'

/**
 * 1. await fileLock      → 等待上一个操作释放锁（排队）
 2. fileLock = new Promise(...) → 创建新的锁，堵塞后续请求
 3. await fn()          → 执行业务逻辑（读+改+写）
 4. releaseLock()       → 释放锁，让下一个请求执行
 **/
async function withFileLock(fn) {
    // 1. 等待上一个操作完成（获取锁）
    await fileLock
    let releaseLock
    // 2. 创建本次锁，后续请求必须等待本次释放
    fileLock = new Promise(resolve => releaseLock = resolve)
    try {
        return await fn()
    } finally {
        // 3. 无论成功失败都释放锁
        releaseLock()
    }
}

// 创建sms数据
async function createSms (req, res) {
    const { dataJson } = req['body']

    await withFileLock(async () => {
        // 整个【读→改→写】在锁保护下原子执行
        const smsJson = await getFileData(FILE_PATH).catch(() => [])
        smsJson.push({
            dataJson,
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        await setFileData(FILE_PATH, smsJson)
    })

    res.send({
        code: 200,
        data: {},
        msg: '',
    })
}

module.exports = {
    createSms,
}
