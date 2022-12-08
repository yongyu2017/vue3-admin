<template>
    <div :class="['site-content', route.meta.isTab ? 'site-content--tabs' : '']">
        <el-tabs v-if="route.meta.isTab" v-model="tabModel" :closable="true" @tab-click="selectedTabHandle"
            @tab-remove="removeTabHandle">
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

            <el-tab-pane v-for="item in mainTabs" :key="item.name" :label="item.title" :name="item.name"></el-tab-pane>
        </el-tabs>

        <el-card :body-style="siteContentViewHeight">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component"></component>
                </keep-alive>
            </router-view>
        </el-card>
    </div>
</template>

<script setup>
import { inject, watch, onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from "pinia"
import { useStorePinia } from "@/store"
import { isURL } from '@/utils'

const refresh = inject('refresh');
const route = useRoute();
const router = useRouter();
const store = useStorePinia();
const { mainTabsActiveName, documentClientHeight, mainTabs } = storeToRefs(store);
const tabModel = ref('');

watch(route, (newVal) => {
    routeHandle(newVal)
})
const siteContentViewHeight = computed(() => {
    let height = documentClientHeight.value - 50 - 30 - 40;
    if (route.meta.isTab) {
        height -= 40;
        return isURL(route.meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' }
    }
    return { minHeight: height + 'px' }
})
onMounted(() => {
    routeHandle(route)
})
// 路由操作
const routeHandle = function (route) {
    if (route.meta.isTab) {
        let tab = mainTabs.value.filter((value)=> {
                return value.name== route.name
            })[0],
            Index= (()=> {
                let poc= 0;
                mainTabs.value.forEach((value, index)=> {
                    if(value.name === route.name){
                        poc= index
                    }
                })
                return poc
            })();

        if(!tab){
            tab = {
                menuId: route.meta.menuId || route.name,
                name: route.name,
                title: route.meta.title,
                type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
                iframeUrl: route.meta.iframeUrl || '',
                params: route.params,
                query: route.query
            }
            mainTabs.value.push(tab)
        }else{
            mainTabs.value[Index].params= route.params;
            mainTabs.value[Index].query= route.query;
        }

        mainTabsActiveName.value = tab.name;
        tabModel.value = tab.name;
    }
}
// tabs，刷下当前页
const refreshHandle = () => {
    refresh()
}
// tabs, 选中tab
const selectedTabHandle = (TabsPaneContext) => {
    const tab = mainTabs.value.filter((value) => {
        return value.name == TabsPaneContext.paneName
    })[0];

    if (tab) {
        if (tab.name == route.name) {
            return
        }
        router.push({
            name: tab.name,
            query: tab.query,
            params: tab.params,
        })
    }
}
// tabs, 删除tab
const removeTabHandle = (tabName) => {
    mainTabs.value = mainTabs.value.filter((value) => {
        return value.name != tabName
    })

    if (mainTabs.value.length > 0) {
        var tab = mainTabs.value[mainTabs.value.length - 1];

        if (tab.name == route.name) {
            return
        }
        router.push({
            name: tab.name,
            query: tab.query,
            params: tab.params,
        })
    } else {
        router.push({ name: 'home' })
    }
}
// tabs, 关闭当前
const tabsCloseCurrentHandle = () => {
    removeTabHandle(mainTabsActiveName.value)
}
// tabs, 关闭其它
const tabsCloseOtherHandle = () => {
    mainTabs.value = mainTabs.value.filter((value) => {
        return value.name == mainTabsActiveName.value
    })
}
// tabs, 关闭全部
const tabsCloseAllHandle= () => {
    mainTabs.value = [];
    router.push({ name: 'home' })
}
</script>

