const mysql = require('mysql')

module.exports={
    config: {
        host : 'localhost',  //连接数据库的地址。（默认：localhost）
        user : 'root',  //mysql的连接用户名
        password : 'root',  //对应用户的密码
        port: '3306',  // 连接地址对应的端口。（默认：3306）
        database : 'test'  //所需要连接的数据库的名称
    },
    //connect('sql语句',[参数],回调函数（err,data){})
    connect (sql, params, cb) {
        return new Promise((resolve, reject) => {
            const db = mysql.createConnection(this.config)
            db.connect()
            // 第一个参数是执行sql语句,第二个参数是一个数据格式，数组元素的先后顺序，对应sql语句中的?的顺序
            db.query(sql, params, (err, res, fields) => {
                cb && cb(err, res)
                resolve({ err, res })
            })
            db.end()
        })
    }
}
