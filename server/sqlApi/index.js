const fs = require('fs')
const path = require('path')
const { getJsonFiles } = require('#root/utils/index.js')
const dir = path.join(__dirname, './modules/')
let exportObject = {}

const fileList = getJsonFiles(dir).map((value) => {
    const Index = value.indexOf('modules')
    const fileUrl = './' + value.substr(Index).replace(/\\/g, '\/')
    const fileName = fileUrl.replace('./modules/', '').replace('/', '_').replace('.js', '')
    return {
        fileName,
        fileUrl,
    }
})
fileList.forEach((value) => {
    const requireObject = require(value.fileUrl)
    let fileObject = {}
    for (let i in requireObject) {
        fileObject[i] = requireObject[i]
    }
    exportObject[value.fileName] = fileObject
})

module.exports = exportObject
