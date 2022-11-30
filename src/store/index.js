import { createPinia, defineStore } from 'pinia';

export const useStorePinia = defineStore('main', {
    state () {
        return {
            token: localStorage.getItem('token') || '',
            userInfo: {},
            menuList: [],
            dynamicMenuRoutes: [],
            menuActiveName: '',
            mainTabs: [],
            mainTabsActiveName: '',
            documentClientHeight: 0,
        };
    },
    actions: {
        setToken (val) {
            this.token = val;
            localStorage.setItem('token', val)
        },
        setUserInfo (val) {
            this.userInfo = val;
        },
        updateMenuList (val) {
            this.menuList = val.slice();
        },
        updateCommonStore (name, val) {
            this[name] = val;
        },
        loginOut () {
            this.setToken('')
            this.setUserInfo({})
            this.updateMenuList([])
        },
    },
});

export const pinia = createPinia()