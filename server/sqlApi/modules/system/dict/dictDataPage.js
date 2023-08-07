const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取用户列表
module.exports = {
    path: '/system/dict-data/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { label, dictType, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        if(tokenInfo){
            const menuFileData = (await db.connect("SELECT dict_data.id,dict_data.label,dict_data.value,dict_data.status,dict_type.type as dictType FROM dict_data left join dict_type on dict_data.dictType = dict_type.id WHERE dict_data.state=1 AND dict_data.dictType like '%"+ dictType + "%' AND dict_data.label like '%"+ label + "%' ORDER BY id DESC limit ?,?", [start, pageSize]))[0]
            const sum = (await db.connect("SELECT COUNT(*) as total FROM dict_data WHERE state=1 AND dictType like '%"+ dictType + "%' AND label like '%"+ label + "%'", []))[0].res[0].total

            if (menuFileData.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            res.send({
                code: 200,
                data: {
                    list: menuFileData.res,
                    sum
                },
                msg: '',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}
