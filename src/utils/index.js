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
    let str = ''
    list && list.forEach((value)=> {
        if(value.value === val){
            str = value.label || value.name
        }
    })
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