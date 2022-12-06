// import { defineAsyncComponent } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { ElLoading } from 'element-plus'
import { isURL, clearLoginInfo, menuToTreeMenu } from '@/utils/utils'
import { userMenuList } from '@/api/user'
import { useStorePinia } from "@/store"

// 全局路由(无需嵌套上左右整体布局)
let globalRoutes = [
    { path: '/login', name: 'login', meta: { title: '登录' }, component: () => import("@/views/login/index") },
    // { path: '*', redirect: { name: '404' } },
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
        { path: '/home', component: () => import('@/views/home'), name: 'home', meta: { title: '首页' } },
        { path: '/userInfor', component: () => import('@/views/userInfor'), name: 'userInfor', meta: { title: '用户信息', isTab: true } },
    ],
};
let router = createRouter({
    history: createWebHashHistory(),
    routes: globalRoutes.concat(mainRoutes),
});
let loading = null;

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if(!token && (fnCurrentRouteType(to, globalRoutes) != 'global')){
        clearLoginInfo()
        next({
            name: 'login',
            query: {
                url: encodeURIComponent(to.fullPath),
            },
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
            loading.close()
            const list = menuToTreeMenu(data.menuList)
            console.log(data.menuList)
            
            fnAddDynamicMenuRoutes(list)
            router.options.isAddDynamicMenuRoutes = true;
            const { updateMenuList } = useStorePinia();
            updateMenuList(list || [])

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

    const { updateCommonStore } = useStorePinia();
    updateCommonStore('dynamicMenuRoutes', mainRoutes.children || [])
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')

    function computedMenuRoutes (list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].children && list[i].children.length >= 1) {
                computedMenuRoutes(list[i].children)
            } else {
                list[i].url = list[i].url.replace(/^\//, '')
                let item = {
                    path: list[i].url.replace('/', '-'),
                    component: null,
                    name: list[i].url.replace('/', '-'),
                    meta: {
                        menuId: list[i].menuId,
                        title: list[i].name,
                        isDynamic: true,
                        isTab: true,
                        iframeUrl: ''
                    }
                }
                // url以http[s]://开头, 通过iframe展示
                if (isURL(list[i].url)) {
                    item['path'] = `i-${list[i].menuId}`
                    item['name'] = `i-${list[i].menuId}`
                    item['meta']['iframeUrl'] = list[i].url
                } else {
                    // const routeUrl = '@/views/'+ list[i].url;
                    // item['component'] = () => import(routeUrl)

                    const routeUrl = list[i].url;
                    item['component'] = () => import('@/views/'+ routeUrl)
                }
                routes.push(item)
            }
        }
    }
}
export default router
