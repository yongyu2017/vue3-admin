let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const api = require('./api/index.js')
const path = require('path')
const { port } = require('./utils/setting.js')

//设置跨域访问
app.all('*', function (req, res, next) {
    // res.header('Access-Control-Allow-Origin', 'http://192.168.1.22:1188')
    res.header('Access-Control-Allow-Origin', '*');  // express的cros开启需要具体到对应的白名单地址
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,token') //字段设置允许前端请求时请求头带有的字段值
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    /** ffmpeg WebAssembly 版本在网页运行的工具，发现使用到了 SharedArrayBuffer，涉及到跨域隔离的问题，需要设置两个 HTTP 消息头启用跨域隔离：
     **Cross-Origin-Opener-Policy 设置为 same-origin（保护源站免受攻击）
     **Cross-Origin-Embedder-Policy 设置为 require-corp（保护源站免受侵害） **/
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
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
app.listen(port, () => {
    console.log('node接口服务正常运行')
})