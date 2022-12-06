<template>
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter="loginFun()" @submit.prevent class="login-form">
        <el-form-item label="姓名：" prop="userName">
            <el-input v-model="dataForm.userName" class="inp-dom"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
            <el-select v-model="dataForm.sex" placeholder="请选择" class="inp-dom">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitFun">修改</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useStorePinia } from "@/store"
import { ElLoading } from 'element-plus'
import { userSetUserInfo } from '@/api/user'

const store = useStorePinia()
const { getUserInfo } = store;
const dataFormRef = ref();
let dataForm = ref({
    name: '',
    sex: '',
})
const dataRule = reactive({
    userName: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    sex: [
        { required: true, message: '请选择', trigger: 'change' },
    ],
});

onMounted(() => {
    userGetUserInfoFun()
})

//获取当前用户信息
const userGetUserInfoFun = async () => {
    const data = await getUserInfo();
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
</script>

<style>
</style>
