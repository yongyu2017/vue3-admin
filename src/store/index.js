import { createPinia, defineStore } from 'pinia'
import { userGetUserInfo } from '@/api/user'

export const useStorePinia = defineStore('main', {
    state () {
        return {
            userInfo: {
            },
            permission: [],
            menuList: [],
            dynamicMenuRoutes: [],
            menuActiveName: '',
            mainTabs: [],
            mainTabsActiveName: '',
            documentClientHeight: 0,
        };
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
            this.menuActiveName = '';
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