const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Menu = require('#root/db/model/menu.js')
const { Op } = require("sequelize")

// 获取菜单列表
module.exports = {
    path: '/user/nav',
    fn: async function (req, res) {
        const { token } = req.headers
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Menu.findAll({
                where: {
                    state: 1,
                },
                order: [
                    ['orderNum', 'ASC'],
                ],
            })

            res.send({
                code: 200,
                data: {
                    menuList: sql_1
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
