<template>
    <el-form :inline="true" :model="formData" @submit.prevent>
        <el-form-item>
            <el-input v-model="formData.name" placeholder="请输入账号" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchFun">查询</el-button>
            <el-button @click="addOrUpdateFun()">新增</el-button>
        </el-form-item>
    </el-form>
    
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column prop="username" label="昵称"></el-table-column>
        <el-table-column prop="role" label="角色">
            <template #default="scope">{{ roleStr(scope.row.role) }}</template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" link @click="addOrUpdateFun(scope.row)">编辑</el-button>
                <el-button type="primary" link @click="delFun(scope.row.id)" v-if="scope.row.id !== 1">删除</el-button>
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
import { onMounted, ref, nextTick, computed } from 'vue'
import { userUserList, userDeleteUser, userRole } from '@/api/user'
import listAddOrUpdate from './list-add-or-update.vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
const dayjs = require('dayjs')

let formData = ref({
    name: '',
})
let pageIndex = ref(1);
let pageSize = ref(10);
let totalPage = ref(0);
let dataList = ref([]);
let dataListLoading = ref(false);
const roleList = ref([]);
const listAddOrUpdateRef = ref(null);
let listAddOrUpdateVisible = ref(false);

const roleStr = computed(() => {
    return (val) => {
        let str = '';
        roleList.value.forEach((value) => {
            if (val == value.id) {
                str = value.name;
            }
        })
        return str
    }
})

onMounted(() => {
    userRoleFun()
    queryList()
})

// 获取员工列表
const queryList = () => {
    dataListLoading.value = true;
    userUserList({
        name: formData.value.name,
        pageIndex: pageIndex.value,
        pageSize: pageSize.value
    }).then(({ data }) => {
        dataListLoading.value = false;
        data.list.forEach((value) => {
            value['createTime'] = dayjs(value.createTime).format('YYYY-MM-DD HH:mm:ss')
            value['updateTime'] = dayjs(value.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        dataList.value = data.list.slice();
        totalPage.value = data.sum;
    }).catch(() => {
        dataListLoading.value = false;
    })
}
// 获取角色列表
const userRoleFun = () => {
    userRole({
        name: '',
        pageIndex: 1,
        pageSize: 1000
    }).then(({ data }) => {
        roleList.value = data.list.slice();
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

        userDeleteUser({
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
