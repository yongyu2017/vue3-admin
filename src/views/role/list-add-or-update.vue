<template>
    <el-dialog @close="closeFun" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" @keyup.enter="dataFormSubmit()"
            label-width="100px">
            <el-form-item label="角色名称：" prop="name">
                <el-input v-model.trim="dataForm.name" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="角色描述：" prop="des">
                <el-input v-model.trim="dataForm.des" placeholder="请输入" :rows="3" type="textarea"
                    class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="角色权限：" prop="role">
                <el-tree ref="treeRef"
                    class="inp-dom"
                    :data="roleList" 
                    show-checkbox 
                    default-expand-all 
                    node-key="id" 
                    highlight-current
                    check-on-click-node
                    :expand-on-click-node="false"
                    :props="defaultProps" />
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
import { userGetRole, userAddOrModifyRole, userNav } from '@/api/user'
import { menuToTreeMenu } from '@/utils/utils'

const dataFormRef = ref();
let visible = ref(false);
let dataForm = ref({
    id: '',  //修改时填写
    name: '',
    des: '',
    role: [],
})
const dataRule = reactive({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
const treeRef = ref(null);
const roleList = ref([]);
const defaultProps = {
    children: 'children',
    label: 'label',
}
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
var init = (item) => {
    visible.value = true;

    nextTick(async () => {
        await userNavFun()
        if (item) {
            userGetRole({
                id: item.id,
            }).then(({ data }) => {
                data['role'] = data['role'] ? data['role'].split(',') : [];
                dataForm.value = data;

                treeRef.value.setCheckedKeys(dataForm.value.role, false)
            })
        }
    })
}
// 获取权限列表
const userNavFun = async () => {
    await userNav().then(({ data }) => {
        data.menuList.forEach((value) => {
            value['value'] = value.id;
            value['label'] = value.menuName;
        })
        roleList.value = menuToTreeMenu(data.menuList);
    })
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })

            dataForm.value.role = treeRef.value.getCheckedKeys(false).join(',');

            userAddOrModifyRole({
                ...dataForm.value
            }).then(() => {
                loading.close()
                visible.value = false
                emit('refreshDataList')
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
