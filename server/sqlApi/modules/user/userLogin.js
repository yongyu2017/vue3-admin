const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const { tokenSurvive } = require('#root/utils/setting.js')

// 登录
module.exports = {
    path: '/user/login',
    fn: async function (req, res) {
        const { name, pwd } = req['body']

        if (!(name && pwd)) {
            res.send(statusCodeMap['101'])
            return
        }

        const sql_1 = (await db.connect('SELECT * FROM user WHERE state=1 and account=? and pwd=?', [name, pwd]))
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        if (sql_1.res.length == 0) {
            res.send(statusCodeMap['101'])
            return
        }
        const { id, account, email } = sql_1.res[0]
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
    }
}
