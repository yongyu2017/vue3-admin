const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, getSuffix } = require('#root/utils/index.js')
const { rootDir } = require('#root/utils/setting.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const Goods = require('#root/db/model/goods.js')
const Goods_stock = require('#root/db/model/Goods_stock.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op } = require("sequelize")

// 新增或修改商品信息
module.exports = {
    path: '/goods/goods/update',
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
                /** 文件重命名 **/
                let renameImg = '' // 文件重命名名称
                if (!img) {
                    const strUUID = uuidv4() // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
                    const temp = strUUID.replace(/-/g, '')
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

                // 开启事务
                const t = await sequelize.transaction()
                try {
                    if (id) {
                        if (!img) {
                            const sql_1 = await Goods.findOne({
                                where: {
                                    id,
                                },
                                transaction: t
                            })
                            const originalImg = sql_1.img
                            /** 判断文件是否存在，存在则删除 **/
                            const imgFilePath = rootDir + ('/upload' + originalImg).replace(/\//g, '\\')
                            const imgFsExistsCb = fs.existsSync(imgFilePath)
                            imgFsExistsCb && fs.unlinkSync(imgFilePath)
                            /** 判断文件是否存在，存在则删除 **/
                        } else {
                        }

                        let updateAttributes = {
                            name,
                            category,
                            des,
                            updateTime: currentTime,
                        }
                        if (!img) {
                            updateAttributes['img'] = renameImg
                        }
                        await Goods.update(
                            updateAttributes,
                            {
                                where: {
                                    id,
                                },
                                transaction: t
                            }
                        )
                    } else {
                        const sql_1 = await Goods.create({
                            name,
                            category,
                            img: renameImg,
                            des,
                            state: 1,
                            createTime: currentTime,
                            updateTime: currentTime,
                        }, {
                            transaction: t
                        })

                        await Goods_stock.create({
                            goodsId: sql_1.id,
                            count: 0,
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
