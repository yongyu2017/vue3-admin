let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const circularJSON = require('circular-json');

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

// 登录
app.post('/user/login', (req, res) => {
    const { name, pwd } = req['body'];

    if((name && pwd) && (name == 'admin' && pwd == '123456')){
        res.send({
            code: 200,
            data: {
                'userName': '小猪',
                'sex': '男',
                'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9'
            },
            msg: '',
        })
    }else{
        res.send({
            code: -1,
            data: {},
            msg: '密码或者账号错误！',
        })
    }
})

// 当前用户信息
app.post('/user/getUserInfo', (req, res) => {
    const { token } = req.headers
    
    if(token){
        res.send({
            code: 200,
            data: {
                'userName': '小猪',
                'sex': '男',
                'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9'
            },
            msg: '',
        })
    }else{
        res.send({
            code: -1,
            data: '',
            msg: '未登录'
        })
    }
})

// 菜单
app.post('/user/menuList', (req, res) => {
    const { token } = req.headers
    
    if(token){
        res.send({
            code: 200,
            data: {
                list: [
                    {
                        menuId: 1,
                        name: '人事管理',
                        url: '',
                        icon: 'user',
                        list: [
                            {
                                menuId: 2,
                                name: '员工列表',
                                url: 'personnel/list',
                                icon: 'document',
                            },
                            {
                                menuId: 3,
                                name: '考勤管理',
                                url: '',
                                icon: 'goods',
                                list: [
                                    {
                                        menuId: 4,
                                        name: '考勤列表',
                                        url: 'attendance/list',
                                        icon: 'help',
                                    }
                                ],
                            }
                        ]
                    },
                    {
                        menuId: 5,
                        name: '商户管理',
                        url: '',
                        icon: 'takeawayBox',
                        list: [
                            {
                                menuId: 6,
                                name: '商户列表',
                                url: 'merchants/list',
                                icon: 'video-camera',
                            },
                        ]
                    },
                    {
                        menuId: 7,
                        name: 'Element',
                        url: 'https://element.eleme.cn/#/zh-CN/component/tabs',
                        icon: 'discount',
                    }
                ]
            },
            msg: '',
        })
    }else{
        res.send({
            code: -1,
            data: '',
            msg: '未登录'
        })
    }
})

// 员工列表
app.post('/user/userList', (req, res) => {
    const { token } = req.headers
    const { pageIndex, pageSize, name } = req['body'];
    
    if(token){
        let list= [],
            sum= 85,
            start= (pageIndex- 1) * pageSize,
            end= start+ pageSize;

        for(let i = 0; i < sum; i++){
            list.push({
                id: i + 1,
                name: '张三_' + i,
                age: Math.floor(Math.random() * 100),
                sex: 1
            })
        }
        list = list.filter((value)=> {
            if(name == ''){
                return true
            }else{
                if(value.name.indexOf(name.toLocaleLowerCase()) != -1){
                    return true
                }
            }
        })
        res.send({
            code: 200,
            data: {
                list: list.slice(start, end),
                sum: sum,
            },
            msg: '',
        })
    }else{
        res.send({
            code: -1,
            data: '',
            msg: '未登录'
        })
    }
})

//配置服务端口
app.listen(8000, () => {
    console.log('node接口服务正常运行')
})