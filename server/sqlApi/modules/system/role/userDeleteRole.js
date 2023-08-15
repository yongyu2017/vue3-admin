const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Role = require('#root/db/model/role.js')
const User = require('#root/db/model/user.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op } = require("sequelize")

// 删除角色信息
module.exports = {
    path: '/user/deleteRole',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        // 开启事务
        const t = await sequelize.transaction()
        try {
            await Role.update(
                {
                    state: 0,
                    updateTime: currentTime,
                },
                {
                    where: {
                        id,
                    },
                    transaction: t
                }
            )

            const sql_1 = await User.findAll({
                attributes: ['id'],
                where: {
                    state: 1,
                    role: id,
                },
                transaction: t
            })

            const ids = sql_1.map((value) => value.id)
            await User.update(
                {
                    role: null,
                    updateTime: currentTime,
                },
                {
                    where: {
                        id: {
                            [Op.in]: ids,
                        },
                    },
                    transaction: t
                }
            )

            // 提交事务
            await t.commit()
            res.send({
                code: 200,
                data: '',
                msg: '',
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
    }
}
