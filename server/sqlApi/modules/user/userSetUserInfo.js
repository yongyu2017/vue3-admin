const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 修改当前用户信息
module.exports = {
    path: '/user/setUserInfo',
    fn: async function (req, res) {
        const { token } = req.headers;
        const { email } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await db.connect('UPDATE user SET email=? WHERE id=?', [email, tokenInfo.id])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
        }

        res.send({
            code: 200,
            data: '',
            msg: '修改成功！',
        })
    }
}
