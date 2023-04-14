<template>
    <el-dialog @close="closeFun" title="修改密码" :close-on-click-modal="false" v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px">
            <el-form-item label="旧密码：" prop="oldPwd">
                <el-input v-model="dataForm.oldPwd" placeholder="请输入" type="password" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="pwd">
                <el-input v-model="dataForm.pwd" placeholder="请输入" type="password" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="pwd2">
                <el-input v-model="dataForm.pwd2" placeholder="请输入" type="password" class="inp-dom"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick, defineExpose } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { userModifyPwd } from '@/api/user'

//确认密码
const pwd2Validator = (rule, value, callback) => {
    if (value) {
        if (dataForm.value.pwd == value) {
            callback()
        } else {
            callback(new Error('两次密码不一致！'))
        }
    } else {
        callback(new Error('请输入！'))
    }
}
const dataFormRef = ref();
let visible = ref(false);
let dataForm = ref({
    oldPwd: '',
    pwd: '',
    pwd2: '',
})
const dataRule = ref({
    oldPwd: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    pwd: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    pwd2: [
        { required: true, validator: pwd2Validator, trigger: 'blur' },
    ],
})
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
var init = () => {
    visible.value = true;

    nextTick(() => {
    })
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })

            userModifyPwd({
                ...dataForm.value
            }).then(() => {
                loading.close()
                visible.value = false
                emit('refreshDataList')
                ElMessage.success('操作成功！')
            }).catch(() => {
                loading.close()
            })
        }
    })
}
//关闭
const closeFun = () => {
    emit('close')
}

//暴露给父组件使用的方法和数据
defineExpose({
    dataForm,
    init,
})
</script>

<style lang="scss" scoped>

</style>
