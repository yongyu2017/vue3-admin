<template>
    <el-form :inline="true" :model="formData" @submit.prevent>
        <el-form-item>
            <el-input v-model="formData.name" placeholder="请输入商品名称" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item>
            <el-select v-model="formData.parentId" placeholder="请选择" filterable clearable class="inp-dom">
                <el-option
                        v-for="item in parentIdList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchFun">查询</el-button>
            <el-button @click="addOrUpdateFun()">新增</el-button>
        </el-form-item>
    </el-form>

    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="70"></el-table-column>
        <el-table-column prop="code" label="商品编码"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="parentId" label="所属商品">
            <template #default="scope">
                {{ codeToLabelComputed(scope.row.parentId, parentIdList) }}
            </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" link @click="addOrUpdateFun(scope.row.id)">编辑</el-button>
                <el-button type="primary" link @click="delFun(scope.row.id)">删除</el-button>
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

    <!-- 商品弹窗 -->
    <indexAddOrUpdate ref="indexAddOrUpdateRef" @refreshDataList="searchFun" @close="indexAddOrUpdateVisible= false" v-if="indexAddOrUpdateVisible"></indexAddOrUpdate>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import indexAddOrUpdate from './index-add-or-update.vue'
import { goodsWarehousingList, goodsWarehousingDelete, goodsGoodsList } from '@/api/goods'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { commonMixin } from '@/mixins/common'

const dayjs = require('dayjs')

const { codeToLabelComputed } = commonMixin()
let formData = ref({
    name: '',
    parentId: '',
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
})
let dataList = ref([])
let dataListLoading = ref(false)
const indexAddOrUpdateRef = ref(null)
let indexAddOrUpdateVisible = ref(false)
const parentIdList = ref([])

onMounted(() => {
    goodsGoodsListFun()
    queryList()
})

// 获取商品列表
const goodsGoodsListFun = () => {
    goodsGoodsList({
        name: '',
        pageIndex: '',
        pageSize: '',
    }).then(({ data }) => {
        data.list.forEach((value) => {
            value['value'] = value.id
        })
        parentIdList.value = data.list.slice()
    })
}
// 获取员工列表
const queryList = () => {
    dataListLoading.value = true;
    goodsWarehousingList({
        name: formData.value.name,
        parentId: formData.value.parentId,
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
//新增或者修改
const addOrUpdateFun = (id) => {
    indexAddOrUpdateVisible.value = true;
    nextTick(() => {
        indexAddOrUpdateRef.value.init(id)
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

        goodsWarehousingDelete({
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
