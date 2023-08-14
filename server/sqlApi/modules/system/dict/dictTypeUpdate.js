const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Dict_type = require('#root/db/model/Dict_type.js')
const { Op } = require("sequelize")

// 修改字典类型
module.exports = {
    path: '/system/dict-type/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, name, type, status, remark } = req['body'];
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Dict_type.findOne(
                {
                    where: {
                        state: 1,
                        type,
                    },
                }
            )
            if (id) {
                if (sql_1 && sql_1.id != id && sql_1.type == type) {
                    res.send({
                        code: -1,
                        data: '',
                        msg: '该字典类型已存在，请勿重复添加',
                    })
                    return
                }

                await Dict_type.update(
                    {
                        name, status, remark,
                        updateTime: currentTime,
                    },
                    {
                        where: {
                            id,
                        },
                    }
                )
            } else {
                if (sql_1) {
                    res.send({
                        code: -1,
                        data: '',
                        msg: '该字典类型已存在，请勿重复添加',
                    })
                    return
                }

                await Dict_type.create({
                    name, type, status, remark,
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
