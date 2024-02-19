const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Music_label_sq = require('#root/db/model/Music_label.js')
const { Op } = require("sequelize")

// 获取音乐标签列表
module.exports = {
    path: '/music/label/list',
    fn: async function (req, res) {
        const { token } = req.headers;
        const { name, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Music_label_sq.findAndCountAll({
                where: {
                    state: 1,
                    name: {
                        [Op.like]: '%' + name + '%'
                    },
                },
                order: [
                    ['createTime', 'DESC'],
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
            console.log(err)
            res.send({
                code: -1,
                data: '',
                msg: JSON.stringify(err),
            })
        }
    }
}
