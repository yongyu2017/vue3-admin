export const interRoute = [
    { path: '/home', component: () => import('@/views/home'), name: 'home', meta: { title: '首页' } },
    { path: '/userInfor', component: () => import('@/views/userInfor'), name: 'userInfor', meta: { title: '用户信息', isTab: true, closable: true } },
].map((value) => {
    return {
        path: value.path,
        component: () => import('@/views' + value.path),
        name: (function () {
            return value.path.split('/').map((value2) => {
                return value2.slice(0, 1).toUpperCase() + value2.slice(1)
            }).join('')
        })(),
        meta: value.meta,
    }
})

