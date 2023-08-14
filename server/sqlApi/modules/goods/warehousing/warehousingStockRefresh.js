const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Goods_detail = require('#root/db/model/Goods_detail.js')
const Goods_stock = require('#root/db/model/Goods_stock.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op, literal  } = require("sequelize")

// 同步更新商品库存
module.exports = {
    path: '/goods/warehousing/stockRefresh',
    fn: async function (req, res) {
        const { token } = req.headers
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Goods_stock.findAll({
                where: {
                    state: 1,
                },
            })
            const goodsIdList = sql_1.map((value) => {
                return {
                    id: value.id,
                    goodsId: value.goodsId,
                    count: 0,
                    state: value.state,
                    createTime: value.createTime,
                    updateTime: value.updateTime,
                }
            })

            const sql_2 = await Goods_detail.findAll({
                attributes: ['id', 'parentId', 'sale', 'state'],
                where: {
                    state: 1,
                },
            })
            for (let i = 0; i< sql_2.length; i++) {
                const item = sql_2[i]
                for (let j = 0; j < goodsIdList.length; j++) {
                    const item2 = goodsIdList[j]
                    if (item.parentId == item2.goodsId) {
                        item2.count++
                    }
                }
            }

            await Goods_stock.bulkCreate(
                goodsIdList,
                {
                    updateOnDuplicate: ['count', 'updateTime'],
                }
            )

            res.send({
                code: 200,
                data: {
                    goodsIdList,
                    list: sql_2,
                },
                msg: '操作成功！',
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
