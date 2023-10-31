<template>
    <el-dialog
        @close="closeFun"
        :title="!dataForm.id ? '新增' : '修改'"
        :close-on-click-modal="false"
        v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px">
            <el-form-item label="目录名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select
                    class="inp-dom"
                    v-model="dataForm.parentId"
                    :data="parentIdList"
                    check-strictly
                    filterable
                    :render-after-expand="false">
                </el-tree-select>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="dataForm.sort" :step="1" step-strictly  class="inp-dom" />
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
import { musicDirectoryList, musicDirectoryGet, musicDirectoryAddOrModify } from '@/api/music'
import { menuToTreeMenu } from '@/utils'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    name: '',
    parentId: '',
    sort: 0,
})
const dataRule = ref({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    parentId: [
        { required: true, message: '请选择', trigger: 'change' },
    ],
    sort: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
const parentIdList = ref([]);
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
var init = (item) => {
    visible.value = true;

    nextTick(() => {
        musicDirectoryListFun()
        if (item) {
            musicDirectoryGet({
                id: item.id,
            }).then(({ data }) => {
                dataForm.value = data;
            })
        }
    })
}
// 获取上级菜单
const musicDirectoryListFun = () => {
    musicDirectoryList().then(({ data }) => {
        data.menuList.filter((value) => {
            value['value'] = value.id;
            value['label'] = value.name;
        })
        parentIdList.value = [
            {
                value: 0,
                label: '一级菜单',
                children: menuToTreeMenu(data.menuList),
            }
        ]
    })
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })

            musicDirectoryAddOrModify({
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
.icon-list-box{
    height: 220px;
    overflow-y: auto;
    .el-button--primary{
        color: var(--el-color-white);
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary);
    }
    .el-button{
        font-size: 16px;
    }
    .flex-box{
        display: flex;
        flex-wrap: wrap;
        .item{
            padding: 4px;
        }
    }
}
</style>
