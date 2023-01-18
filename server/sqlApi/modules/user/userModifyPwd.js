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

        if(tokenInfo){
            const userFileData = (await db.connect('SELECT * FROM user WHERE state=1 and id=?', [tokenInfo.id]))[0]
            if (userFileData.err || userFileData.res.length == 0) {
                res.send(statusCodeMap['-1'])
                return
            }
            const { pwd: userPwd } = userFileData.res[0]
            if (oldPwd == userPwd) {
                (await db.connect('UPDATE user SET pwd=? WHERE id=?', [pwd, tokenInfo.id]))[0]
            } else {
                res.send(statusCodeMap['103'])
                return
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