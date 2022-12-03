import { createPinia, defineStore } from 'pinia'
import { userGetUserInfo } from '@/api/user'

export const useStorePinia = defineStore('main', {
    state () {
        return {
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
        updateMenuList (val) {
            this.menuList = val.slice();
        },
        updateCommonStore (name, val) {
            this[name] = val;
        },
        loginOut () {
            this.updateMenuList([])
        },
        getUserInfo () {
            return new Promise((resolve) => {
                userGetUserInfo().then(({ data }) => {
                    this.userInfo = { ...data }

                    resolve(data)
                })
            })            
        },
    },
});

export const pinia = createPinia()