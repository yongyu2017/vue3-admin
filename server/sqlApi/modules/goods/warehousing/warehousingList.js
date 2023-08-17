const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Goods_detail = require('#root/db/model/Goods_detail.js')
const { Op } = require("sequelize")

// 查询商品入库列表
module.exports = {
    path: '/goods/warehousing/list',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Goods_detail.findAll({
                attributes: ['id', 'code', 'name', 'parentId', 'price'],
                where: {
                    state: 1,
                    [Op.or]: [
                        {
                            code: {
                                [Op.like]: '%' + name + '%',
                            }
                        },
                        {
                            name: {
                                [Op.like]: '%' + name + '%',
                            }
                        }
                    ],
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
