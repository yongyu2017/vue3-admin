<template>
    <el-form :inline="true" :model="formData" @submit.prevent>
        <el-form-item>
            <el-input v-model="formData.name" placeholder="请输入姓名" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchFun">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button @click="addOrUpdateFun()">新增</el-button>
            <el-button type="danger" @click="delFun()" v-hasPermission="['people:goods:delete']">删除</el-button>
        </el-form-item>
    </el-form>

    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="sex" label="性别">
            <template #default="scope">
                {{ codeToLabelComputed(scope.row.sex, sexList) }}
            </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" link @click="addOrUpdateFun(scope.row)">编辑</el-button>
                <el-button type="primary" link @click="delFun(scope.row.id)" v-hasPermission="['people:goods:delete']">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination
        class="el-pagination"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="formData.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="formData.pageSize"
        :total="formData.totalPage"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

     <!-- 员工信息弹窗 -->
     <listAddOrUpdate ref="listAddOrUpdateRef" @refreshDataList="searchFun" @close="listAddOrUpdateVisible= false" v-if="listAddOrUpdateVisible"></listAddOrUpdate>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { personnelPeopleList, personnelDeletePeople } from '@/api/personnel'
import listAddOrUpdate from './list-add-or-update.vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { commonMixin } from '@/mixins/common'
import { deepCopy } from '@/utils/index'
const dayjs = require('dayjs')

const { codeToLabelComputed } = commonMixin()
let defaultDataForm = {
    name: '',
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
}
let formData = ref(deepCopy(defaultDataForm))
let dataList = ref([]);
let idList = ref([]);
let dataListLoading = ref(false);
const listAddOrUpdateRef = ref(null);
let listAddOrUpdateVisible = ref(false);
const sexList = [
    { value: 1, label: '男' },
    { value: 2, label: '女' },
]

onMounted(() => {
    queryList()
})

// 获取员工列表
const queryList = () => {
    dataListLoading.value = true;
    personnelPeopleList({
        name: formData.value.name,
        pageIndex: formData.value.pageIndex,
        pageSize: formData.value.pageSize
    }).then(({ data }) => {
        dataListLoading.value = false;
        data.list.forEach((value) => {
            value['createTime'] = dayjs(value.createTime).format('YYYY-MM-DD HH:mm:ss')
            value['updateTime'] = dayjs(value.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        dataList.value = data.list.slice();
        formData.value.totalPage = data.sum;
    }).catch(() => {
        dataListLoading.value = false;
    })
}
// 重置
const resetSearch = () => {
    formData.value = deepCopy(defaultDataForm)

    searchFun()
}
// 搜索
const searchFun = () => {
    formData.value.pageIndex = 1;
    queryList()
}
// 每页数
const sizeChangeHandle = (val) => {
    formData.value.pageSize = val
    formData.value.pageIndex = 1;
    queryList()
}
// 当前页
const currentChangeHandle = (val) => {
    formData.value.pageIndex = val
    queryList()
}
//selection-change
const handleSelectionChange = (val) => {
    idList.value = val.map(value => value.id)
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
    const ids = id || idList.value.join(',');
    if (!ids) {
        ElMessage.warning('请选择需要删除的数据！')
        return
    }
    ElMessageBox.confirm(
        `确定要删除ID为${ ids }的数据吗?`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {

        const loading = ElLoading.service({
            lock: true,
        })

        personnelDeletePeople({
            id: ids,
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
