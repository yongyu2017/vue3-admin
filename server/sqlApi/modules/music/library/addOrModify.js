const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, getSuffix } = require('#root/utils/index.js')
const { rootDir } = require('#root/utils/setting.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const music_library = require('#root/db/model/music_library.js')
const fileSq = require('#root/db/model/file.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op } = require("sequelize")

// 曲库信息修改或新增
module.exports = {
    path: '/music/library/addOrModify',
    bodyParser: false,
    fn: async function (req, res) {
        const { token } = req.headers
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            //创建formidable表单解析对象
            const form = new formidable.IncomingForm()
            //设置上传文件的保存路径
            const uploadFilePath = '/music'
            const filePath = rootDir + ('/upload' + uploadFilePath).replace(/\//g, '\\')

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

                const { id, name, fileid, lrc, directory, des } = fields
                // 开启事务
                const t = await sequelize.transaction()
                try {
                    /** 文件重命名 **/
                    // file字段如果是文件流时，该字段是没有值的
                    let sql_3 = ''
                    let fileSaveUrl = '' // 文件存储地址
                    let sql_4 = ''
                    let fileSaveUrl2 = '' // 文件存储地址
                    if (files.fileid) {
                        const temp = uuidv4().replace(/-/g, '_')
                        const fileKey = 'fileid' // 接收文件流的字段
                        let originalFilename = files[fileKey].originalFilename // 文件原始名字
                        const fileSuffix = getSuffix(originalFilename)[0] // 文件后缀，如：.mp3
                        const fileName = originalFilename.replace(fileSuffix, '')
                        const newFileName = fileName + '' + fileSuffix
                        fileSaveUrl = uploadFilePath + '/' + newFileName
                        fs.renameSync(filePath + '\\' + files[fileKey].newFilename, filePath + '\\' + newFileName)

                        const sql_5 = await fileSq.findOne({
                            where: {
                                name: originalFilename,
                            },
                            transaction: t
                        })
                        if (sql_5) {
                            sql_3 = sql_5.id
                        } else {
                            sql_3 = await fileSq.create({
                                name: originalFilename,
                                url: fileSaveUrl,
                                des,
                                state: 1,
                                createTime: currentTime,
                                updateTime: currentTime,
                            }, {
                                transaction: t
                            })
                        }
                    }
                    if (files.lrc) {
                        const temp = uuidv4().replace(/-/g, '_')
                        const fileKey = 'lrc' // 接收文件流的字段
                        let originalFilename = files[fileKey].originalFilename // 文件原始名字
                        const fileSuffix = getSuffix(originalFilename)[0] // 文件后缀，如：.mp3
                        const fileName = originalFilename.replace(fileSuffix, '')
                        const newFileName = fileName + '' + fileSuffix
                        fileSaveUrl2 = uploadFilePath + '/' + newFileName
                        fs.renameSync(filePath + '\\' + files[fileKey].newFilename, filePath + '\\' + newFileName)

                        const sql_5 = await fileSq.findOne({
                            where: {
                                name: originalFilename,
                            },
                            transaction: t
                        })
                        if (sql_5) {
                            sql_4 = sql_5.id
                        } else {
                            sql_4 = await fileSq.create({
                                name: originalFilename,
                                url: fileSaveUrl2,
                                des,
                                state: 1,
                                createTime: currentTime,
                                updateTime: currentTime,
                            }, {
                                transaction: t
                            })
                        }
                    }
                    /** 文件重命名 **/

                    if (id) {
                        let updateAttributes = {
                            name,
                            directory,
                            fileid: files.fileid ? sql_3.id : fileid || null,
                            lrc: files.lrc ? sql_4.id : lrc || null,
                            des,
                            updateTime: currentTime,
                        }

                        await music_library.update(
                            updateAttributes,
                            {
                                where: {
                                    id,
                                },
                                transaction: t
                            }
                        )
                    } else {
                        const sql_1 = await music_library.create({
                            name,
                            directory,
                            fileid: sql_3.id,
                            lrc: sql_4.id,
                            des,
                            state: 1,
                            createTime: currentTime,
                            updateTime: currentTime,
                        }, {
                            transaction: t
                        })
                    }
                    // 提交事务
                    await t.commit()

                    res.send({
                        code: 200,
                        data: '',
                        msg: '操作成功！',
                    })
                } catch (err) {
                    console.log(err)
                    // 回滚事务
                    await t.rollback()
                    res.send({
                        code: -1,
                        data: '',
                        msg: JSON.stringify(err),
                    })
                }
            })
        } catch (err) {
            res.send({
                code: -1,
                data: '',
                msg: JSON.stringify(err),
            })
        }
    }
}
