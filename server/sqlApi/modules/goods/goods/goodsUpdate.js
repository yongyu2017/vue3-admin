const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, getSuffix } = require('#root/utils/index.js')
const { rootDir } = require('#root/utils/setting.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

// 新增或修改商品信息
module.exports = {
    path: '/goods/goods/update',
    bodyParser: false,
    fn: async function (req, res) {
        const { token } = req.headers
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        //创建formidable表单解析对象
        const form = new formidable.IncomingForm()
        //设置上传文件的保存路径
        const storeFileName = '/goods'
        const filePath = rootDir + ('/upload' + storeFileName).replace(/\//g, '\\')

        form.uploadDir = filePath
        //保留上传文件的后缀名字
        form.keepExtensions = true
        /** 判断文件夹是否存在，不存在则创建文件夹 **/
        const fsExistsCb = fs.existsSync(filePath)
        !fsExistsCb && fs.mkdirSync(filePath, { recursive: true })
        /** 判断文件夹是否存在，不存在则创建文件夹 **/
        //解析客户端传递过来的formData对象
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.send(statusCodeMap['-1'])
                return
            }

            const { id, name, img, category, des } = fields
            let renameImg = ''
            /** 文件重命名 **/
            if (!img) {
                const temp = currentTime.replace(/-| |:/g, '')
                const fileKey = 'img'
                const originalFilename = files[fileKey].originalFilename
                const suffix = getSuffix(originalFilename)[0]
                const lastIndex = originalFilename.lastIndexOf(suffix)
                const fileName = originalFilename.substring(0, lastIndex)
                const newFileName = fileName + '_' + temp + '' + suffix
                renameImg = storeFileName + '/' + newFileName
                fs.renameSync(filePath + '\\' + files[fileKey].newFilename, filePath + '\\' + newFileName)
            }
            /** 文件重命名 **/

            console.log('img', img)
            let sql_1 = ''
            if (id) {
                if (img) {
                    sql_1 = await db.connect('UPDATE goods SET name=?,category=?,des=?,updateTime=? WHERE id=?', [name, category, des, currentTime, id])
                } else {
                    sql_1 = await db.connect('UPDATE goods SET name=?,category=?,img=?,des=?,updateTime=? WHERE id=?', [name, category, renameImg, des, currentTime, id])
                }
            } else {
                const sql_1 = await db.connect('insert into goods (name, category, img, des, state, createTime, updateTime) values (?,?,?,?,?,?,?)', [name, category, renameImg, des, 1, currentTime, currentTime])
            }

            if (sql_1.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            res.send({
                code: 200,
                data: '',
                msg: '操作成功！',
            })
        })
    }
}
