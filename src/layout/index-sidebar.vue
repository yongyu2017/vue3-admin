<template>
    <div class="site-sidebar site-sidebar--dark">
        <div class="site-sidebar__inner">
            <el-menu class="site-sidebar__menu" :default-active="menuActiveName || '1'" :collapse="!isExpand">
                <el-menu-item index="Home" class="menu-item-box" title="后台首页" @click="goHomeFun">
                    <div class="icon-box">
                        <el-icon><House /></el-icon>
                    </div>
                    <template #title>
                        <span class="txt">后台首页</span>
                    </template>
                </el-menu-item>
                <indexSidebarSubMenu :menu="item" v-for="(item, index) in menuList" :key="index"></indexSidebarSubMenu>
            </el-menu>
        </div>
    </div>
</template>

<script setup>
    import indexSidebarSubMenu from './index-sidebar-sub-menu'
    import { storeToRefs } from 'pinia'
    import { useStorePinia } from '@/store'
    import { useRouter } from 'vue-router'

    const store = useStorePinia()
    let { menuList, menuActiveName, isExpand } = storeToRefs(store)
    const router = useRouter()

    function goHomeFun () {
        router.push({ name: 'Home' })
    }
</script>

<style lang="scss" scoped>
.el-menu--collapse{
    border-right: 0;
}
</style>
