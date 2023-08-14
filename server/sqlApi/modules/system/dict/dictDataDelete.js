const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Dict_data = require('#root/db/model/Dict_data.js')
const { Op } = require("sequelize")

// 删除字典数据
module.exports = {
    path: '/system/dict-data/delete',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            await Dict_data.update(
                {
                    state: 0,
                    updateTime: currentTime,
                },
                {
                    where: {
                        id,
                    },
                }
            )

            res.send({
                code: 200,
                data: '',
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
