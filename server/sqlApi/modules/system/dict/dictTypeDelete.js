const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Dict_type = require('#root/db/model/Dict_type.js')
const Dict_data = require('#root/db/model/Dict_data.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op } = require("sequelize")

// 删除字典类型
module.exports = {
    path: '/system/dict-type/delete',
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
            const sql_1 = await Dict_data.findAll({
                attributes: ['id'],
                where: {
                    state: 1,
                    dictType: id,
                },
                transaction: t
            })
            if (sql_1.length > 0) {
                res.send({
                    code: -1,
                    data: '',
                    msg: '该数据下有其他选项，无法删除',
                })
                return
            }

            await Dict_type.update(
                {
                    state: 0,
                    updateTime: currentTime,
                },
                {
                    where: {
                        id,
                    },
                    transaction: t
                },
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
