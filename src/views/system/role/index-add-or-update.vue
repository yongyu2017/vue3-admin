<template>
    <el-dialog @close="closeFun" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="des">
                <el-input v-model="dataForm.des" placeholder="请输入" :rows="3" type="textarea"
                    class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="角色权限" prop="permission">
                <el-tree ref="treeRef"
                    style="width: 100%"
                    :data="permissionList"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    highlight-current
                    check-on-click-node
                    :expand-on-click-node="false"
                    :check-strictly="true"
                    @check="treeCheck"
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
import { ref, defineEmits, nextTick, defineExpose } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { userGetRole, userAddOrModifyRole, userNav } from '@/api/user'
import { menuToTreeMenu } from '@/utils'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    name: '',
    des: '',
    permission: [],
})
const dataRule = ref({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
const treeRef = ref(null);
const permissionList = ref([]);
const defaultProps = {
    children: 'children',
    label: 'label',
}
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
function init (item) {
    visible.value = true;

    nextTick(async () => {
        await userNavFun()
        if (item) {
            userGetRole({
                id: item.id,
            }).then((res) => {
                if (res.code == 200) {
                    res.data['permission'] = res.data['permission'] ? res.data['permission'].split(',') : []
                    dataForm.value = res.data

                    treeRef.value.setCheckedKeys(dataForm.value.permission, false)
                }
            })
        }
    })
}
// 获取权限列表
async function userNavFun () {
    await userNav().then((res) => {
        if (res.code == 200) {
            res.data.menuList.forEach((value) => {
                value['value'] = value.id
                value['label'] = value.menuName
            })
            permissionList.value = menuToTreeMenu(res.data.menuList)
        }
    })
}
// 权限树节点check
function treeCheck (e) {
    let childIds = []
    let checkedList = treeRef.value.getCheckedKeys(false)
    findTarget(e.id, permissionList.value)
    const isCheck = checkedList.includes(e.id)  // 是否选中
    if (isCheck) {
        checkedList.push(...childIds)
        checkedList = checkedList.filter((value, index, array) => {
            return array.indexOf(value) === index
        })
    } else {
        checkedList = checkedList.filter((value) => {
            return !childIds.includes(value)
        })
    }
    treeRef.value.setCheckedKeys(checkedList, false)

    function findTarget(id, list) {
        list.forEach((value) => {
            if (value.id === id) {
                (value.children && value.children) && (findChildIds(id, value.children))
                return
            }
            if (value.children && value.children) {
                findTarget(id, value.children)
            }
        })
    }
    function findChildIds (id, list) {
        list.forEach((value) => {
            childIds.push(value.id)
            if (value.children && value.children) {
                findChildIds(id, value.children)
            }
        })
    }
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

    dataForm.value.permission = treeRef.value.getCheckedKeys(false).join(',');

    userAddOrModifyRole({
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
