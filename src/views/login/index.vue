<template>
    <el-form ref="dataFormRef" :inline="true" :model="dataForm" :rules="dataRule" label-width="80px" hide-required-asterisk
        @keyup.enter="loginFun()" @submit.prevent>
        <el-form-item label="帐号" prop="name">
            <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
            <el-input type="pwd" v-model="dataForm.pwd"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="loginFun">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from "vue-router"
import { ElLoading } from 'element-plus'
import { userLogin } from '@/api/user'
import { useStorePinia } from '@/store'

const route = useRoute()
const router = useRouter()
const store = useStorePinia()
const { setToken, setUserInfo } = store
const dataForm = reactive({
    name: 'admin',
    pwd: '123456',
})
const dataRule = reactive({
    name: [
        { required: true, message: '请输入帐号', trigger: 'blur' }
    ],
    pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
})
const dataFormRef = ref(null);

onMounted(() => {
    // console.log(dataFormRef.value)
})

//登录
const loginFun = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {

            var loading = ElLoading.service({
                lock: true,
            })

            userLogin({
                name: dataForm.name,
                pwd: dataForm.pwd,
            }).then(({ data }) => {
                loading.close()
                setToken(data.token)
                setUserInfo(data)
                router.replace({
                    path: route.query.url ? decodeURIComponent(route.query.url) : '/home'
                })
            }).catch(() => {
                loading.close()
            })

        }
    })
}
</script>

<style>
</style>
