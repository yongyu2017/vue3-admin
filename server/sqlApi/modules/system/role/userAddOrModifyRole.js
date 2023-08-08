const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 新增或修改角色信息
module.exports = {
    path: '/user/addOrModifyRole',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, name, des, permission } = req['body'];
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            const countData = (await db.connect('SELECT COUNT(*) as total FROM role WHERE name=?', [name]))[0]
            if (countData.res[0].total > 0) {
                res.send({
                    code: -1,
                    data: {},
                    msg: '该角色名称已存在',
                })
                return
            }

            if (id) {
                const menuFileData = (await db.connect('UPDATE role SET name=?,des=?,permission=?,updateTime=? WHERE id=?', [name, des, permission, currentTime, id]))[0]

                if (menuFileData.err) {
                    res.send(statusCodeMap['-1'])
                    return
                }
                res.send({
                    code: 200,
                    data: {},
                    msg: '操作成功！',
                })
            } else {
                const menuFileData = (await db.connect('insert into role (name, des, permission, state, createTime, updateTime) values (?,?,?,?,?,?)', [name, des, permission, 1, currentTime, currentTime]))[0]

                if (menuFileData.err) {
                    res.send(statusCodeMap['-1'])
                    return
                }
                res.send({
                    code: 200,
                    data: {},
                    msg: '操作成功！',
                })
            }
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}
