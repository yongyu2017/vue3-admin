const fs = require('fs')
const path = require('path')
const dir = path.join(__dirname, './modules/')
let exportObject = {}

const fileList = getJsonFiles(dir).map((value) => {
    const Index = value.indexOf('modules')
    const fileUrl = './' + value.substr(Index).replace(/\\/g, '\/')
    const list = fileUrl.split('/')
    const fileName = list[list.length - 1].replace('.js', '')
    return {
        fileName,
        fileUrl,
    }
})
fileList.forEach((value) => {
    const requireObject = require(value.fileUrl)
    exportObject[value.fileName] = {
        path: requireObject.path,
        component: requireObject.fn
    }
})

module.exports = exportObject

// 获取文件列表
function getJsonFiles(jsonPath){
    let jsonFiles = []
    function findJsonFile(www){
        let files = fs.readdirSync(www)
        files.forEach(function (item) {
            let fPath =  path.join(www, item)
            let stat = fs.statSync(fPath)
            if(stat.isDirectory() === true) {
                findJsonFile(fPath)
            }
            if (stat.isFile() === true) {
                jsonFiles.push(fPath)
            }
        })
    }
    findJsonFile(jsonPath)

    return jsonFiles
}