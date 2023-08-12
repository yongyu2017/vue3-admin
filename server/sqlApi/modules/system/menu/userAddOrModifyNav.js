const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Menu = require('#root/db/model/menu.js')
const { Op } = require("sequelize")

// 新增或修改菜单
module.exports = {
    path: '/user/addOrModifyNav',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum, status, visible, keepAlive } = req['body'];
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            if (id) {
                await Menu.update(
                    {
                        menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum, status, visible, keepAlive,
                        updateTime: currentTime,
                    },
                    {
                        where: {
                            id,
                        },
                    }
                )
            } else {
                await Menu.create({
                    menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum, status, visible, keepAlive,
                    state: 1,
                    createTime: currentTime,
                    updateTime: currentTime,
                })
            }

            res.send({
                code: 200,
                data: '',
                msg: '操作成功！',
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
