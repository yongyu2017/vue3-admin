const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Goods_detail = require('#root/db/model/Goods_detail.js')
const { Op } = require("sequelize")

// 获取商品入库列表
module.exports = {
    path: '/goods/warehousing/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { code, name, parentId, sale, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = pageSize ? (pageIndex - 1) * pageSize : 0

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Goods_detail.findAndCountAll({
                attributes: ['id', 'code', 'name', 'parentId', 'sale', 'costPrice', 'price', 'salePrice', 'saleTime', 'createTime', 'updateTime'],
                where: {
                    state: 1,
                    code: {
                        [Op.like]: '%' + code + '%',
                    },
                    name: {
                        [Op.like]: '%' + name + '%',
                    },
                    parentId: {
                        [Op.like]: '%' + parentId + '%',
                    },
                    sale: {
                        [Op.like]: '%' + sale + '%',
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
        } catch (err) {
            res.send({
                code: -1,
                data: '',
                msg: JSON.stringify(err),
            })
        }
    }
}
