<template>
    <el-sub-menu :index="menu.menuId + ''" v-if="menu.children && menu.children.length> 0">
        <template #title>
            <div class="menu-item-box" :title="menu.name">
                <div class="icon-box">
                    <el-icon v-if="menu.icon">
                        <component :is="menu.icon" />
                    </el-icon>
                    <!--<i :class="['iconfont', menu.icon]" v-if="menu.icon"></i>-->
                </div>
                <span class="txt">{{ menu.name }}</span>
            </div>
        </template>

        <indexSidebarSubMenu :menu="item" v-for="(item, index) in menu.children" :key="index"></indexSidebarSubMenu>
    </el-sub-menu>
    <el-menu-item :index="menu.menuId + ''" class="menu-item-box" :title="menu.name" @click="gotoRouteHandle(menu)" v-else>
        <div class="icon-box">
            <el-icon v-if="menu.icon">
                <component :is="menu.icon" />
            </el-icon>
            <!--<i :class="['iconfont', menu.icon]" v-if="menu.icon"></i>-->
        </div>
        <template #title>
            <span class="txt">{{ menu.name }}</span>
        </template>
    </el-menu-item>
</template>

<script setup>
import { defineProps, toRefs } from 'vue'
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

// 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
function gotoRouteHandle (menu) {
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

<style lang="scss" scoped>
</style>
