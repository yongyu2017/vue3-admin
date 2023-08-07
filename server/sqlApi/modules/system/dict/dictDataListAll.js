const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获得字典数据所有列表
module.exports = {
    path: '/system/dict-data/listAll',
    fn: async function (req, res) {
        const { token } = req.headers
        const { pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        if(tokenInfo){
            const menuFileData = (await db.connect("SELECT dict_data.id,dict_data.label,dict_data.value,dict_type.type FROM dict_data left join dict_type on dict_data.dictType = dict_type.id WHERE dict_data.state=1 AND dict_data.status=1 AND dict_type.state=1 AND dict_type.status=1 ORDER BY id DESC", []))[0]

            if (menuFileData.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            let data = {}
            let keyList = menuFileData.res.map((value) => value.type).filter((value, index, array) => {
                return array.indexOf(value) == index
            })
            keyList.forEach((value) => {
                data[value] = []
            })
            menuFileData.res.forEach((value) => {
                data[value.type].push(value)
            })
            res.send({
                code: 200,
                data,
                msg: '',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}
