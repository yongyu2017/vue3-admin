const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const User = require('#root/db/model/user.js')
const Role = require('#root/db/model/role.js')
const Menu = require('#root/db/model/menu.js')
const { Op } = require("sequelize")

// 获取当前用户信息
module.exports = {
    path: '/user/getUserInfo',
    fn: async function (req, res) {
        const { token } = req.headers;
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const { id, account, email, role } = await User.findOne({
                where: {
                    state: 1,
                    id: tokenInfo.id,
                },
            })

            const sql_1 = await Role.findOne({
                where: {
                    state: 1,
                    id: role,
                },
            })
            const roleInfo = sql_1
            const roleIds = roleInfo.permission ? roleInfo.permission.split(',') : []

            const sql_2 = await Menu.findAll({
                where: {
                    state: 1,
                    type: 2,
                },
            })
            const menuList = sql_2
            const permission = []
            menuList.forEach((value) => {
                if (roleIds.includes(value.id + '') && value.roleUrl) {
                    permission.push(value.roleUrl)
                }
            })

            res.send({
                code: 200,
                data: {
                    id,
                    account,
                    email,
                    permission,
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
