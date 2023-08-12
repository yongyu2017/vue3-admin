const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Category = require('#root/db/model/category.js')
const { Op } = require("sequelize")

// 获取商品类型列表
module.exports = {
    path: '/goods/category/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = pageSize ? (pageIndex - 1) * pageSize : 0

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await Category.findAndCountAll({
            where: {
                state: 1,
                name: {
                    [Op.like]: '%' + name + '%'
                },
            },
            order: [
                ['id', 'DESC'],
            ],
            offset: start,
            limit: pageSize,
        })

        res.send({
            code: 200,
            data: {
                list: sql_1.rows,
                sum: sql_1.count,
            },
            msg: '',
        })
    }
}
