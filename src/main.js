import { createApp } from 'vue'
import { pinia } from './store'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import hasPermission from './directive/hasPermi'
import svgIcon from '@/components/svgIcon'
import '@/assets/icon'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.directive('hasPermission', hasPermission)
app.component('svg-icon', svgIcon)
app.use(pinia)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(router).mount('#app')
