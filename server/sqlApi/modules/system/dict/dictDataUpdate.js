const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 新增或修改菜单
module.exports = {
    path: '/system/dict-data/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, dictType, label, value, sort, status, remark } = req['body'];
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

            if (id) {
                const menuFileData = (await db.connect('UPDATE dict_data SET dictType=?,label=?,value=?,sort=?,status=?,des=?,updateTime=? WHERE id=?', [dictType, label, value, sort, status, remark, currentTime, id]))[0]

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
                const menuFileData = (await db.connect('insert into dict_data (dictType, label, value, sort, status, des, state, createTime, updateTime) values (?,?,?,?,?,?,?,?,?)', [dictType, label, value, sort, status, remark, 1, currentTime, currentTime]))[0]

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
