const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 删除菜单
module.exports = {
    path: '/user/deleteNav',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const menuListData = (await db.connect(`SELECT * FROM menu WHERE state=1 ORDER BY orderNum ASC`, []))[0]
            if (menuListData.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            const menuList = menuListData.res
            const menuTree = menuToTreeMenu(menuList)
            const childList = findChildNode(id, menuTree)
            if (childList.length > 0) {
                res.send({
                    code: -1,
                    data: '',
                    msg: '该数据下有其他选项，无法删除',
                })
                return
            }

            const menuFileData = (await db.connect('UPDATE menu SET state=? WHERE id=?', [0, id]))[0]
            if (menuFileData.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            res.send({
                code: 200,
                data: menuFileData.res[0],
                msg: '',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}
