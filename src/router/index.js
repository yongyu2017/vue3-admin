// import { defineAsyncComponent } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { ElLoading } from 'element-plus'
import { isURL, clearLoginInfo, menuToTreeMenu } from '@/utils'
import { userMenuList } from '@/api/user'
import { storeToRefs } from 'pinia'
import { useStorePinia } from "@/store"
import { interRoute } from './interRoute.js'

// 全局路由(无需嵌套上左右整体布局)
let globalRoutes = [
    { path: '/login', name: 'login', meta: { title: '登录' }, component: () => import("@/views/login/index") },
    { path: '/404', name: '404', meta: { title: '404' }, component: () => import("@/views/common/404/index") },
];
let mainRoutes = {
    path: '/',
    component: () => import('@/layout/index'),
    name: 'main',
    redirect: { name: 'home' },
    meta: { title: '主入口整体布局' },
    children: [
        // 通过meta对象设置路由展示方式
        // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
        // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
        // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
        ...interRoute,
    ],
};
let router = createRouter({
    history: createWebHashHistory(),
    routes: globalRoutes.concat(mainRoutes),
});
let loading = null;

router.beforeEach((to, from, next) => {
    const store = useStorePinia()
    const { updateCommonStore } = store;
    const { token } = storeToRefs(store);

    if(!token.value && (fnCurrentRouteType(to, globalRoutes) != 'global')){
        clearLoginInfo()
        next({
            name: 'login',
            // query: {
            //     url: encodeURIComponent(to.fullPath),
            // },
            replace: true
        })
        return
    }

    if(router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global'){
        next()
    }else{
        loading = ElLoading.service({
            lock: true,
        })
        userMenuList().then(({ data })=> {
            data.menuList.forEach((value) => {
                value['label'] = value.menuName
                value['component'] = value.url
                value['componentName'] = (function () {
                    return value.component.split('/').map((value2) => {
                        return value2.slice(0, 1).toUpperCase() + value2.slice(1)
                    }).join('')
                })()
                value['isTab'] = true
                value['keepAlive'] = true
                value['closable'] = true
            })
            loading.close()
            const list = menuToTreeMenu(data.menuList)

            fnAddDynamicMenuRoutes(list)
            router.options.isAddDynamicMenuRoutes = true;
            updateCommonStore('menuList', list || [])

            next({ ...to, replace: true })
        }).catch(()=> {
            loading.close()
        })
    }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
    var temp = []
    for (var i = 0; i < globalRoutes.length; i++) {
        if (route.path === globalRoutes[i].path) {
            return 'global'
        } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
            temp = temp.concat(globalRoutes[i].children)
        }
    }
    return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = []) {
    var routes = [];

    computedMenuRoutes(menuList)
    mainRoutes.name = 'main-dynamic';
    mainRoutes.children = routes;
    router.addRoute(mainRoutes)
    router.addRoute({
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    })

    const { updateCommonStore } = useStorePinia();
    updateCommonStore('dynamicMenuRoutes', mainRoutes.children || [])
    // console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    // console.log(mainRoutes.children)
    // console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')

    function computedMenuRoutes (list) {
        list.forEach((value) => {
            if (value.children && value.children.length > 0) {
                computedMenuRoutes(value.children)
            } else {
                let item = {
                    path: value.url, // system/category/index
                    component: null,
                    name: value.componentName,
                    meta: {
                        menuId: value.menuId,
                        title: value.name,
                        isDynamic: true,
                        isTab: value.isTab === undefined ? false : value.isTab,
                        iframeUrl: '',
                        keepAlive: value.keepAlive === undefined ? false : value.keepAlive,
                        closable: true,
                    }
                }
                // url以http[s]://开头, 通过iframe展示
                if (isURL(value.url)) {
                    item['path'] = `i-${ value.menuId }`
                    item['name'] = `i-${ value.menuId }`
                    item['meta']['iframeUrl'] = value.url
                    item['component'] = () => import('@/views/common/iframe')
                } else {
                    // const routeUrl = '@/views/'+ goods[i].url;
                    // item['component'] = () => import(routeUrl)
                    const routeUrl = value.url;
                    item['component'] = () => import('@/views/'+ routeUrl)
                }
                routes.push(item)
            }
        })
    }
}
export default router
