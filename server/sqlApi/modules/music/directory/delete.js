const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const music_directory = require('#root/db/model/music_directory.js')
const music_library = require('#root/db/model/music_library.js')
const { Op } = require("sequelize")

// 获取音乐目录删除
module.exports = {
    path: '/music/directory/delete',
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
            const sql_1 = await music_directory.findAll({
                where: {
                    state: 1,
                },
                order: [
                    ['sort', 'ASC'],
                ],
            })
            let menuList = sql_1
            menuList = menuList.map((value) => {
                return value.toJSON()
            })
            const menuTree = menuToTreeMenu(menuList)
            const childList = findChildNode(id, menuTree)
            if (childList.length > 0) {
                res.send({
                    code: -1,
                    data: '',
                    msg: '该数据下有其他选项，无法删除',
                })
                return
            }

            const sql_2 = await music_library.findAll({
                where: {
                    directory: {
                        [Op.like]: '%' + (id || '') + '%'
                    },
                },
            })
            if (sql_2.length > 0) {
                res.send({
                    code: -1,
                    data: '',
                    msg: '该数据下已有曲库，无法删除',
                })
                return
            }

            await music_directory.update(
                {
                    state:0,
                    updateTime: currentTime,
                },
                {
                    where: {
                        id,
                    },
                }
            )

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
