const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Goods = require('#root/db/model/goods.js')
const Goods_stock = require('#root/db/model/Goods_stock.js')
const { Op } = require("sequelize")

// 获取商品列表
module.exports = {
    path: '/goods/goods/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name, category, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = pageSize ? (pageIndex - 1) * pageSize : 0

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            Goods.hasOne(Goods_stock, { foreignKey: 'goodsId', sourceKey: 'id' });
            const sql_1 = await Goods.findAndCountAll({
                attributes: ['id', 'name', 'category', 'img', 'des', 'createTime', 'updateTime'],
                where: {
                    state: 1,
                    name: {
                        [Op.like]: '%' + name + '%'
                    },
                    category: {
                        [Op.like]: '%' + category + '%'
                    },
                },
                order: [
                    ['id', 'DESC'],
                ],
                include: [
                    {
                        model: Goods_stock,
                        attributes: ['count'],
                    }
                ],
                offset: start,
                limit: pageSize,
            })
            const list = sql_1.rows.map((value) => {
                let item = value.toJSON()
                item.count = item.goods_stock ? item.goods_stock.count : null
                item.img = setCompleteAddress(item.img)
                delete item.goods_stock
                return item
            })

            res.send({
                code: 200,
                data: {
                    list,
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
