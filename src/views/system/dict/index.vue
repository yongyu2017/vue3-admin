<template>
    <!-- 角色管理 -->
    <el-form :inline="true" :model="formData" @submit.prevent @keyup.enter="searchFun">
        <el-form-item label="字典名称：">
            <el-input v-model="formData.name" placeholder="请输入" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item label="字典类型：">
            <el-input v-model="formData.type" placeholder="请输入" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchFun">查询</el-button>
            <el-button @click="resetFun()">重置</el-button>
            <el-button @click="lisDataFun()">字典数据查询</el-button>
        </el-form-item>
    </el-form>

    <div>
        <el-button type="primary" :icon="Plus" @click="addOrUpdateFun()">新增</el-button>
    </div>

    <el-table header-cell-class-name="table-cell-header" :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top: 20px;">
        <el-table-column type="index" header-align="center" align="center" label="序号" width="70"></el-table-column>
        <el-table-column prop="name" label="字典名称"></el-table-column>
        <el-table-column prop="type" label="字典类型"></el-table-column>
        <el-table-column prop="status" label="状态">
            <template #default="scope">
                <span v-if="scope.row.status == 1">开启</span>
                <span v-else>关闭</span>
            </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
                <el-button type="primary" link @click="addOrUpdateFun(scope.row.id)">编辑</el-button>
                <el-button type="primary" link @click="lisDataFun(scope.row.type)">字典数据</el-button>
                <el-button type="primary" link @click="delFun(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination class="el-pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"
                   :current-page="formData.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="formData.pageSize"
                   :total="formData.totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 新增和编辑弹框 -->
    <indexAddOrUpdate ref="indexAddOrUpdateRef" @refreshDataList="searchFun" @close="indexAddOrUpdateVisible= false"
                     v-if="indexAddOrUpdateVisible"></indexAddOrUpdate>
    <!-- 字典数据 -->
    <indexData ref="indexDataRef" @close="indexDataVisible= false" v-if="indexDataVisible"></indexData>


</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { dictTypePage, dictTypeDelete } from '@/api/system'
import indexAddOrUpdate from './index-add-or-update.vue'
import indexData from './index-data.vue'
import { dayjs, ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { deepCopy } from '@/utils/index'

const defaultFormData = {
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
    name: '',
    type: '',
}
const formData = ref(deepCopy(defaultFormData));
const dataList = ref([]);
const dataListLoading = ref(false);
const indexAddOrUpdateRef = ref(null);
const indexAddOrUpdateVisible = ref(false);
const indexDataRef = ref(null);
const indexDataVisible = ref(false);

onMounted(() => {
    queryList()
})

const queryList = () => {
    dataListLoading.value = true;
    dictTypePage(formData.value).then(({ data }) => {
        dataListLoading.value = false;
        data.list.forEach((value) => {
            value['createTime'] = value.createTime ? dayjs(value.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
        })
        dataList.value = data.list.slice();
        formData.value.totalPage = data.sum;
    }).catch(() => {
        dataListLoading.value = false;
    })
}
// 搜索
const searchFun = () => {
    formData.value.pageIndex = 1;
    queryList()
}
// 重置
const resetFun = () => {
    formData.value.value = deepCopy(defaultFormData)
    queryList();
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
//新增或者修改
const addOrUpdateFun = (id) => {
    indexAddOrUpdateVisible.value = true;
    nextTick(() => {
        indexAddOrUpdateRef.value.init(id || '')
    })
}
// 数据字段
const lisDataFun = (type) => {
    indexDataVisible.value = true;
    nextTick(() => {
        indexDataRef.value.init(type)
    })
}
//删除
const delFun = (data) => {
    ElMessageBox.confirm(`确定要删除'${data.name}'的数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
    }).then(() => {
        const loading = ElLoading.service({ lock: true })
        dictTypeDelete({ id: data.id }).then(() => {
            loading.close()
            queryList()
            ElMessage.success('操作成功')
        }).catch(() => {
            loading.close()
        })
    })
}
</script>

<style></style>
