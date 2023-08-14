const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Dict_type = require('#root/db/model/Dict_type.js')
const { Op } = require("sequelize")

// 获得字典类型的分页列表
module.exports = {
    path: '/system/dict-type/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name, type, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Dict_type.findAndCountAll({
                where: {
                    state: 1,
                    name: {
                        [Op.like]: '%' + name + '%'
                    },
                    type: {
                        [Op.like]: '%' + type + '%'
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
