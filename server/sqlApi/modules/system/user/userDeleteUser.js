const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const User = require('#root/db/model/user.js')
const { Op } = require("sequelize")

// 删除用户信息
module.exports = {
    path: '/user/deleteUser',
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
            await User.update(
                {
                    state: 0,
                    updateTime: currentTime,
                },
                {
                    where: {
                        id,
                    },
                },
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
