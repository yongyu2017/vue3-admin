const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 删除角色信息
module.exports = {
    path: '/user/deleteRole',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            try {
                const menuFileData = (await db.connect('UPDATE role SET state=? WHERE id=?', [0, id]))[0]
                if (menuFileData.err) {
                    res.send(statusCodeMap['-1'])
                    return
                }
                const userData = (await db.connect('SELECT id FROM user WHERE role=?', [id]))[0]
                if (userData.err) {
                    res.send(statusCodeMap['-1'])
                    return
                }

                const ids = userData.res.map((value) => value.id).join(',')
                const updateUserData = (await db.connect('UPDATE user SET role=NULL WHERE id IN (?)', [ids]))[0]
                if (updateUserData.err) {
                    res.send(statusCodeMap['-1'])
                    return
                }

                res.send({
                    code: 200,
                    data: '',
                    msg: '',
                })
            } catch (e) {
                res.send(statusCodeMap['-1'])
            }
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}
