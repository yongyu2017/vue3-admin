const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Goods_detail = require('#root/db/model/Goods_detail.js')
const Goods_stock = require('#root/db/model/Goods_stock.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op, literal  } = require("sequelize")

// 新增或修改商品类型
module.exports = {
    path: '/goods/warehousing/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, code, name, parentId, costPrice, price } = req['body'];
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        // 开启事务
        const t = await sequelize.transaction()
        try {
            if (id) {
                /** 检测商品编码是否重复 **/
                const sql_1 = await Goods_detail.findOne({
                    where: {
                        id,
                    },
                    transaction: t
                })
                const originalData = sql_1
                if (originalData.code != code) {
                    const checkCodeExistingRes = await checkKeyNameExisting(res, code, t)
                    if (!checkCodeExistingRes) return
                }
                /** 检测商品编码是否重复 **/

                if (sql_1.sale == 1) {
                    res.send({
                        code: -1,
                        data: '',
                        msg: '该商品已出售，不可修改',
                    })
                    return
                }

                await Goods_detail.update(
                    {
                        code,
                        name,
                        parentId,
                        costPrice,
                        price,
                        updateTime: currentTime,
                    },
                    {
                        where: {
                            id,
                        },
                        transaction: t
                    }
                )

                await updateGoods_stock(id, parentId, originalData, currentTime, t)
            } else {
                const checkCodeExistingRes = await checkKeyNameExisting(res, code, t)
                if (!checkCodeExistingRes) return

                await Goods_detail.create({
                    code,
                    name,
                    parentId,
                    costPrice,
                    price,
                    sale: 0,
                    state: 1,
                    createTime: currentTime,
                    updateTime: currentTime,
                }, {
                    transaction: t
                })

                await updateGoods_stock(id, parentId, {}, currentTime, t)
            }

            // 提交事务
            await t.commit()
            res.send({
                code: 200,
                data: '',
                msg: '操作成功！',
            })
        } catch (err) {
            // 回滚事务
            await t.rollback()
            res.send({
                code: -1,
                data: '',
                msg: JSON.stringify(err),
            })
        }

    }
}

// 校验商品编码是否存在
async function checkKeyNameExisting (res, code, t) {
    const sql_1 = await Goods_detail.findOne({
        where: {
            code,
        },
        transaction: t
    })

    if (sql_1) {
        res.send({
            code: -1,
            data: '',
            msg: '该商品编码已存在',
        })
        return false
    }

    return true
}

// 更新商品库存表库存信息
async function updateGoods_stock (id, parentId, originalData, currentTime, t) {
    await Goods_stock.update(
        {
            count: literal('count+1'),
            updateTime: currentTime,
        },
        {
            where: {
                goodsId: parentId,
            },
            transaction: t
        }
    )

    if (id && (parentId != originalData.parentId)) {
        await Goods_stock.update(
            {
                count: literal('count-1'),
                updateTime: currentTime,
            },
            {
                where: {
                    goodsId: originalData.parentId,
                },
                transaction: t
            }
        )
    }
}
