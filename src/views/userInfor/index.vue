<template>
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter="loginFun()" @submit.prevent class="login-form">
        <el-form-item label="账号：" prop="name">
            <el-input v-model="dataForm.name" disabled class="inp-dom"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
            <el-input v-model="dataForm.email" class="inp-dom"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitFun">修改</el-button>
            <el-button type="danger" @click="modifyPwdFun">修改密码</el-button>
        </el-form-item>
    </el-form>

     <!-- 员工信息弹窗 -->
     <indexPasswordModify ref="indexPasswordModifyRef" @close="indexPasswordModifyVisible= false" v-if="indexPasswordModifyVisible"></indexPasswordModify>
</template>

<script setup>
import { reactive, onMounted, ref, nextTick } from 'vue'
import { useStorePinia } from "@/store"
import { ElLoading } from 'element-plus'
import { userSetUserInfo } from '@/api/user'
import { checkEamil }  from '@/utils/utils'
import indexPasswordModify from './index-password-modify.vue'

// 校验邮箱
const emailValidator = (rule, value, callback) => {
    if (value) {
        if (checkEamil(value)) {
            callback()
        }else {
            callback(new Error('请输入正确的邮箱！'))
        }
    } else {
        callback(new Error('请输入邮箱！'))
    }
}

const store = useStorePinia()
const { getUserInfo } = store;
const dataFormRef = ref();
let dataForm = ref({
    name: '',
    email: '',
})
const dataRule = reactive({
    email: [
        { required: true, validator: emailValidator, trigger: 'blur' },
    ]
});
const indexPasswordModifyRef = ref(null)
let indexPasswordModifyVisible = ref(false);

onMounted(() => {
    userGetUserInfoFun()
})

//获取当前用户信息
const userGetUserInfoFun = async () => {
    const data = await getUserInfo();
    console.log(data)
    dataForm.value = data;
}
//修改
const submitFun = () => {
    dataFormRef.value.validate((res) => {
        if (res) {
            const loading = ElLoading.service({
                lock: true,
            })

            userSetUserInfo(dataForm.value).then(() => {
                loading.close()
                userGetUserInfoFun()
            }).catch(() => {
                loading.close()
            })
        }
    })
}
//修改密码
const modifyPwdFun = () => {
    indexPasswordModifyVisible.value = true;
    nextTick(() => {
        indexPasswordModifyRef.value.init()
    })
}
</script>

<style>
</style>
