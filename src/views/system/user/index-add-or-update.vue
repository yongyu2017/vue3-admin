<template>
    <el-dialog @close="closeFun" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px">
            <el-form-item label="账号" prop="account">
                <el-input v-model="dataForm.account" placeholder="请输入" :disabled="dataForm.id != ''" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
                <el-input v-model="dataForm.pwd" placeholder="请输入" type="password" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="username">
                <el-input v-model="dataForm.username" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-select v-model="dataForm.role" :disabled="dataForm.id === 1" class="inp-dom">
                    <el-option :label="item.name" :value="item.id" v-for="(item, index) in roleList" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="dataForm.email" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="des">
                <el-input v-model="dataForm.des" placeholder="请输入" :rows="3" type="textarea"
                    class="inp-dom"></el-input>
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
import { userGetUser, userAddOrModifyUser, userRole } from '@/api/user'
import { EamilValidator } from '@/utils/validate.js'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    account: '',
    pwd: '',
    username: '',
    role: '',
    email: '',
    des: '',
})
const dataRule = ref({
    account: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    pwd: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    username: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    role: [
        { required: true, message: '请选择', trigger: 'change' },
    ],
    email: [
        { required: true, validator: EamilValidator(), trigger: 'blur' },
    ]
})
const roleList = ref([]);
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
function init (item) {
    visible.value = true

    nextTick(async () => {
        userRoleFun()
        if (item) {
            userGetUser({
                id: item.id,
            }).then((res) => {
                if (res.code == 200) {
                    dataForm.value = res.data
                }
            })
        }
    })
}
// 获取角色列表
function userRoleFun () {
    userRole({
        name: '',
        pageIndex: 1,
        pageSize: 1000
    }).then((res) => {
        if (res.code == 200) {
            roleList.value = res.data.list.slice()
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

    userAddOrModifyUser({
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

<style lang="scss" scoped>

</style>
