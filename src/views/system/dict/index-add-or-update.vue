<template>
    <el-dialog @close="closeFun" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible"
        width="30%" >
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px">
            <el-form-item label="字典名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" clearable maxlength="50" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="字典类型" prop="type">
                <el-input v-model="dataForm.type" placeholder="请输入" :disabled="dataForm.id !== ''" clearable maxlength="50" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="dataForm.status" placeholder="请选择" class="inp-dom">
                    <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入" clearable :rows="4" maxlength="2000" show-word-limit />
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
import { dictTypeGet, dictTypeUpdate } from '@/api/system'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    name: '',
    type: '',
    status: '1',
    remark: '',
})
const dataRule = ref({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
const emit = defineEmits(['refreshDataList', 'close'])
const statusList = ref([
    { label: '开启', value: '1' },
    { label: '关闭', value: '0' },
])

function init (id) {
    visible.value = true;
    dataForm.value.id = id || ''

    nextTick(() => {
        if (id) {
            dictTypeGet({
                id,
            }).then((res) => {
                if (res.code == 200) {
                    res.data.status = res.data.status + ''
                    dataForm.value = res.data
                }
            })
        }

    })
}
// 表单提交
async function dataFormSubmit () {
    const valid = await dataFormRef.value.validate((valid) => valid)
    if (!valid) {
        ElMessage.warning('请完善标红字段信息')
        return
    }

    const loading = ElLoading.service({
        lock: true,
    })

    dictTypeUpdate(dataForm.value).then((res) => {
        loading.close()

        if (res.code == 200) {
            visible.value = false
            emit('refreshDataList')
            ElMessage.success('操作成功')
        }
    }).catch(() => {
        loading.close()
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
