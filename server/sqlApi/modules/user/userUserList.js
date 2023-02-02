const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取用户列表
module.exports = {
    path: '/user/userList',
    fn: async function (req, res) {
        const { token } = req.headers
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const menuFileData = (await db.connect('SELECT * FROM user WHERE state=1', []))[0]
            if (menuFileData.err || menuFileData.res.length == 0) {
                res.send(statusCodeMap['-1'])
                return
            }
            res.send({
                code: 200,
                data: {
                    list: menuFileData.res,
                    sum: 1,
                },
                msg: '',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}