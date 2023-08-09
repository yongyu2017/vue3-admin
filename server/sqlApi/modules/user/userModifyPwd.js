const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 修改当前用户密码
module.exports = {
    path: '/user/modifyPwd',
    fn: async function (req, res) {
        const { token } = req.headers;
        const { oldPwd, pwd } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await db.connect('SELECT * FROM user WHERE state=1 and id=?', [tokenInfo.id])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        const { pwd: userPwd } = sql_1.res[0]
        if (oldPwd == userPwd) {
            const sql_2 = (await db.connect('UPDATE user SET pwd=? WHERE id=?', [pwd, tokenInfo.id]))
            if (sql_2.err) {
                res.send(statusCodeMap['-1'])
                return
            }

            res.send({
                code: 200,
                data: {},
                msg: '修改成功！',
            })
        } else {
            res.send(statusCodeMap['103'])
        }
    }
}
