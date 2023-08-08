const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取当前用户菜单
module.exports = {
    path: '/user/menuList',
    fn: async function (req, res) {
        const { token } = req.headers;
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const userFileData = (await db.connect('SELECT * FROM user WHERE state=1 and id=?', [tokenInfo.id]))[0]
            if (userFileData.err || userFileData.res.length == 0) {
                res.send(statusCodeMap['-1'])
                return
            }
            const { role } = userFileData.res[0]
            const roleFileData = (await db.connect('SELECT * FROM role WHERE state=1 and id=?', [role]))[0]
            if (roleFileData.err || roleFileData.res.length == 0) {
                res.send(statusCodeMap['-1'])
                return
            }
            const roleInfo = roleFileData.res[0]
            let roleIds = (roleInfo.permission ? roleInfo.permission.split(',') : []).map((value) => {
                return Number(value)
            }) // 用户所拥有的权限

            const menuFileData = (await db.connect(`SELECT * FROM menu WHERE state=1 ORDER BY orderNum ASC`, []))[0]
            if (menuFileData.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            let menuList = menuFileData.res
            const menuTree = menuToTreeMenu(menuList)
            let statusFalseChildIdsList = []
            const statusFalseList = menuList.filter((value) => {
                return value.status == 0
            })  // 菜单状态值关闭列表
            statusFalseList.forEach((value) => {
                statusFalseChildIdsList = [value.id, ...findChildNode(value.id, menuTree)]
            })
            menuList = menuList.filter((value) => {
                value['menuId'] = value.id;
                value['name'] = value.menuName;
                value['url'] = value.jumpUrl;
                return value.type != 2 && roleIds.includes(value.id) && !statusFalseChildIdsList.includes(value.id)
            })

            res.send({
                code: 200,
                data: {
                    menuList,
                },
                msg: '',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}
