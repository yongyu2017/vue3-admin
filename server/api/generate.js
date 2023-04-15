const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('../utils/index.js')
const statusCodeMap = require('../utils/statusCodeMap.js')

// 模版生成
async function templateGenerate (req, res) {
    const { token } = req.headers
    const fileData = await getFileData('/json/jsonToTemplate.json');
    const userInfo = await verifyToken(token)

    if(userInfo){
        try {
            let allHtml = ''
            let templateHtml = '<template>'
            let scriptHtml = '<script setup>'
            let styleHtml = '<style lang="scss" scoped>'
            for (let i in fileData) {
                templateHtml += ''
            }
            templateHtml += '</template>'
            scriptHtml += '</script>'
            styleHtml += '</style>'
            allHtml = templateHtml + scriptHtml + styleHtml
            console.log(allHtml.replace())
            setFileData('/template/jsonToTemplate.vue', allHtml)
            res.send({
                code: 200,
                data: fileData,
                msg: '',
            })
        } catch (e) {
            console.log(e)
        }
    }else{
        res.send({
            data: '',
            ...statusCodeMap['401']
        })
    }
}

module.exports = {
    templateGenerate,
}