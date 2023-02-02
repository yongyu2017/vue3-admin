<template>
    <el-dialog
        @close="closeFun"
        :title="!dataForm.id ? '新增' : '修改'"
        :close-on-click-modal="false"
        v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" @keyup.enter="dataFormSubmit()" label-width="100px">
            <el-form-item label="姓名：" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
                <el-select v-model="dataForm.sex" class="inp-dom">
                    <el-option label="男" :value="1" />
                    <el-option label="女" :value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="年龄：" prop="age">
                <el-input v-model="dataForm.age" placeholder="请输入" class="inp-dom"></el-input>
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
import { ElLoading, ElMessage } from 'element-plus'
import { personnelAddOrModifyPeople, personnelGetPeople } from '@/api/personnel'

const dataFormRef = ref();
let visible = ref(false);
let dataForm = ref({
    id: '',  //修改时填写
    name: '',
    sex: '',
    age: '',
})
const dataRule = reactive({
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'change' },
    ],
    age: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
    ],
})
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
var init = (item) => {
    visible.value = true;

    nextTick(() => {
        if (item) {
            personnelGetPeople({
                id: item.id,
            }).then(({ data }) => {
                dataForm.value = data;
            })
        }
    })
}

// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })

            personnelAddOrModifyPeople({
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
