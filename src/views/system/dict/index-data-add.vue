<template>
    <el-dialog @close="closeFun" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible"
               width="30%" >
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px">
            <el-form-item label="数据标签：" prop="label">
                <el-input v-model="dataForm.label" placeholder="请输入" clearable maxlength="50" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="数据键值" prop="value">
                <el-input v-model="dataForm.value" placeholder="请输入" clearable maxlength="50" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="显示排序" prop="sort">
                <el-input-number
                    v-model="dataForm.sort"
                    :min="0"
                    :max="1000"
                    controls-position="right"
                />
            </el-form-item>
            <el-form-item label="状态:" prop="status">
                <el-select v-model="dataForm.status" placeholder="请选择" class="inp-dom">
                    <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
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
import { ref, reactive, defineEmits, nextTick, defineExpose } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { dictDataGet, dictDataUpdate } from '@/api/system'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    label: '',
    value: '',
    sort: 0,
    status: '1',
    remark: '',
    dictType: '',
})
const dataRule = reactive({
    label: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    value: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    sort: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
const emit = defineEmits(['refreshDataList', 'close'])
const statusList = ref([
    { label: '开启', value: '1' },
    { label: '关闭', value: '0' },
])

var init = (dictType, id) => {
    visible.value = true;
    dataForm.value.id = id || ''
    dataForm.value.dictType = dictType || ''

    nextTick(() => {
        if (id) {
            dictDataGet({
                id,
            }).then((res) => {
                res.data.status = res.data.status + ''
                dataForm.value = res.data
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

            dictDataUpdate(dataForm.value).then(() => {
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
    init,
})
</script>

<style lang="scss" scoped>
</style>
