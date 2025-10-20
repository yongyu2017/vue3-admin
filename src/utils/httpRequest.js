import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { clearLoginInfo } from '@/utils'
import { storeToRefs } from 'pinia'
import { useStorePinia } from "@/store"
import { API_HOST } from '@/utils/environment.js'

const http = axios.create({
    baseURL: API_HOST,
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
    const throwError = response.config['throwError'] === undefined ? true : response.config['throwError'] // 是否默认抛出异常信息

    // removePending(response.config)  //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    process.env.NODE_ENV == 'development' && console.log('requestjs=', response.config.url, data)

    if (response.request.responseType === 'blob') {
        if (data.type == 'application/json') {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsText(response.data, 'utf-8');
                reader.onload = function () {
                    let result = ''
                    try {
                        result = JSON.parse(reader.result)
                    } catch (e) {
                        result = {
                            msg: reader.result
                        }
                    }
                    throwError && ElMessage.error(data.msg || '程序异常')
                    resolve(result)
                }
            })
        } else {
            let filename = response.request.getResponseHeader('Content-Disposition') || '';
            filename = filename.replace(/(attachment|inline);(filename=| filename=|fileName=| fileName=)/g, '');
            filename = filename.replace(/[\s"]/g, '');
            filename = decodeURIComponent(filename);

            if (filename == '' && data.size == 0) {
                throwError && ElMessage.error(data.msg || '程序异常')
                return Promise.reject(data)
            }
            return {
                code: 200,
                data: {
                    file: data,
                    filename,
                },
            }
        }
    } else {
        const { code } = data;
        if(code === 200){
            return data
        }else{
            if(code == 401){
                clearLoginInfo()
                setTimeout(() => {
                    router.push({
                        name: 'Login',
                        query: {
                            url: encodeURIComponent(router.currentRoute.value.fullPath),
                        },
                    })
                }, 0)
            }
            ElMessage.error(data.msg || '程序异常')

            return Promise.reject(data)
        }
    }
}, error => {
    ElMessage.error(error.message || '程序异常')
    return Promise.reject(error)
})

export default http
