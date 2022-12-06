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
            </template>
        </el-table-column>
    </el-table>

     <!-- 员工信息弹窗 -->
     <listAddOrUpdate ref="listAddOrUpdateRef" @refreshDataList="queryList" @close="listAddOrUpdateVisible= false" v-if="listAddOrUpdateVisible"></listAddOrUpdate>
</template>

<script setup>
import { onMounted, ref, reactive, nextTick } from 'vue'
import { userNav } from '@/api/user'
import listAddOrUpdate from './list-add-or-update.vue'
import { menuToTreeMenu } from '@/utils/utils'
// import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
// const dayjs = require('dayjs')

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
</script>

<style>

</style>
