let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const api = require('./api/index.js')
const path = require('path')

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next()
})
app.use(express.static(path.join(__dirname, 'upload')))  // 开放upload静态文件
var jsonParser = bodyParser.json() // create application/json parser
var urlencodedParser = bodyParser.urlencoded({ extended: false }) // create application/x-www-form-urlencoded parser

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())  //data参数以字典格式传输

// 注册接口
for (let i in api) {
    const bodyParserType = api[i].bodyParser || (api[i].bodyParser == undefined ? jsonParser : '')  // 请求参数解析方式，默认使用JSON，而文件类型不可以进行bodyParser解析

    if (bodyParserType) {
        app.post(api[i].path, bodyParserType, api[i].fn)
    } else {
        app.post(api[i].path, api[i].fn)
    }
}

//配置服务端口
app.listen(8000, () => {
    console.log('node接口服务正常运行')
})