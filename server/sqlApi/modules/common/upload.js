const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, getSuffix } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

// 新增或修改菜单
module.exports = {
    path: '/common/upload',
    bodyParser: false,
    fn: async function (req, res) {
        const { token } = req.headers
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

            //创建formidable表单解析对象
            const form = new formidable.IncomingForm()
            //设置上传文件的保存路径
            const filePath = path.join(__dirname, '../../../upload/goods')
            form.uploadDir = filePath
            //保留上传文件的后缀名字
            form.keepExtensions = true
            //解析客户端传递过来的formData对象
            form.parse(req, (err, fields, files) => {
                if (err) {
                    res.send(statusCodeMap['-1'])
                    return
                }

                const newFileName = currentTime.replace(/-| |:/g, '')
                const suffix = getSuffix(files.file.originalFilename)[0]
                fs.rename(filePath + '\\' + files.file.newFilename, filePath + '\\' + newFileName + '' + suffix, function(){
                    res.send({
                        code: 200,
                        data: {},
                        msg: '操作成功！',
                    })
                })
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}