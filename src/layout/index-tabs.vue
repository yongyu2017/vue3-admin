<template>
    <div class="site-tabs" v-if="route.meta.isTab">
        <el-tabs v-model="tabModel" @tab-click="selectedTabHandle" @tab-remove="removeTabHandle" class="site-content-top--tabs">
            <el-tab-pane v-for="item in mainTabs" :key="item.uuid" :label="item.title" :name="item.uuid" :closable="item.closable"></el-tab-pane>
        </el-tabs>

        <el-dropdown class="site-tabs__tools" :show-timeout="0">
            <span class="icon-box">
                <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="tabsCloseCurrentHandle">关闭当前标签页</el-dropdown-item>
                    <el-dropdown-item @click="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
                    <el-dropdown-item @click="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
                    <el-dropdown-item @click="refreshHandle">刷新当前标签页</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
    import { inject, watch, onMounted, ref, defineExpose } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useStorePinia } from '@/store'
    import { isURL } from '@/utils'
    const lodash = require('lodash')

    const refresh = inject('refresh')
    const route = useRoute()
    const router = useRouter()
    const store = useStorePinia()
    const { mainTabsActiveName, mainTabs } = storeToRefs(store)
    const tabModel = ref('')

    watch(route, (newVal) => {
        routeHandle(newVal)
    })

    onMounted(() => {
        routeHandle({
            name: 'Home',
            path: '/home',
            fullPath: '/home',
            meta: {
                title: '首页',
                isTab: true,
                closable: false,
                keepAlive: true,
                iframeUrl: '',
            },
            query: {},
            params: {},
        })
        routeHandle(route)
    })

    // 路由操作
    function routeHandle (route) {
        const newPage = route.query.newPage == 1 || false // 跳转到同一路由时，是否新开tab页签
        let tab = mainTabs.value.find((value)=> {
            return newPage ? value.fullPath == route.fullPath : value.name == route.name
        })

        if(!tab){
            tab = {
                uuid: 'uuid' + lodash.uniqueId(),
                fullPath: route.fullPath,
                path: route.path,
                name: route.name,
                title: route.query.tabName ? route.query.tabName : route.meta.title,
                closable: route.meta.closable || false,
                type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
                iframeUrl: route.meta.iframeUrl || '',
                keepAlive: route.meta.keepAlive,
                isTab: route.meta.isTab || false,
                params: route.params,
                query: route.query
            }

            mainTabs.value.push(tab)
        } else {
            if (!newPage) {
                const Index = mainTabs.value.findIndex((value)=> {
                    return value.name == route.name
                })
                mainTabs.value[Index].params= route.params
                mainTabs.value[Index].query= route.query
                mainTabs.value[Index].title= route.query.tabName ? route.query.tabName : route.meta.title
            }
        }

        mainTabsActiveName.value = tab.name
        tabModel.value = tab.uuid
    }
    // tabs，刷下当前页
    function refreshHandle() {
        refresh()
    }
    // tabs, 选中tab
    function selectedTabHandle (TabsPaneContext) {
        const tab = mainTabs.value.find((value) => {
            return value.uuid == TabsPaneContext.paneName
        })

        if (tab) {
            if (tab.fullPath == route.fullPath) {
                return
            }
            router.push({
                path: tab.path,
                query: tab.query,
                params: tab.params,
            })
        }
    }
    // tabs, 删除tab
    function removeTabHandle (tabName) {
        mainTabs.value = mainTabs.value.filter((value) => {
            return value.uuid != tabName
        })

        if (mainTabs.value.length > 0) {
            var tab = mainTabs.value[mainTabs.value.length - 1]

            selectedTabHandle({
                paneName: tab.uuid,
            })
        } else {
            router.push({ name: 'Home' })
        }
    }
    // tabs, 关闭当前
    function tabsCloseCurrentHandle () {
        const homeItem = mainTabs.value.find((value) => value.uuid == tabModel.value && value.name == 'Home')
        if (homeItem) return

        removeTabHandle(tabModel.value)
    }
    // tabs, 关闭其它
    function tabsCloseOtherHandle () {
        mainTabs.value = mainTabs.value.filter((value) => {
            return value.uuid == tabModel.value || value.name == 'Home'
        })
    }
    // tabs, 关闭全部
    function tabsCloseAllHandle () {
        mainTabs.value = mainTabs.value.filter((value) => {
            return value.name == 'Home'
        })
        router.push({ name: 'Home' })
    }

    //暴露给父组件使用的方法和数据
    defineExpose({
        tabsCloseCurrentHandle,
    })
</script>

<style lang="scss" scoped>
    .el-card-main {
        position: relative;
    }
</style>

