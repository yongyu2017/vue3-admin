const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const User = require('#root/db/model/user.js')
const { Op } = require("sequelize")
const moment = require('moment')

// 修改当前用户信息
module.exports = {
    path: '/user/setUserInfo',
    fn: async function (req, res) {
        const { token } = req.headers;
        const { email } = req['body'];
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            await User.update(
                {
                    email,
                    updateTime: currentTime,
                },
                {
                    where: {
                        id: tokenInfo.id,
                    },
                }
            )

            res.send({
                code: 200,
                data: '',
                msg: '修改成功！',
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
