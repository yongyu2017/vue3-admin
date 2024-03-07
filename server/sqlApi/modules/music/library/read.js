const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Music_library_sq = require('#root/db/model/Music_library.js')
const Music_file_sq = require('#root/db/model/Music_file.js')
const { Op } = require("sequelize")
const fs = require('fs')
const { rootDir } = require('#root/utils/setting.js')

// 获取曲库列表
module.exports = {
    method: 'get',
    path: '/music/library/read/:fileName',
    fn: async function (req, res) {
        try {
            const fileName = req.params.fileName // 文件名，破茧.mp3
            const mp3Url = rootDir + ('/upload/music/' + fileName).replace(/\//g, '\\') // 文件路径
            const stat = fs.statSync(mp3Url) // 获取文件信息
            const fileSize = stat.size
            const range = req.headers.range

            if (range) {
                const parts = range.replace(/bytes=/, '').split('-')
                const start = parseInt(parts[0], 10)
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
                const chunksize = (end - start) + 1

                //创建可读流
                let readStream = fs.createReadStream(mp3Url, {
                    start,
                    end,
                    // encoding: 'utf-8',
                    // highWaterMark: 1024 * 1024
                })
                // 设置响应头
                const head = {
                    'Content-Range': `bytes ${ start }-${ end }/${ fileSize }`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'audio/mpeg',
                }
                res.writeHead(206, head)
                // 将读取的结果以管道pipe流的方式返回给前端
                readStream.pipe(res)
            } else {
                const head = {
                    'Accept-Ranges': 'bytes',
                    'Content-Length': fileSize,
                    'Content-Type': 'audio/mpeg',
                }
                res.writeHead(200, head)
                fs.createReadStream(mp3Url).pipe(res)
            }
        } catch (err) {
            // 读取不到相应文件，就直接返回找不到即可
            res.send('暂无此音乐数据')
        }
    }
}
