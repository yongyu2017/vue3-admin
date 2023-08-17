const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Order = require('#root/db/model/Order.js')
const { Op } = require("sequelize")

// 新增或修改商品类型
module.exports = {
    path: '/order/order/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, name, des } = req['body'];
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            if (id) {
                const sql_1 = await Category.findOne({
                    where: {
                        id,
                    },
                })
                if (sql_1.name != name) {
                    const sql_2 = await checkKeyNameExisting(res, name)
                    if (!sql_2) return
                }

                await Category.update(
                    {
                        name,
                        des,
                        updateTime: currentTime,
                    },
                    {
                        where: {
                            id,
                        },
                    }
                )
            } else {
                const sql_2 = await checkKeyNameExisting(res, name)
                if (!sql_2) return

                await Category.create({
                    name,
                    des,
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

// 校验商品编码是否存在
async function checkKeyNameExisting (res, name) {
    const sql_1 = await Category.findAndCountAll({
        where: {
            name,
        },
    })
    if (sql_1.count > 0) {
        res.send({
            code: -1,
            data: '',
            msg: '该分类名称已存在',
        })
        return false
    }

    return true
}
