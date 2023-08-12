const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const User = require('#root/db/model/user.js')
const { Op } = require("sequelize")

// 新增或修改菜单
module.exports = {
    path: '/user/addOrModifyUser',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, account, des, role, email, pwd, username } = req['body'];
        const tokenInfo = await verifyToken(token)
        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            if (id) {
                const sql_2 = await User.findOne({
                    where: {
                        id,
                    },
                })
                if (sql_2.account != account) {
                    const sql_1 = await checkKeyNameExisting(res, account)
                    if (!sql_1) return
                }

                await User.update(
                    {
                        account, des, role, email, pwd, username,
                        updateTime: currentTime,
                    },
                    {
                        where: {
                            id,
                        },
                    },
                )
            } else {
                const sql_1 = await checkKeyNameExisting(res, account)
                if (!sql_1) return

                await User.create({
                    account, des, role, email, pwd, username,
                    state: 1,
                    createTime: currentTime,
                    updateTime: currentTime,
                })
            }

            res.send({
                code: 200,
                data: {},
                msg: '操作成功！',
            })
        } catch (err) {
            res.send({
                code: -1,
                data: '',
                msg: JSON.stringify(err),
            })
        }
    }
}

// 校验某个字段名是否存在
async function checkKeyNameExisting (res, account) {
    const sql_1 = await User.findAndCountAll({
        where: {
            account,
        },
    })
    if (sql_1.count > 0) {
        res.send({
            code: -1,
            data: '',
            msg: '该角色名称已存在',
        })
        return false
    }

    return true
}
