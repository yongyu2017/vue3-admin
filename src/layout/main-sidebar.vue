<template>
    <div class="site-sidebar site-sidebar--dark">
        <div class="site-sidebar__inner">
            <el-menu class="site-sidebar__menu" :default-active="menuActiveName || 'home'">
                <mainSidebarSubMenu :menu="item" v-for="(item, index) in menuList" :key="index"></mainSidebarSubMenu>
            </el-menu>
        </div>
    </div>
</template>

<script setup>
import mainSidebarSubMenu from './main-sidebar-sub-menu'
import { storeToRefs } from "pinia"
import { useStorePinia } from '@/store'

const store = useStorePinia()
let { menuList, menuActiveName } = storeToRefs(store)
</script>

<style scoped>

</style>
