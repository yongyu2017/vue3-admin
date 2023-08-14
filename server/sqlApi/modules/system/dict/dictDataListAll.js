const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Dict_type = require('#root/db/model/Dict_type.js')
const Dict_data = require('#root/db/model/Dict_data.js')
const { Op } = require("sequelize")

// 获得字典数据所有列表
module.exports = {
    path: '/system/dict-data/listAll',
    fn: async function (req, res) {
        const { token } = req.headers
        const { pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            Dict_data.hasOne(Dict_type, { foreignKey: 'id', sourceKey: 'dictType' });
            const sql_1 = await Dict_data.findAll({
                where: {
                    state: 1,
                },
                include: [
                    {
                        model: Dict_type,
                        attributes: ['type'],
                    }
                ],
            })

            let data = {}
            let keyList = sql_1.map((value) => value.dict_type.type).filter((value, index, array) => {
                return array.indexOf(value) == index
            })
            keyList.forEach((value) => {
                data[value] = []
            })
            sql_1.forEach((value) => {
                data[value.dict_type.type].push({
                    id: value.id,
                    label: value.label,
                    value: value.value,
                })
            })

            res.send({
                code: 200,
                data: data,
                msg: '',
            })
        } catch (err) {
            console.log(err)
            res.send({
                code: -1,
                data: '',
                msg: JSON.stringify(err),
            })
        }
    }
}
