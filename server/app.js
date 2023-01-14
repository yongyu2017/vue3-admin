let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const api = require('./api/index.js')

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

// 设置连接信息
let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port: '3306',
    database : 'test'
})
//连接数据库
connection.connect()
//操作数据库，sql语句为函数参数
// connection.query('SELECT * FROM user WHERE state=1 and username LIKE \'%管理员%\'', function (error, results, fields) {
//     console.log(error, results)
// })

// 注册接口
for (let i in api) {
    app.post(api[i].path, api[i].component)
}


//配置服务端口
app.listen(8000, () => {
    console.log('node接口服务正常运行')
})