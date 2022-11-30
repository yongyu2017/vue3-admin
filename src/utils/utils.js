import router from '@/router'
import { useStorePinia, pinia } from "@/store"
const store = useStorePinia(pinia)
const { loginOut } = store;

//深拷贝
export function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty.call(key)) {
            if (typeof obj[key] === 'object' && obj[key]!==null) {
                result[key] = deepCopy(obj[key]);  //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
    return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
    router.options.isAddDynamicMenuRoutes = false;
    loginOut()
}

