<template>
    <el-form :inline="true" :model="formData" @submit.prevent>
        <el-form-item>
            <el-input v-model="formData.name" placeholder="请输入姓名" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchFun">查询</el-button>
            <el-button @click="addOrUpdateFun()">新增</el-button>
            <el-button type="danger" @click="delFun()">删除</el-button>
        </el-form-item>
    </el-form>

    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column prop="id" header-align="center" align="center" label="ID"></el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="姓名"></el-table-column>
        <el-table-column prop="sex" header-align="center" align="center" label="性别"></el-table-column>
        <el-table-column prop="age" header-align="center" align="center" label="年龄"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
            <template #default="scope">
                <el-button type="primary" link @click="addOrUpdateFun(scope.row)">编辑</el-button>
                <el-button type="primary" link @click="delFun(scope.row.id)">删除</el-button>
            </template>
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

     <!-- 员工信息弹窗 -->
     <listAddOrUpdate ref="listAddOrUpdateRef" @refreshDataList="searchFun" @close="listAddOrUpdateVisible= false" v-if="listAddOrUpdateVisible"></listAddOrUpdate>
</template>

<script setup>
import { onMounted, ref, reactive, nextTick } from 'vue'
import { userUserList, userDeletePeople } from '@/api/user'
import listAddOrUpdate from './list-add-or-update.vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'

let formData = reactive({
    name: '',
})
let pageIndex = ref(1);
let pageSize = ref(10);
let totalPage = ref(0);
let dataList = ref([]);
let idList = ref([]);
let dataListLoading = ref(false);
const listAddOrUpdateRef = ref(null);
let listAddOrUpdateVisible = ref(false);

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

        userDeletePeople({
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
