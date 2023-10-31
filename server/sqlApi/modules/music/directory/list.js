const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const music_directory = require('#root/db/model/music_directory.js')
const { Op } = require("sequelize")

// 获取音乐目录列表
module.exports = {
    path: '/music/directory/list',
    fn: async function (req, res) {
        const { token } = req.headers;
        const tokenInfo = await verifyToken(token)

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

            res.send({
                code: 200,
                data: {
                    menuList,
                },
                msg: '',
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
