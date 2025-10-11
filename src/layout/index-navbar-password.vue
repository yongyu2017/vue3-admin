<template>
    <el-dialog
        @close="closeFun"
        title="修改密码"
        :close-on-click-modal="false"
        v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" @keyup.enter="dataFormSubmit()" label-width="100px">
            <el-form-item label="旧密码" prop="password">
                <el-input type="password" v-model="dataForm.password" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="dataForm.newPassword" placeholder="请输入" class="inp-dom"></el-input>
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
import { ref, reactive, defineEmits, nextTick, defineExpose } from 'vue'
import { ElLoading } from 'element-plus'
import { userChangePassword } from '@/api/system.js'
import { ElMessageOutput } from '@/utils/index.js'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    password: '',
    newPassword: '',
})
const dataRule = reactive({
    password: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
function init () {
    visible.value = true;

    nextTick(() => {
    })
}
// 表单提交
function dataFormSubmit () {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })

            userChangePassword({
                ...dataForm.value
            }).then((res) => {
                loading.close()
                if (res.code == 200) {
                    visible.value = false
                    emit('refreshDataList')
                    ElMessageOutput({
                        message: '操作成功',
                        type: 'success',
                    })
                }
            }).catch(() => {
                loading.close()
            })
        }
    })
}
//关闭
function closeFun () {
    emit('close')
}

//暴露给父组件使用的方法和数据
defineExpose({
    dataForm,
    init,
})
</script>
