import { toRefs } from 'vue'
import { useStorePinia } from '@/store'
import router from '@/router'
import { ElMessage, ElNotification } from 'element-plus'
import { API_HOST } from '@/utils/environment.js'
import SparkMD5 from 'spark-md5'
import CryptoJS from 'crypto-js'

//深拷贝
export function cloneDeep (obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'object' && obj[key]!==null) {
                result[key] = cloneDeep(obj[key]);  //递归复制
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

// 校验邮箱地址
export function checkEamil(str) {
    return /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/.test(str)
}

// 校验身份证号码
export function checkIDcard (str) {
    return /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/.test(str)
}

// 校验手机号码
export function checkPhone (str) {
    return /^1[3456789]\d{9}$/.test(str)
}

// 验证企业税号
export function checkTax (str) {
    return /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(str)
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
    const store = useStorePinia()
    const { resetStore } = store;
    router.options.isAddDynamicMenuRoutes = false;
    resetStore()
}

// 将一维数据转为树形结构
export function menuToTreeMenu (source) {
    const len = source.length
    for (let i = 0; i < len; i++) {
        let arrTemp = []
        for (let j = 0; j < len; j++) {
            if (source[i].id == source[j].parentId) {
                arrTemp.push(source[j])
                source[i].children = arrTemp
            }
        }
    }

    let result = []
    for (let i = 0; i < source.length; i++) {
        if (source[i].parentId == 0 || source[i].parentId == null) {
            result.push(source[i])
        }
    }

    return result
}

// 树状数据过滤
export function treeNodeRecursive(list) {
    return list.filter((value) => {
        if (value.children && value.children.length > 0) {
            if (value.visible) {
                value.children = treeNodeRecursive(value.children)
                return true
            } else {
                return false
            }
        } else {
            return value.visible
        }
    })
}

// 全屏切换
export const Fullscreen = {
    launchFullscreen (element) {
        if (element.requestFullscreen) {
            element.requestFullscreen()
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen()
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullScreen()
        }
    },
    exitFullscreen () {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
}

// code转label名称
export function codeToLabel (val, list, isShowValue = true){
    let str= ''
    if(list){
        const isArray = Array.isArray(val)
        if (isArray) {
            const arr = []
            val.forEach((value) => {
                list.forEach((value2)=> {
                    if(value2.value == value){
                        arr.push(value2.label)
                    }
                })
            })
            str = arr.join('，')
        } else {
            list.forEach((value)=> {
                if(value.value == val){
                    str= value.label
                }
            })
        }
    }
    return str || (isShowValue ? val : '')
}

// 获取文件后缀数据
export function getSuffix (str) {
    return str.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)
}

// 判断是否为数字,checkInteger校验是否是整数
export function isNumber(val, checkInteger) {
    // const regPos = /^[0-9]+.?[0-9]*$/ //判断是否是数字
    const pointIndex = (val + '').indexOf('.')  // 是否带小数点
    const valIsNaN = !isNaN(val)

    return checkInteger ? (valIsNaN && pointIndex === -1) : valIsNaN
}
/**
 * 判断是否是数字
 * integer校验小数，0:不校验 1:整数 2:小数
 * positiveNumber校验正负数，0:不校验 1:正数 2:负数
 * decimal小数位，0：不校验小数位
 * **/
export function isNumberFun (val = '', integer = 0, positiveNumber = 0, decimal = 0) {
    let result = true
    const _val = isNullOrUndefined(val) ? '' : val + ''
    const isNumberType = /^-?\d+(\.\d+)?$/.test(_val) //判断是否是数字
    const isInteger = _val.indexOf('.') == -1 ? false : true  // 是否是小数
    const isPositiveNumber = _val.indexOf('-') == 0 ? false : true  // 是否是正数
    const decimalLen = isInteger ? _val.split('.')[1].length : 0 // 有多少位小数点

    if (!isNumberType) {
        result = false
        return result
    }
    if (isNumberType && integer != 0) {
        result = integer == 1 ? !isInteger : isInteger
        if (!result) return result
    }
    if (isNumberType && positiveNumber != 0) {
        result = positiveNumber == 1 ? isPositiveNumber : !isPositiveNumber
        if (!result) return result
    }
    if (isNumberType && decimal != 0) {
        result = decimalLen > decimal ? false : true
        if (!result) return result
    }

    return result
}
// 返回身份证信息 如 性别 sex、生日 birthDay
export function getCardInfo (id) {
    if (!checkIDcard(id)) {
        return
    }
    var obj = {};

    // 身份证号 获取性别
    var sexNum = id.substring(id.length - 2, id.length - 1);
    var isEven = ( sexNum % 2 ) === 0;
    obj["sex"] = isEven ? "2" : "1";       // 姓别 1 -> 男 | 2 -> 女

    // 身份证号 获取生日
    var birthDay = id.substring(6, 14);
    var y = birthDay.substring(0, 4);
    var m = birthDay.substring(4, 6);
    var d = birthDay.substring(6, 8);
    obj["birthDay"] = y + "-" + m + "-" + d;

    // 身份证号 获取年龄
    var nowDate = new Date();  //获取当前时间
    var intYear = parseInt(y); //身份证的年份转为数字格式
    var month = nowDate.getMonth() + 1; //获取当前月份，getMonth()方法获取到的月份是从0开始的，所以这里需要加1
    var intMonth = parseInt(m); //身份证的月份转为数字格式
    var day = nowDate.getDate();
    var age = nowDate.getFullYear() - intYear - 1;
    age = parseInt(age);
    //判断身份证月份是否比当前月份小
    if (intMonth < month || (intMonth === month && id.substring(12, 14) <= day)) {
        age++;
    }
    obj["age"] = age;

    return obj;
}

// url地址提取query参数
export function urlChangeQuery(str) {
    const query = {}
    str.split('?')[1].split('&').forEach((value) => {
        const arr = value.split('=')
        query[arr[0]] = arr[1]
    })

    return query
}

// 倒计时
export function countdownTime (time, arg) {
    // time单位：秒
    // const endTime = new Date().getTime() + time * 1000
    var endTime = time
    var timer = null

    stopInterVal(timer)
    timer = setInterval(function () {
        outputStr()
    }, 1000)
    if (arg && arg.init) {
        arg.init(endTime, timer)
    }
    // outputStr()
    function outputStr() {
        // const nowTime = new Date().getTime()
        endTime--
        if (arg && arg.callback) {
            arg.callback(endTime, timer)
        }

        if (endTime == 0) {
            stopInterVal(timer)
            if (arg && arg.done) {
                arg.done()
            }
        }
    }
    function stopInterVal(st) {
        if (st) {
            clearInterval(st)
            st = null
        }
    }
}

// 字符串转数组
export function stringToArray (str) {
    let list = str ? str.split('；') : []
    return list.map((value) => {
        const arr = value.split('：')
        return {
            value: arr[0],
            label: arr[1]
        }
    })
}

// URL的参数解析成一个对象
export function parseQueryString (url) {
    var index = url.indexOf("?");
    if (index == -1) {
        return {}
    }
    var str = url.slice(index + 1);
    var arr = str.split("&");
    var obj = {};

    for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=');
        obj[arr2[0]] = arr2[1];
    }
    return obj
}
// 生成多位随机数
export function getRandom (num) {
    return Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,num-1))
}
// 非空校验
export function checkEmptyFun (val, msg) {
    const isString= typeof(val)== 'string' ? true : false
    const isNumber = typeof(val) == 'number' ? true : false
    let result = true

    if((isString && val === '') || (isNumber && val === '') || val === undefined || val === null){
        ElMessageOutput({
            message: msg || '不能为空',
            type: 'warning',
        })
        result = false
    }

    return result
}
// AES加密
export function encrypt (data, SECRET_KEY) {
    if (typeof data === "object") {
        try {
            // eslint-disable-next-line no-param-reassign
            data = JSON.stringify(data)
        } catch (error) {
            console.log("encrypt error:", error)
        }
    }
    const dataHex = CryptoJS.enc.Utf8.parse(data)
    const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
        // iv: SECRET_IV,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.ciphertext.toString()
}
// AES解密
export function decrypt (data, SECRET_KEY) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
    const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
        // iv: SECRET_IV,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
}
// 延迟执行
export function delayRun (delayTime) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delayTime)
    })
}
// 文件md5
export function FILE_SPARK_MD5 (file, cb) {
    var sliceLength = 10;
    var chunkSize = Math.ceil(file.size / sliceLength);
    var fileReader = new FileReader();
    var md5 = new SparkMD5();
    var index = 0;

    var loadFile = () => {
        var slice = file.slice(index, index + chunkSize);

        fileReader.readAsBinaryString(slice);
        fileReader.onload = e => {
            md5.appendBinary(e.target.result);

            if (index < file.size) {
                index += chunkSize;

                loadFile()
            } else {
                cb && cb(md5.end())
            }
        }
    }
    loadFile()
}
// 秒转时分秒
export function secondToTimeFun (time) {
    const h = Math.floor(time / 60 / 60)
    const m = Math.floor((time % 3600) / 60)
    const s = time % 60

    return {
        h: zeroFill(h),
        m: zeroFill(m),
        s: zeroFill(s),
        date: zeroFill(h) + ':'+ zeroFill(m) + ':' + zeroFill(s)
    }
}
// 补零
export function zeroFill (val) {
    return val < 10 ? '0' + val : val
}
// 数字取整
export function numberRounding (val) {
    if (val === undefined || val === null) return 0
    var str = String(val)
    var Index = str.indexOf('.')
    return Number(str.substring(0, Index))
}
// 空值校验
export function checkEmpty (val) {
    return val === '' || val === undefined || val === null
}
// 校验是否为数字并且是一位小数
export function isOneDecimal (value) {
    return /^\d+(\.\d)?$/.test(value);
}
// 把对象下的字段值为null或者undefined的值转换位空字符串
export function objectNullValueChange (val) {
    for (var i in val) {
        if (isObject(val[i])) {
            objectNullValueChange(val[i])
        } else {
            val[i] = nullToEmptyStringFun(val[i])
        }
    }
}
// 判断是否为对象,而非数组
function isObject (value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}
// null或者undefined转空字符串
export function nullToEmptyStringFun (val) {
    return (val === undefined || val === null) ? '' : val
}
// 全角转换为半角
export function ToCDB (str) {
    var tmp = ''
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) == 12288) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 12256)
            continue
        }
        if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
        } else {
            tmp += String.fromCharCode(str.charCodeAt(i))
        }
    }
    return tmp
}
// form表单方式导出数据
export function formExportData (url, data) {
    var token = sessionStorage.getItem('token')
    var dlform = document.createElement('form')
    dlform.action = API_HOST + url
    dlform.target = '_blank'
    dlform.method = 'post'
    dlform.style = 'display:none;'

    data['token'] = token
    for (var i in data) {
        var value = data[i]
        var label = i
        var normal_form = normalDataToFormNode(value, label)
        dlform.appendChild(normal_form)
    }

    document.body.appendChild(dlform)
    dlform.submit()
    document.body.removeChild(dlform)
}
// 标准值转form表单节点
export function normalDataToFormNode (val, name) {
    var valueNode_ = document.createElement('input')
    valueNode_.type = 'hidden'
    valueNode_.name = name
    valueNode_.value = val

    return valueNode_
}
// 根据逗号分隔数组
export function strToArray (str) {
    var list = []
    if (typeof str === 'string') {
        var strArr = str.replace(/^\s+|\s+$/g, '').split(/,|，/)
        for (var i = 0; i < strArr.length; i++) {
            var item = strArr[i]
            if (item !== '') {
                list.push(item)
            }
        }
    }
    return list
}
// url转query参数
export function urlToQueryFun (url) {
    const Index = url.indexOf('?')
    const path = Index != -1 ? url.substring(0, Index) : url
    const queryStr = Index != -1 ? url.substr(Index + 1) : ''
    const queryList = queryStr.split('&').filter((value) => value)
    let query = {}
    queryList.forEach((value) => {
        const list = value.split('=')
        query[list[0]] = list[1]
    })

    return {
        path,
        query,
    }
}
// query参数转url
export function queryToUrlFun (item) {
    let str = item.path
    let queryList = []
    let queryStr = ''

    for (var i in item.query) {
        queryList.push(i + '=' + item.query[i])
    }
    queryList.forEach((value, index) => {
        queryStr += (index == 0 ? '' : '&') + value
    })
    if (queryStr) {
        str += '?' + queryStr
    }

    return str
}
// 是否是null或undefined
export function isNullOrUndefined (value) {
    return (value === undefined || value === null || value === '')
}
// 获取字典
export function useDict (list = []) {
    let dictType = localStorage.getItem('dictType')
    let dictType_data = {}
    if (!dictType) return
    dictType = JSON.parse(dictType)
    list.forEach((value) => {
        dictType_data[value] = dictType[value]
    })

    return toRefs(dictType_data)
}
// 消息提示管理
export function ElMessageOutput (arg) {
    const _arg = {
        showType: 0, // 提示显示类型，[0：ElMessage 1：ElNotification]
        duration: 3500, // 显示时间，单位为毫秒。 设为 0 则不会自动关闭
        ...arg,
    }
    let fn = null

    switch (_arg.showType) {
        case 0:
            fn = ElMessage
            break
        case 1:
            fn = ElNotification
            break
    }

    fn({
        ..._arg,
    })
}

// 动态加载js
export function loadJS (url, callback) {
    var script = document.createElement('script'),
        fn = callback || function () {
        }
    script.type = 'text/javascript'
    //IE
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null
                fn()
            }
        }
    } else {
        //其他浏览器
        script.onload = function () {
            fn()
        }
    }
}
