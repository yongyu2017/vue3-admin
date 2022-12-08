import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { clearLoginInfo } from '@/utils/utils'
import { storeToRefs } from 'pinia'
import { useStorePinia } from "@/store"

const http = axios.create({
    baseURL: process.env.NODE_ENV == 'development'? process.env.VUE_APP_BASE_API: '',
    timeout: 1000 * 10,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})

/** 取消重复接口请求 **/
// let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
// let cancelToken = axios.CancelToken;
// let removePending = (ever) => {
//     for(let p in pending){
//         if(pending[p].u === ever.url + '&' + ever.method) { //当当前请求在数组中存在时执行函数体
//             pending[p].f() //执行取消操作
//             pending.splice(p, 1) //把这条记录从数组中移除
//         }
//     }
// }
/** 取消重复接口请求 **/

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
    const store = useStorePinia()
    const { token } = storeToRefs(store);
    config['headers']['token']= token.value;  //请求头带上token
    config.data= config.data || {};

    // removePending(config) //在一个ajax发送前执行一下取消操作
    // config.cancelToken = new cancelToken((c)=>{
    //     // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    //     pending.push({ u: config.url + '&' + config.method, f: c })
    // })

    return config
}, error => {
    return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
    const { data } = response;
    const { code } = data;
    console.log('requestjs=', response.config.url, data)

    // removePending(response.config)  //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除

    if(code === 200){
        return data
    }else{
        if(code == 401){
            clearLoginInfo()
            setTimeout(() => {
                router.push({
                    name: 'login',
                    query: {
                        url: encodeURIComponent(router.currentRoute.value.fullPath),
                    },
                })
            }, 2000)
        }
        ElMessage.error(data.msg || '程序异常')

        return Promise.reject(data)
    }
}, error => {
    return Promise.reject(error)
})

export default http
