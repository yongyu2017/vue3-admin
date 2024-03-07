const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Music_library_sq = require('#root/db/model/Music_library.js')
const Music_file_sq = require('#root/db/model/Music_file.js')
const { Op, QueryTypes } = require("sequelize")
const { sequelize } = require('#root/db/databaseInit.js')

// 获取曲库列表
module.exports = {
    path: '/music/library/list',
    fn: async function (req, res) {
        const { token } = req.headers;
        const { name, label, pageIndex, pageSize, orderBy = 'updateTime' } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        // if (!tokenInfo) {
        //     res.send(statusCodeMap['401'])
        //     return
        // }

        try {
            const labelList = label ? label.toString().split(',') : []
            function selectSql (type) {
                let sql_txt = "SELECT " + (type == 0 ? "COUNT(*)" : "*") + " FROM music_library WHERE name LIKE '%" + name + "%'"
                if (labelList.length > 0) {
                    sql_txt +=  "and CONCAT (',',label,',') REGEXP ',(" + labelList.join('|') + "),'"
                }
                sql_txt += " ORDER BY " + orderBy + " DESC"
                if (type == 1) {
                    sql_txt += " LIMIT " + start + ", " + pageSize
                }
                return sql_txt
            }
            const sql_3 = await sequelize.query(selectSql(0), {
                model: Music_library_sq,
                mapToModel: true,
                type: QueryTypes.SELECT,
            })
            const sql_1 = await sequelize.query(selectSql(1), {
                model: Music_library_sq,
                mapToModel: true,
                type: QueryTypes.SELECT,
            })
            const list = sql_1.map((value) => {
                let item = value.toJSON()
                // item.file = setCompleteAddress(item.file)
                return item
            })
            let fileidsList = []
            list.forEach((value) => {
                value.fileid && fileidsList.push({ id: value.fileid })
                value.lrc && fileidsList.push({ id: value.lrc })
            })
            const sql_2 = await Music_file_sq.findAll({
                where: {
                    [Op.or]: fileidsList
                },
            })
            fileidsList = sql_2.map((value) => {
                let item = value.toJSON()
                item.url = setCompleteAddress(item.url)
                return item
            })
            list.forEach((value) => {
                let itemFileList = []
                const fileidItem = fileidsList.find((value2) => value2.id == value.fileid)
                const lrcItem = fileidsList.find((value2) => value2.id == value.lrc)
                if (fileidItem) {
                    fileidItem['url'] = setCompleteAddress('/music/library/read/' + fileidItem.name)
                    itemFileList.push(fileidItem)
                }
                lrcItem && itemFileList.push(lrcItem)
                value['fileList'] = itemFileList
            })

            res.send({
                code: 200,
                data: {
                    list,
                    sum: sql_3[0].dataValues['COUNT(*)'],
                },
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
