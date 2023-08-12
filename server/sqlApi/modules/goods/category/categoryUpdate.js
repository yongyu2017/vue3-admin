const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Category = require('#root/db/model/category.js')
const { Op } = require("sequelize")

// 新增或修改商品类型
module.exports = {
    path: '/goods/category/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, name, des } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (id) {
            const sql_1 = await Category.findOne({
                where: {
                    id,
                },
            })
            if (sql_1.name != name) {
                const sql_2 = await checkNameExisting(res, name)
                if (!sql_2) return
            }

             await Category.update(
                {
                    name,
                    des,
                },
                {
                    where: {
                        id,
                    },
                }
            )
        } else {
            const sql_2 = await checkNameExisting(res, name)
            if (!sql_2) return

            await Category.create({
                name,
                des,
                createTime: currentTime,
                updateTime: currentTime,
            })
        }

        res.send({
            code: 200,
            data: '',
            msg: '操作成功！',
        })
    }
}

// 校验商品编码是否存在
async function checkNameExisting (res, name) {
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
