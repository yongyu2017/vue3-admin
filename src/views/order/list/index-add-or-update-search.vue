<template>
    <div v-loading="dataListLoading">
        <el-form :model="formData" @keyup.enter="searchFun()" @submit.prevent>
            <el-form-item>
                <el-input v-model="formData.name" placeholder="商品编码/商品名称" clearable :prefix-icon="Search" @clear="dataList = []" />
            </el-form-item>
        </el-form>

        <el-table :data="dataList" border max-height="200" style="width: 100%" v-if="dataList.length > 0">
            <el-table-column prop="id" label="ID" fixed="left" width="70"></el-table-column>
            <el-table-column prop="code" label="商品编码" fixed="left"></el-table-column>
            <el-table-column prop="name" label="商品名称" fixed="left"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" link @click="selectedFun(scope.row)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { goodsWarehousingList } from '@/api/goods'
import { deepCopy } from '@/utils/index'

const emit = defineEmits(['change'])
const defaultDataForm = {
    name: '',
}
const formData = ref(deepCopy(defaultDataForm))
const dataList = ref([])
const dataListLoading = ref(false)

// 获取列表
const queryList = () => {
    dataListLoading.value = true;
    goodsWarehousingList({
        ...formData.value,
    }).then(({ data }) => {
        dataListLoading.value = false;
        dataList.value = data.list.slice();
        console.log(dataList.value)
    }).catch(() => {
        dataListLoading.value = false;
    })
}
// 搜索
const searchFun = () => {
    queryList()
}
// 选择
const selectedFun = (item) => {
    emit('change', item)
}
</script>

<style>

</style>
