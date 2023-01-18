const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取当前用户信息
module.exports = {
    path: '/user/getUserInfo',
    fn: async function (req, res) {
        const { token } = req.headers;
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const userFileData = (await db.connect('SELECT * FROM user WHERE state=1 and id=?', [tokenInfo.id]))[0]
            if (userFileData.err || userFileData.res.length == 0) {
                res.send(statusCodeMap['-1'])
                return
            }
            const { id, username, email } = userFileData.res[0]
            const roleFileData = (await db.connect('SELECT * FROM role WHERE state=1 and id=?', [id]))[0]
            if (roleFileData.err) {
                res.send(statusCodeMap['-1'] || roleFileData.res.length == 0)
                return
            }
            const roleInfo = roleFileData.res[0]
            const roleIds = roleInfo.permission ? roleInfo.permission.split(',') : []

            const menuFileData = (await db.connect(`SELECT * FROM menu WHERE state=1 and id IN (?)`, [roleIds]))[0]
            if (menuFileData.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            const menuList = menuFileData.res
            const permission = []
            menuList.forEach((value) => {
                if (roleIds.includes(value.id + '') && value.roleUrl) {
                    permission.push(value.roleUrl)
                }
            })

            res.send({
                code: 200,
                data: {
                    id,
                    name: username,
                    email,
                    permission,
                },
                msg: '',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}