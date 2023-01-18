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

        if(tokenInfo){
            const sqlResult = (await db.connect('UPDATE user SET email=? WHERE id=?', [email, tokenInfo.id]))[0]
            if (sqlResult.err || sqlResult.res.affectedRows == 0) {
                res.send(statusCodeMap['-1'])
            }

            res.send({
                code: 200,
                data: {},
                msg: '修改成功！',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}