<template>
    <div class="site-sidebar site-sidebar--dark">
        <div class="site-sidebar__inner">
            <el-menu class="site-sidebar__menu" :default-active="menuActiveName || 'home'">
                <el-menu-item index="home" @click="router.push({ name: 'home' })">
                    <template #title>
                        <el-icon><House /></el-icon>
                        <span>首页</span>
                    </template>
                </el-menu-item>
                <indexSidebarSubMenu :menu="item" v-for="(item, index) in menuList" :key="index"></indexSidebarSubMenu>
            </el-menu>
        </div>
    </div>
</template>

<script setup>
import indexSidebarSubMenu from './index-sidebar-sub-menu'
import { storeToRefs } from "pinia"
import { useStorePinia } from '@/store'
import { useRouter } from 'vue-router'

const store = useStorePinia()
let { menuList, menuActiveName } = storeToRefs(store)
const router = useRouter()
</script>

<style scoped>

</style>
