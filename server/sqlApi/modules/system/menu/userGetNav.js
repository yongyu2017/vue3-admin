const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Menu = require('#root/db/model/menu.js')
const { Op } = require("sequelize")

// 获取菜单详情
module.exports = {
    path: '/user/getNav',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Menu.findOne({
                where: {
                    state: 1,
                    id,
                },
            })

            res.send({
                code: 200,
                data: sql_1,
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
