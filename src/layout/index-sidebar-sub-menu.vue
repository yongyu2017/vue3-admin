<template>
    <el-sub-menu :index="menu.menuId + ''" v-if="menu.children && menu.children.length> 0">
        <template #title>
            <el-icon v-if="menu.icon">
                <component :is="menu.icon" />
            </el-icon>
            <span>{{ menu.name }}</span>
        </template>

        <indexSidebarSubMenu :menu="item" v-for="(item, index) in menu.children" :key="index"></indexSidebarSubMenu>
    </el-sub-menu>
    <el-menu-item :index="menu.menuId + ''" @click="gotoRouteHandle(menu)" v-else>
        <el-icon v-if="menu.icon">
            <component :is="menu.icon" />
        </el-icon>
        <template #title>
            <span>{{ menu.name }}</span>
        </template>
    </el-menu-item>
</template>

<script setup>
import { defineProps, onMounted, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStorePinia } from '@/store'
import indexSidebarSubMenu from './index-sidebar-sub-menu.vue'

const route = useRoute();
const router = useRouter();
const store = useStorePinia();
const { dynamicMenuRoutes } = storeToRefs(store);
const props = defineProps({
    menu: {
        type: Object,
        required: true
    }
})
const { menu } = toRefs(props);

onMounted(() => {
})
// 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
const gotoRouteHandle = function (menu) {
    const menuToRoute = dynamicMenuRoutes.value.filter((value) => {
        return value.meta.menuId == menu.menuId
    })
    if (menuToRoute.length >= 1) {
        if(menuToRoute[0].name == route.name){
            return
        }
        router.push({
            name: menuToRoute[0].name
        })
    }
}
</script>

<style scoped>
</style>
