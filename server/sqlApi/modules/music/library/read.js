const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const music_library = require('#root/db/model/music_library.js')
const fileSq = require('#root/db/model/file.js')
const { Op } = require("sequelize")
const fs = require('fs')
const { rootDir } = require('#root/utils/setting.js')

// 获取曲库列表
module.exports = {
    method: 'get',
    path: '/music/library/read/:fileName',
    fn: async function (req, res) {
        // 拼接成完整的文件名，这里假设统一使用mp3格式的音乐文件
        let fileName = req.params.fileName // 破茧.mp3

        try {
            // 存储一份音乐的路径，这里我们在music文件夹里面存放音乐资源
            let mp3Url = rootDir + ('/upload/music/' + fileName).replace(/\//g, '\\')
            // fs.statSync判断目录文件是否存在，不存在就会抛出异常，所以需要try catch捕获一下
            let stat = fs.statSync(mp3Url)
            // 设置请求头
            res.writeHead(200, {  // 有的话，就把对应的资源以流的形式返回去
                'Content-Type': 'audio/mp3', // 类型为音频mp3格式
                'Content-Length': stat.size, // 指定一下文件大小
                "Accept-Ranges": "bytes" // 不加的话，前端google浏览器中音频无法拖动
            })
            //创建可读流
            let readStream = fs.createReadStream(mp3Url)
            // 将读取的结果以管道pipe流的方式返回给前端
            readStream.pipe(res);
        } catch (err) {
            // 读取不到相应文件，就直接返回找不到即可
            res.send('暂无此音乐数据')
        }
    }
}
