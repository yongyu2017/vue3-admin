const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const { tokenSurvive } = require('#root/utils/setting.js')
const User = require('#root/db/model/user.js')
const { Op } = require("sequelize")

// 登录
module.exports = {
    path: '/user/login',
    fn: async function (req, res) {
        const { name, pwd } = req['body']

        if (!(name && pwd)) {
            res.send(statusCodeMap['101'])
            return
        }

        try {
            const sql_1 = await User.findOne({
                where: {
                    state: 1,
                    account: name,
                    pwd,
                },
            })
            if (sql_1 == null) {
                res.send(statusCodeMap['101'])
                return
            }
            const { id, account, email } = sql_1
            const token = generateToken({ account, pwd, id }, tokenSurvive)

            res.send({
                code: 200,
                data: {
                    id,
                    name,
                    email,
                    token,
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
