<template>
    <div class="table-flex-page">
        <div class="table-op-box" style="margin-bottom: 12px">
            <div class="box-l">
                <el-button type="primary" @click="addOrUpdateFun()"><el-icon><Plus /></el-icon><span>新增</span></el-button>
            </div>
        </div>

        <el-table :data="dataList" border row-key="id" v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="menuName" header-align="left" align="left" label="名称"></el-table-column>
            <el-table-column prop="icon" label="图标">
                <template #default="scope">
                    <el-icon v-if="scope.row.icon">
                        <component :is="scope.row.icon" />
                    </el-icon>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型">
                <template #default="scope">
                    <el-button type="primary" plain v-if="scope.row.type === 0">目录</el-button>
                    <el-button type="success" plain v-else-if="scope.row.type === 1">菜单</el-button>
                    <el-button type="info" plain v-else>按钮</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="orderNum" label="排序"></el-table-column>
            <el-table-column prop="jumpUrl" label="菜单URL"></el-table-column>
            <el-table-column prop="roleUrl" label="授权标识"></el-table-column>
            <el-table-column prop="status" label="菜单状态">
                <template #default="scope">
                    <el-button type="success" plain v-if="scope.row.status == 1">开启</el-button>
                    <el-button type="info" plain v-else>关闭</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="visible" label="显示状态">
                <template #default="scope">
                    <el-button type="success" plain v-if="scope.row.visible == 1">开启</el-button>
                    <el-button type="info" plain v-else>关闭</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" link @click="addOrUpdateFun(scope.row)">编辑</el-button>
                    <el-button type="danger" link @click="delFun(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

     <!-- 员工信息弹窗 -->
     <indexAddOrUpdate ref="indexAddOrUpdateRef" @refreshDataList="queryList" @close="indexAddOrUpdateVisible= false" v-if="indexAddOrUpdateVisible"></indexAddOrUpdate>
</template>

<script setup>
import { onMounted, ref, nextTick, defineOptions } from 'vue'
import { userNav, userDeleteNav } from '@/api/user'
import indexAddOrUpdate from './index-add-or-update.vue'
import { menuToTreeMenu } from '@/utils'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'

defineOptions({ name: 'SystemMenuIndex' })
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
    userNav().then(({ data }) => {
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

        userDeleteNav({
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
