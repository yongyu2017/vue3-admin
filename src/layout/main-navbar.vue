<template>
    <div class="site-navbar">
        <div class="site-navbar__header">
            <h1 class="site-navbar__brand">后台管理系统</h1>
        </div>

        <div class="site-navbar__body fix">
            <el-menu class="site-navbar__menu" mode="horizontal" :ellipsis="false">
                <el-menu-item class="site-navbar__avatar" index="1">
                    <el-dropdown :show-timeout="0" placement="bottom">
                        <span class="el-dropdown-link">
                            <img src="~@/assets/img/avatar.png" :alt="userInfo.userName">{{ userInfo.userName }}
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
import { ElMessageBox } from 'element-plus'
import { clearLoginInfo } from '@/utils/utils'
import { storeToRefs } from "pinia"
import { useStorePinia } from "@/store"
import { useRouter } from 'vue-router'

const store = useStorePinia()
const { userInfo } = storeToRefs(store)
const router = useRouter()

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
</script>

<style scoped>
</style>
