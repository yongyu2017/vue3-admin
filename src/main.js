import { createApp } from 'vue'
import { pinia } from './store'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import hasPermission from './directive/hasPermi'
import inputTrimBlur from './directive/inputTrimBlur.js'
import svgIcon from '@/components/svgIcon'
import '@/assets/icon'

// 定义特性标志
window.__VUE_PROD_DEVTOOLS__ = false
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.directive('hasPermission', hasPermission)
app.directive('inputTrimBlur', inputTrimBlur)
app.component('svg-icon', svgIcon)
app.use(pinia)
app.use(ElementPlus, {
    locale: zhCn,
    size:'large'
})
app.use(router).mount('#app')
