const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const User = require('#root/db/model/user.js')
const { Op } = require("sequelize")
const moment = require('moment')

// 修改当前用户密码
module.exports = {
    path: '/user/modifyPwd',
    fn: async function (req, res) {
        const { token } = req.headers;
        const { oldPwd, pwd } = req['body']
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const { pwd: userPwd } = await User.findOne({
                where: {
                    id: tokenInfo.id,
                },
            })

            if (oldPwd == userPwd) {
                await User.update(
                    {
                        pwd,
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
                    data: {},
                    msg: '修改成功！',
                })
            } else {
                res.send(statusCodeMap['103'])
            }
        } catch (err) {
            res.send({
                code: -1,
                data: '',
                msg: JSON.stringify(err),
            })
        }
    }
}
