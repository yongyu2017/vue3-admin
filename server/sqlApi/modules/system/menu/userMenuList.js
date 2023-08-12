const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const User = require('#root/db/model/user.js')
const Role = require('#root/db/model/role.js')
const Menu = require('#root/db/model/menu.js')
const { Op } = require("sequelize")

// 获取当前用户菜单
module.exports = {
    path: '/user/menuList',
    fn: async function (req, res) {
        const { token } = req.headers;
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const { role } = await User.findOne({
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
            const roleInfo = sql_1 || {}
            let roleIds = (roleInfo.permission ? roleInfo.permission.split(',') : []).map((value) => {
                return Number(value)
            }) // 用户所拥有的权限

            const sql_2 = await Menu.findAll({
                where: {
                    state: 1,
                },
                order: [
                    ['orderNum', 'ASC'],
                ],
            })
            let menuList = sql_2
            menuList = menuList.map((value) => {
                return value.toJSON()
            })
            const menuTree = menuToTreeMenu(menuList)
            let statusFalseChildIdsList = []
            const statusFalseList = menuList.filter((value) => {
                return value.status == 0
            })  // 菜单状态值为关闭列表
            statusFalseList.forEach((value) => {
                statusFalseChildIdsList = [value.id, ...findChildNode(value.id, menuTree)]
            })
            menuList = menuList.filter((value) => {
                value['menuId'] = value.id;
                value['name'] = value.menuName;
                value['url'] = value.jumpUrl;
                return value.type != 2 && roleIds.includes(value.id) && !statusFalseChildIdsList.includes(value.id)
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
