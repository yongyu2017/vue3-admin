<template>
    <div class="site-navbar">
        <div class="site-navbar__header">
            <h1 class="site-navbar__brand" title="后台管理系统">后台管理系统</h1>
        </div>

        <div class="site-navbar__body fix">
            <div class="site-navbar__body-left">
                <el-button :icon="isExpand? 'Fold' : 'Expand'" class="expand-btn" @click="isExpand = !isExpand"></el-button>
            </div>

            <el-menu class="site-navbar__menu" mode="horizontal" :ellipsis="false">
                <el-menu-item class="site-navbar__avatar" @click="changeFullscreen">
                    <svg-icon :icon="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" class="svg-icon-dom"></svg-icon>
                </el-menu-item>
                <el-menu-item class="site-navbar__avatar">
                    <el-dropdown :show-timeout="0" placement="bottom">
                        <span class="el-dropdown-link">
                            <img src="~@/assets/img/avatar.png" :alt="userInfo.name">{{ userInfo.name }}
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu >
                                <el-dropdown-item @click="navigatorFun">用户信息</el-dropdown-item>
                                <el-dropdown-item @click="logoutHandle">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { clearLoginInfo, Fullscreen } from '@/utils'
import { storeToRefs } from "pinia"
import { useStorePinia } from "@/store"
import { useRouter } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'  // eslint-disable-line

const store = useStorePinia()
const { userInfo, isExpand } = storeToRefs(store)
const router = useRouter()
let isFullscreen = ref(false);

onMounted(() => {
    document.addEventListener('fullscreenchange', () => {
        isFullscreen.value = document.fullscreenElement ? true : false;
    })
})

// 退出
const logoutHandle = () => {
    ElMessageBox.confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        clearLoginInfo()
        router.push({ name: 'login' })
    }).catch(() => {})
}
// 跳转到用户信息页
const navigatorFun = () => {
    router.push({ name: 'userInfor' })
}
// 全屏切换
const changeFullscreen = () => {
    isFullscreen.value ? Fullscreen.exitFullscreen() : Fullscreen.launchFullscreen(document.documentElement)
}
</script>

<style lang="scss" scoped>
.site-navbar__body{
    .el-menu--horizontal{
        border-bottom: 0;
        .svg-icon-dom{
            font-size: 16px;
        }
    }
    .site-navbar__body-left{
        display: inline-block;
        padding-top: 9px;
        .expand-btn{
            font-size: 16px;
            border: 0;
            border-radius: 0;
        }
    }
    .el-menu--horizontal>.el-menu-item.is-active{
        color: #606266 !important;
    }
}
</style>
