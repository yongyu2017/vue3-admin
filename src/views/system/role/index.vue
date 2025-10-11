<template>
    <div class="table-flex-page">
        <el-form :inline="true" :model="formData" label-width="70px" @submit.prevent style="margin-bottom: 12px">
            <el-form-item label="角色名称">
                <el-input v-model="formData.name" placeholder="请输入" clearable class="inp-dom" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchFun">查询</el-button>
                <el-button @click="resetFun">重置</el-button>
            </el-form-item>
        </el-form>

        <div class="table-op-box" style="margin-bottom: 12px">
            <div class="box-l">
                <el-button type="primary" @click="addOrUpdateFun()"><el-icon><Plus /></el-icon><span>新增</span></el-button>
            </div>
        </div>

        <el-table ref="elTableRef" :data="dataList" border v-loading="dataListLoading" style="width: 100%">
            <el-table-column type="index" header-align="center" align="center" label="序号" width="70"></el-table-column>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="角色名称"></el-table-column>
            <el-table-column prop="des" label="角色描述"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间"></el-table-column>
            <el-table-column label="操作" width="120" :fixed="$elTable_fixed_computed('right')">
                <template #default="scope">
                    <el-button type="primary" link @click="addOrUpdateFun(scope.row)">编辑</el-button>
                    <el-button type="danger" link @click="delFun(scope.row.id)" v-if="scope.row.id !== 1">删除</el-button>
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
    </div>

     <!-- 员工信息弹窗 -->
     <indexAddOrUpdate ref="indexAddOrUpdateRef" @refreshDataList="searchFun" @close="indexAddOrUpdateVisible= false" v-if="indexAddOrUpdateVisible"></indexAddOrUpdate>
</template>

<script setup>
import { onMounted, ref, nextTick, defineOptions } from 'vue'
import { userRole, userDeleteRole } from '@/api/user'
import indexAddOrUpdate from './index-add-or-update.vue'
import { ElLoading, ElMessage, ElMessageBox, dayjs } from 'element-plus'
import { elTableScrollMixin } from '@/mixins/elTableScrollMixin.js'
const lodash = require('lodash')

defineOptions({ name: 'SystemRoleIndex' })
const defaultFormData = {
    name: '',
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
}
const formData = ref(lodash.cloneDeep(defaultFormData))
const dataList = ref([]);
const dataListLoading = ref(false);
const indexAddOrUpdateRef = ref(null);
const indexAddOrUpdateVisible = ref(false);
const { elTableRef, $elTable_fixed_computed } = elTableScrollMixin(dataList, dataListLoading)

onMounted(() => {
    queryList()
})

// 获取员工列表
function queryList () {
    dataListLoading.value = true;
    userRole({
        name: formData.value.name,
        pageIndex: formData.value.pageIndex,
        pageSize: formData.value.pageSize
    }).then((res) => {
        dataListLoading.value = false;
        if (res.code == 200) {
            res.data.list.forEach((value) => {
                value['createTime'] = dayjs(value.createTime).format('YYYY-MM-DD HH:mm:ss')
                value['updateTime'] = dayjs(value.updateTime).format('YYYY-MM-DD HH:mm:ss')
            })
            dataList.value = res.data.list.slice();
            formData.value.totalPage = res.data.sum;
        }
    }).catch(() => {
        dataListLoading.value = false;
    })
}
// 重置
function resetFun () {
    formData.value = lodash.cloneDeep(defaultFormData)
    searchFun()
}
// 搜索
function searchFun () {
    formData.value.pageIndex = 1
    queryList()
}
// 每页数
function sizeChangeHandle (val) {
    formData.value.pageSize = val
    formData.value.pageIndex = 1
    queryList()
}
// 当前页
function currentChangeHandle (val) {
    formData.value.pageIndex = val
    queryList()
}
//新增或者修改
function addOrUpdateFun (item) {
    indexAddOrUpdateVisible.value = true;
    nextTick(() => {
        indexAddOrUpdateRef.value.init(item || '')
    })
}
//删除
async function delFun (id) {
    await ElMessageBox.confirm(`确定要删除ID为${ id }的数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
    })

    const loading = ElLoading.service({
        lock: true,
    })

    userDeleteRole({
        id,
    }).then((res) => {
        loading.close()

        if (res.code == 200) {
            ElMessage.success('操作成功')
            queryList()
        }
    }).catch(() => {
        loading.close()
    })
}
</script>

<style>

</style>
