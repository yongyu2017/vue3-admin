import { createPinia, defineStore } from 'pinia'
import { userGetUserInfo } from '@/api/user'

export const useStorePinia = defineStore('main', {
    state () {
        return {
            token: sessionStorage.getItem('token') || '',
            userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {},
            permission: [],  //权限
            menuList: [],  //右侧菜单
            dynamicMenuRoutes: [],  //动态路由
            mainTabs: [],  //tab列表
            mainTabsActiveName: 'Home',  //tab选中值
            documentClientWidth: 0,
            documentClientHeight: 0,
            resizeNumber: 0,
            isExpand: true,
            isMobile: false,
            dictType: localStorage.getItem('dictType') ? JSON.parse(localStorage.getItem('dictType')) : {}, // 数据字典
        };
    },
    getters : {
        //右侧菜单选中值
        menuActiveName () {
            let str = this.mainTabsActiveName
            this.dynamicMenuRoutes.forEach((value) => {
                if (value.name == this.mainTabsActiveName && this.mainTabsActiveName != '') {
                    str = value.meta.menuId + ''
                }
            })

            return str
        },
    },
    actions: {
        setToken (val) {
            this.token = val;
            sessionStorage.setItem('token', val)
        },
        setUserInfo (val) {
            this.userInfo = val;
            sessionStorage.setItem('userInfo', JSON.stringify(val))
        },
        updateCommonStore (name, val) {
            this[name] = val;
        },
        resetStore () {
            this.token = '';
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('userInfo')
            this.userInfo = {};
            this.permission = [];
            this.menuList = [];
            this.dynamicMenuRoutes = [];
            this.mainTabs = [];
            this.mainTabsActiveName = '';
        },
        async getUserInfo () {
            const { data } = await userGetUserInfo();
            for (let i in data) {
                this.userInfo[i] = data[i]
            }
            this.permission = data.permission

            return data
        },
    },
});

export const pinia = createPinia()
