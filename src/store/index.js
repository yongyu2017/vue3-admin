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
        loginOut () {
            this.updateMenuList([])
        },
        getUserInfo () {
            return new Promise((resolve) => {
                userGetUserInfo().then(({ data }) => {
                    for (let i in data) {
                        this.userInfo[i] = data[i];
                    }
                    this.permission = data.permission;

                    resolve(data)
                })
            })            
        },
    },
});

export const pinia = createPinia()