<template>
    <el-form :inline="true" :model="formData" @submit.prevent>
        <el-form-item>
            <el-button @click="addOrUpdateFun()">新增</el-button>
        </el-form-item>
    </el-form>

    <el-table :data="dataList" border row-key="id" v-loading="dataListLoading" style="width: 100%">
        <el-table-column prop="menuName" header-align="left" align="left" label="名称"></el-table-column>
        <el-table-column prop="icon" header-align="center" align="center" label="图标">
            <template #default="scope">
                <el-icon v-if="scope.row.icon">
                    <component :is="scope.row.icon" />
                </el-icon>
            </template>
        </el-table-column>
        <el-table-column prop="type" header-align="center" align="center" label="类型">
            <template #default="scope">
                <el-button type="primary" plain v-if="scope.row.type === 0">目录</el-button>
                <el-button type="success" plain v-else-if="scope.row.type === 1">菜单</el-button>
                <el-button type="info" plain v-else>按钮</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="orderNum" header-align="center" align="center" label="排序"></el-table-column>
        <el-table-column prop="jumpUrl" header-align="center" align="center" label="菜单URL"></el-table-column>
        <el-table-column prop="roleUrl" header-align="center" align="center" label="授权标识"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
            <template #default="scope">
                <el-button type="primary" link @click="addOrUpdateFun(scope.row)">编辑</el-button>
                <el-button type="primary" link @click="delFun(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

     <!-- 员工信息弹窗 -->
     <listAddOrUpdate ref="listAddOrUpdateRef" @refreshDataList="queryList" @close="listAddOrUpdateVisible= false" v-if="listAddOrUpdateVisible"></listAddOrUpdate>
</template>

<script setup>
import { onMounted, ref, reactive, nextTick } from 'vue'
import { userNav, userDeleteNav } from '@/api/user'
import listAddOrUpdate from './list-add-or-update.vue'
import { menuToTreeMenu } from '@/utils'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'

let formData = reactive({
    name: '',
})
let dataList = ref([]);
let dataListLoading = ref(false);
const listAddOrUpdateRef = ref(null);
let listAddOrUpdateVisible = ref(false);

onMounted(() => {
    queryList()
})

// 获取列表
const queryList = () => {
    dataListLoading.value = true;
    userNav().then(({ data }) => {
        dataListLoading.value = false;
        dataList.value = menuToTreeMenu(data.menuList);
    }).catch(() => {
        dataListLoading.value = false;
    })
}
//新增或者修改
const addOrUpdateFun = (item) => {
    listAddOrUpdateVisible.value = true;
    nextTick(() => {
        listAddOrUpdateRef.value.init(item || '')
    })
}
//删除
const delFun = (id) => {
    ElMessageBox.confirm(
        `确定要删除ID为${ id }的数据吗?`,
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {

        const loading = ElLoading.service({
            lock: true,
        })

        userDeleteNav({
            id,
        }).then(() => {
            loading.close()
            queryList()

            ElMessage.success('操作成功')
        }).catch(() => {
            loading.close()
        })

    }) 
}
</script>

<style>

</style>
