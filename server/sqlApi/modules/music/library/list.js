const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const music_library = require('#root/db/model/music_library.js')
const fileSq = require('#root/db/model/file.js')
const { Op } = require("sequelize")

// 获取曲库列表
module.exports = {
    path: '/music/library/list',
    fn: async function (req, res) {
        const { token } = req.headers;
        const { name, directory, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await music_library.findAndCountAll({
                where: {
                    state: 1,
                    name: {
                        [Op.like]: '%' + name + '%'
                    },
                    directory: {
                        [Op.like]: '%' + (directory || '') + '%'
                    },
                },
                order: [
                    ['createTime', 'DESC'],
                ],
                offset: start,
                limit: pageSize,
            })
            const list = sql_1.rows.map((value) => {
                let item = value.toJSON()
                // item.file = setCompleteAddress(item.file)
                return item
            })
            let fileidsList = []
            list.forEach((value) => {
                value.fileid && fileidsList.push({ id: value.fileid })
                value.lrc && fileidsList.push({ id: value.lrc })
            })
            const sql_2 = await fileSq.findAll({
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
                    sum: sql_1.count,
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
