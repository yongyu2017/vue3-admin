const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Music_library_sq = require('#root/db/model/Music_library.js')
const Music_file_sq = require('#root/db/model/Music_file.js')
const { Op } = require("sequelize")
const { rootDir } = require('#root/utils/setting.js')
const fs = require('fs')

// 曲库删除
module.exports = {
    path: '/music/library/delete',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const ids = id.split(',')
            const sql_1 = await Music_library_sq.findAll({
                attributes: ['id', 'name', 'fileid', 'lrc'],
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            })
            if (sql_1) {
                let fileList = []
                sql_1.forEach((value) => {
                    value.fileid && fileList.push(value.fileid)
                    value.lrc && fileList.push(value.lrc)
                })
                const sql_2 = await Music_file_sq.findAll({
                    attributes: ['id', 'url'],
                    where: {
                        id: {
                            [Op.in]: fileList,
                        },
                    },
                })
                /** 判断文件是否存在，存在则删除 **/
                sql_2.forEach((value) => {
                    const imgFilePath = rootDir + ('/upload' + value.url).replace(/\//g, '\\')
                    const imgFsExistsCb = fs.existsSync(imgFilePath)
                    imgFsExistsCb && fs.unlinkSync(imgFilePath)
                })
                /** 判断文件是否存在，存在则删除 **/
                await Music_file_sq.destroy({
                    where: {
                        id: {
                            [Op.in]: fileList,
                        },
                    }
                })
            }
            await Music_library_sq.destroy({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                }
            })
            await Music_library_sq.destroy({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                }
            })

            res.send({
                code: 200,
                data: '',
                msg: '',
            })
        } catch (err) {
            console.log(err)
            res.send({
                code: -1,
                data: '',
                msg: JSON.stringify(err),
            })
        }
    }
}
