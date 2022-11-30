<template>
    <el-form :inline="true" :model="formData" @submit.prevent>
        <el-form-item label="姓名">
            <el-input v-model="formData.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchFun">查询</el-button>
        </el-form-item>
    </el-form>

    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
        <el-table-column prop="id" header-align="center" align="center" label="ID">
        </el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="姓名">
        </el-table-column>
        <el-table-column prop="sex" header-align="center" align="center" label="性别">
            <template #default="scope">{{ scope.row.sex == 1 ? '男' : '女' }}</template>
        </el-table-column>
        <el-table-column prop="age" header-align="center" align="center" label="年龄">
        </el-table-column>
    </el-table>

    <el-pagination
        class="el-pagination"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { userUserList } from '@/api/user'

let formData = reactive({
    name: '',
})
let pageIndex = ref(1);
let pageSize = ref(10);
let totalPage = ref(0);
let dataList = ref([]);
let dataListLoading = ref(false);

onMounted(() => {
    queryList()
})

// 获取员工列表
const queryList = () => {
    dataListLoading.value = true;
    userUserList({
        name: formData.name,
        pageIndex: pageIndex.value,
        pageSize: pageSize.value
    }).then(({ data }) => {
        dataListLoading.value = false;
        dataList.value = data.list.slice();
        totalPage.value = data.sum;
    }).catch(() => {
        dataListLoading.value = false;
    })
}
// 搜索
const searchFun = () => {
    pageIndex.value = 1;
    queryList()
}
// 每页数
const sizeChangeHandle = (val) => {
    pageSize.value = val
    pageIndex.value = 1;
    queryList()
}
// 当前页
const currentChangeHandle = (val) => {
    pageIndex.value = val
    queryList()
}
</script>

<style>

</style>
