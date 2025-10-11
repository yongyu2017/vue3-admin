<template>
    <el-dialog
        @close="closeFun"
        :title="!dataForm.id ? '新增' : '修改'"
        :close-on-click-modal="false"
        v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="70px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="dataForm.sex" class="inp-dom">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in sexList" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
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
import { ref, defineEmits, nextTick, defineExpose } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { personnelAddOrModifyPeople, personnelGetPeople } from '@/api/personnel'
import { storeToRefs } from 'pinia'
import { useStorePinia } from "@/store"

const emit = defineEmits(['refreshDataList', 'close'])
const visible = ref(false);
const dataFormRef = ref();
const dataForm = ref({
    id: '',  //修改时填写
    name: '',
    sex: '',
    age: '',
})
const dataRule = ref({
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
const store = useStorePinia()
const { dictType } = storeToRefs(store)
const sexList = ref(dictType.value['sex'])

// eslint-disable-next-line
function init (item) {
    visible.value = true;

    nextTick(() => {
        if (item) {
            personnelGetPeople({
                id: item.id,
            }).then((res) => {
                if (res.code == 200) {
                    res.data.sex = res.data.sex + ''
                    dataForm.value = res.data;
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

    personnelAddOrModifyPeople({
        ...dataForm.value
    }).then((res) => {
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
