import { createPinia, defineStore } from 'pinia'
import { userGetUserInfo } from '@/api/user'

export const useStorePinia = defineStore('main', {
    state () {
        return {
            userInfo: {
            },
            permission: [],  //权限
            menuList: [],  //右侧菜单
            dynamicMenuRoutes: [],  //动态路由
            mainTabs: [],  //tab列表
            mainTabsActiveName: '',
            documentClientHeight: 0,
        };
    },
    getters : {
        //右侧菜单选中值
        menuActiveName () {
            let str = '';
            this.dynamicMenuRoutes.forEach((value) => {
                if (value.name == this.mainTabsActiveName) {
                    str = value.meta.menuId + '';
                }
            })
            return str
        },
    },
    actions: {
        updateMenuList (val) {
            this.menuList = val.slice();
        },
        updateCommonStore (name, val) {
            this[name] = val;
        },
        resetStore () {
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
                this.userInfo[i] = data[i];
            }
            this.permission = data.permission;

            return data           
        },
    },
});

export const pinia = createPinia()