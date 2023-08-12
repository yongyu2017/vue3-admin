const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Category = require('#root/db/model/category.js')
const { Op } = require("sequelize")

// 获取所有商品类型
module.exports = {
    path: '/goods/category/listAll',
    fn: async function (req, res) {
        const { token } = req.headers
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Category.findAll({
                attributes: ['id', 'name'],
                where: {
                    state: 1,
                },
                order: [
                    ['id', 'DESC'],
                ],
            })

            res.send({
                code: 200,
                data: {
                    list: sql_1,
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
