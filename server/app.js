let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const api = require('./sqlApi/index.js')

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())  //data参数以字典格式传输

// 注册接口
for (let i in api) {
    app.post(api[i].path, api[i].component)
}


//配置服务端口
app.listen(8000, () => {
    console.log('node接口服务正常运行')
})