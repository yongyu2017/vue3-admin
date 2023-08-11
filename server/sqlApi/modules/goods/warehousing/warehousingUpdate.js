const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 新增或修改商品类型
module.exports = {
    path: '/goods/warehousing/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, code, name, parentId } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (id) {
            /** 检测商品编码是否重复 **/
            const sql_4 = await db.connect('SELECT * FROM goods_detail WHERE id=?', [id])
            const originalData = sql_4.res[0]
            if (originalData.code != code) {
                const checkCodeExistingRes = await checkCodeExisting(res, code)
                if (!checkCodeExistingRes) return
            }
            /** 检测商品编码是否重复 **/

            const sql_1 = await db.connect('UPDATE goods_detail SET code=?,name=?,parentId=?,updateTime=? WHERE id=?', [code, name, parentId, currentTime, id])
            if (sql_1.err) {
                res.send(statusCodeMap['-1'])
                return
            }

            const sql_2 = await db.connect('SELECT COUNT(*) as total FROM goods_stock WHERE goodsId=?', [parentId])
            if (sql_2.err) {
                res.send(statusCodeMap['-1'])
                return
            }

            let sql_3 = ''
            if (sql_2.res[0].total > 0) {
                sql_3 = await db.connect('UPDATE goods_stock SET count=count+1,updateTime=? WHERE goodsId=?', [currentTime, parentId])
            } else {
                sql_3 = await db.connect('insert into goods_stock (goodsId, count, state, createTime, updateTime) values (?,?,?,?,?)', [parentId, 1, 1, currentTime, currentTime])
            }
            if (sql_3.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            if (parentId != originalData.parentId) {
                const sql_6 = await db.connect('UPDATE goods_stock SET count=count-1,updateTime=? WHERE goodsId=?', [currentTime, originalData.parentId])
                if (sql_6.err) {
                    res.send(statusCodeMap['-1'])
                    return
                }
            }
        } else {
            const checkCodeExistingRes = await checkCodeExisting(res, code)
            if (!checkCodeExistingRes) return
            const sql_1 = await db.connect('insert into goods_detail (code, name, parentId, sale, state, createTime, updateTime) values (?,?,?,?,?,?,?)', [code, name, parentId, 0, 1, currentTime, currentTime])
            if (sql_1.err) {
                res.send(statusCodeMap['-1'])
                return
            }

            const sql_2 = await db.connect('SELECT COUNT(*) as total FROM goods_stock WHERE goodsId=?', [parentId])
            if (sql_2.err) {
                res.send(statusCodeMap['-1'])
                return
            }

            let sql_3 = ''
            if (sql_2.res[0].total > 0) {
                sql_3 = await db.connect('UPDATE goods_stock SET count=count+1,updateTime=? WHERE goodsId=?', [currentTime, parentId])
            } else {
                sql_3 = await db.connect('insert into goods_stock (goodsId, count, state, createTime, updateTime) values (?,?,?,?,?)', [parentId, 1, 1, currentTime, currentTime])
            }
            if (sql_3.err) {
                res.send(statusCodeMap['-1'])
                return
            }
        }

        res.send({
            code: 200,
            data: '',
            msg: '操作成功！',
        })
    }
}

// 校验商品编码是否存在
async function checkCodeExisting (res, code) {
    const sql_4 = await db.connect('SELECT COUNT(*) as total FROM goods_detail WHERE code=?', [code])
    if (sql_4.err) {
        res.send(statusCodeMap['-1'])
        return false
    }
    if (sql_4.res[0].total > 0) {
        res.send({
            code: -1,
            data: '',
            msg: '该商品编码已存在',
        })
        return false
    }

    return true
}
