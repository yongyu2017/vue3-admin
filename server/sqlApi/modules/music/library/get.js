const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const music_library = require('#root/db/model/music_library.js')
const fileSq = require('#root/db/model/file.js')
const { Op } = require("sequelize")

// 获取曲库详情
module.exports = {
    path: '/music/library/get',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            // 如果存在别名，则删除别名
            // if(music_library.associations.fileInfo){
            //     delete music_library.associations.fileInfo
            // }
            // music_library.hasOne(fileSq, { foreignKey: 'id', sourceKey: 'fileid', as: 'fileInfo' });
            const sql_1 = await music_library.findOne({
                attributes: ['id', 'name', 'directory', 'fileid', 'lrc', 'des', 'createTime', 'updateTime'],
                where: {
                    state: 1,
                    id,
                },
            })
            const sql_2 = await fileSq.findAll({
                where: {
                    [Op.or]: [
                        { id: sql_1.fileid },
                        { id: sql_1.lrc }
                    ]
                },
            })
            let dataJson = sql_1.toJSON()
            dataJson['fileList'] = sql_2

            res.send({
                code: 200,
                data: dataJson,
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
