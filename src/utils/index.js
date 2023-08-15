import { useStorePinia } from '@/store'
import router from '@/router'

export const API_HOST = process.env.NODE_ENV == 'development'? process.env.VUE_APP_BASE_API: process.env.VUE_APP_BASE_URL

//深拷贝
export function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
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

// 校验邮箱地址
export function checkEamil (str) {
    return /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/.test(str)
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
        if (source[i].parentId == 0) {
            result.push(source[i])
        }
    }

    return result
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
export function codeToLabel (val, list){
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
    return str || val
}

// 获取文件后缀数据
export function getSuffix (str) {
    // eslint-disable-next-line
    return str.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)
}

// 动态加载js
export function loadJS (url, callback) {
    var script = document.createElement('script'),
        fn = callback || function(){}

    script.type = 'text/javascript'
    //IE
    if(script.readyState){
        script.onreadystatechange = function(){
            if( script.readyState == 'loaded' || script.readyState == 'complete' ){
                script.onreadystatechange = null
                fn()
            }
        }
    }else{
        //其他浏览器
        script.onload = function(){
            fn()
        }
    }
    script.src = url
    document.getElementsByTagName('head')[0].appendChild(script)
}

// 补零
export function zeroFill (val) {
    return val < 10 ? '0' + val : val
}

// 秒转时分秒
export function secondToTime (time) {
    const h = Math.floor(time / 60 / 60)
    const m = Math.floor(time / 60 % 60)
    const s = time % 60

    return {
        h: zeroFill(h),
        m: zeroFill(m),
        s: zeroFill(s),
        date: zeroFill(h) + ':'+ zeroFill(m) + ':' + zeroFill(s)
    }
}

// blob文件流下载
export function downloadForBlob (file, filename) {
    const blob = new Blob([file])

    let downloadElement = document.createElement('a');
    let href = window.URL.createObjectURL(blob);           //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = filename; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click();                               //点击下载
    document.body.removeChild(downloadElement);            //下载完成移除元素
    window.URL.revokeObjectURL(href);                      //释放掉blob对象
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

// 查找 省份/地区 名称
export function findAreaName(projectArea, projectAreaList) {
    let areaObject = {
        province: '',
        city: '',
        county: '',
        provinceLabel: '',
        cityLabel: '',
        countyLabel: '',
        name: '',
    }
    if (!projectArea) {
        return areaObject
    }
    const areaCodeList = projectArea.split(',')
    let areaList = []

    areaCodeList.forEach((value) => {
        reserveFun(projectAreaList, value)
    })
    function reserveFun(list, val) {
        list.forEach((value) => {
            if (value.code == val) {
                areaList.push({
                    code: value.code,
                    value: value.value,
                })
            } else {
                if (value.children && value.children.length > 0) {
                    reserveFun(value.children, val)
                }
            }
        })
    }

    const province = areaList[0] ? areaList[0] : ''
    const city = areaList[1] ? areaList[1] : ''
    const county = areaList[2] ? areaList[2] : ''
    areaObject.province = province ? province.code : ''
    areaObject.provinceLabel = province ? province.value : ''
    areaObject.city = city ? city.code : ''
    areaObject.cityLabel = city ? city.value : ''
    areaObject.county = county ? county.code : ''
    areaObject.countyLabel = county ? county.value : ''
    areaObject.name = areaObject.provinceLabel + '' + areaObject.cityLabel + '' + areaObject.countyLabel
    return areaObject
}

// null或者undefined转空字符串
export function nullToEmptyString (val) {
    return (val === null || val === undefined) ? '' : val
}

// 树状数据过滤
export function treeNodeRecursive(list) {
    return list.filter((value) => {
        if (value.children && value.children.length > 0) {
            if (value.visible == 1) {
                value.children = treeNodeRecursive(value.children)
                return true
            } else {
                return false
            }
        } else {
            return value.visible == 1
        }
    })
}

/**
 * 校验数字
 * ecimalDigits允许最多多少位小数点，0则校验为整数，-1则不校验
 * positiveNumber是否为正数（Boolean）
 * **/
export function isNumber (val, ecimalDigits, positiveNumber) {
    const regPos = /^[-]?[0-9]+.?[0-9]*$/ //判断是否是数字
    const str = nullToEmptyString(val) + ''
    const pointIndex = str.indexOf('.')  // 小数点位置
    const ecimalDigitsLen = pointIndex != -1 ? str.substr(pointIndex + 1) : '' // 小数点后面的字符串
    const isPositiveNumber = str.indexOf('-') == -1 ? true : false
    let valid = true

    if (!regPos.test(str)) return false
    if (ecimalDigits != -1) {
        if (ecimalDigits) {
            valid = pointIndex == -1 ? true : (ecimalDigitsLen.length <= ecimalDigits)
        } else {
            valid = pointIndex == -1
        }
    }
    if (positiveNumber) {
        valid = isPositiveNumber
    }

    return valid
}
