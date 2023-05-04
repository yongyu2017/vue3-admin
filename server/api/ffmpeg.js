const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('../utils/index.js')
const statusCodeMap = require('../utils/statusCodeMap.js')
const process = require('child_process')
const iconv = require('iconv-lite')
const encoding = 'cp936'
const binaryEncoding = 'buffer'
var fs = require('fs')

// ffmpeg视频转码
async function ffmpegTranscoding (req, res) {
    const { token } = req.headers
    const userInfo = await verifyToken(token)

    if(userInfo){
        fs.exists('D:\\yuy\\ffmpeg_test\\output\\210709224656837141_copy12.mp4', function (exists) {
            console.log(exists)
        })
        process.exec('ffmpeg -i D:\\yuy\\ffmpeg_test\\input\\210709224656837141.mp4 D:\\yuy\\ffmpeg_test\\output\\210709224656837141_copy.mp4', { encoding: binaryEncoding }, (error, stdout, stderr) => {
            console.log('error', error)
            if (!error) {
                res.send({
                    code: 200,
                    data: iconv.decode(stdout, encoding),
                    msg: '',
                })
            } else {
                res.send({
                    data: iconv.decode(stderr, encoding),
                    ...statusCodeMap['-1']
                })
            }
        })
    }else{
        res.send({
            data: '',
            ...statusCodeMap['401']
        })
    }
}
module.exports = {
    ffmpegTranscoding,
}