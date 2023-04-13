<template>
    <div class="login-page">
        <h1 class="title">系统登录</h1>

        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" hide-required-asterisk
            @keyup.enter="loginFun()" @submit.prevent class="login-form">
            <el-form-item label="帐号：" prop="name">
                <el-input size="large" v-model="dataForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="pwd">
                <el-input type="password" size="large" v-model="dataForm.pwd"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="dataForm.remember" label="记住密码" size="large" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="large" @click="loginFun" class="login-btn">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
    
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from "vue-router"
import { ElLoading } from 'element-plus'
import { userLogin } from '@/api/user'
import { useStorePinia } from '@/store'
import { Base64 } from 'js-base64'

const route = useRoute()
const router = useRouter()
const store = useStorePinia();
const { setToken } = store;
const dataForm = ref({
    name: '',
    pwd: '',
    remember: true,
})
const dataRule = ref({
    name: [
        { required: true, message: '请输入帐号', trigger: 'blur' }
    ],
    pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
})
const dataFormRef = ref(null);

onMounted(() => {
    if(localStorage.getItem('name')){
        dataForm.value.name = Base64.decode(localStorage.getItem('name'));
        dataForm.value.pwd = Base64.decode(localStorage.getItem('pwd'));
    }
})

//登录
const loginFun = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {

            var loading = ElLoading.service({
                lock: true,
            })

            userLogin({
                name: dataForm.value.name,
                pwd: dataForm.value.pwd,
            }).then(({ data }) => {
                loading.close()
                if(dataForm.value.remember){
                    localStorage.setItem('name', Base64.encode(dataForm.value.name))
                    localStorage.setItem('pwd', Base64.encode(dataForm.value.pwd))
                }else{
                    localStorage.removeItem('name')
                    localStorage.removeItem('pwd')
                }
                setToken(data.token)
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

<style lang="scss" scoped>
.login-page{
    position: fixed;
    z-index: 10;
    top: 50%;
    left: 50%;
    width: 420px;
    padding-bottom: 30px;
    background-color: #fff;
    border-radius: 4px;
    transform: translate(-50%, -50%);
    box-shadow: 0 21px 41px 0 rgba(0,0,0,.2);
    .title{
        text-align: center;
        padding: 40px 0 20px;
        font-size: 26px;
        font-weight: normal;
    }
    /deep/.login-form{
        margin: 0 30px;
        .el-form-item{
            display: block;
            .el-form-item__label, .el-form-item__content{
                display: block;
            }
        }
        .login-btn{
            margin-top: 20px;
            width: 100%;
        }
    }
}
</style>
