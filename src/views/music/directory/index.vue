<template>
    <div style="margin-bottom: 12px">
        <el-button type="primary" :icon="Plus" @click="addOrUpdateFun()">新增</el-button>
    </div>

    <el-table :data="dataList" border row-key="id" v-loading="dataListLoading" style="width: 100%">
        <el-table-column prop="name" header-align="left" align="left" label="名称"></el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" link @click="addOrUpdateFun(scope.row)">编辑</el-button>
                <el-button type="primary" link @click="delFun(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

     <!-- 员工信息弹窗 -->
     <indexAddOrUpdate ref="indexAddOrUpdateRef" @refreshDataList="queryList" @close="indexAddOrUpdateVisible= false" v-if="indexAddOrUpdateVisible"></indexAddOrUpdate>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { musicDirectoryList, musicDirectoryDelete } from '@/api/music'
import indexAddOrUpdate from './index-add-or-update.vue'
import { menuToTreeMenu } from '@/utils'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const dataList = ref([]);
const dataListLoading = ref(false);
const indexAddOrUpdateRef = ref(null);
const indexAddOrUpdateVisible = ref(false);

onMounted(() => {
    queryList()
})

// 获取列表
const queryList = () => {
    dataListLoading.value = true;
    musicDirectoryList().then(({ data }) => {
        dataListLoading.value = false;
        dataList.value = menuToTreeMenu(data.menuList);
    }).catch(() => {
        dataListLoading.value = false;
    })
}
//新增或者修改
const addOrUpdateFun = (item) => {
    indexAddOrUpdateVisible.value = true;
    nextTick(() => {
        indexAddOrUpdateRef.value.init(item || '')
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

        musicDirectoryDelete({
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
