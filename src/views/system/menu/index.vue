<template>
    <div class="table-flex-page">
        <div class="table-op-box" style="margin-bottom: 12px">
            <div class="box-l">
                <el-button type="primary" @click="addOrUpdateFun()"><el-icon><Plus /></el-icon><span>新增</span></el-button>
            </div>
        </div>

        <el-table ref="elTableRef" :data="dataList" border row-key="id" v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="menuName" header-align="left" align="left" label="名称" min-width="150"></el-table-column>
            <el-table-column prop="icon" label="图标" min-width="100">
                <template #default="scope">
                    <el-icon v-if="scope.row.icon">
                        <component :is="scope.row.icon" />
                    </el-icon>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" min-width="100">
                <template #default="scope">
                    <el-button type="primary" plain v-if="scope.row.type === 0">目录</el-button>
                    <el-button type="success" plain v-else-if="scope.row.type === 1">菜单</el-button>
                    <el-button type="info" plain v-else>按钮</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="orderNum" label="排序" min-width="100"></el-table-column>
            <el-table-column prop="jumpUrl" label="菜单URL" min-width="150"></el-table-column>
            <el-table-column prop="roleUrl" label="授权标识" min-width="150"></el-table-column>
            <el-table-column prop="status" label="菜单状态" min-width="150">
                <template #default="scope">
                    <el-button type="success" plain v-if="scope.row.status == 1">开启</el-button>
                    <el-button type="info" plain v-else>关闭</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="visible" label="显示状态" min-width="150">
                <template #default="scope">
                    <el-button type="success" plain v-if="scope.row.visible == 1">开启</el-button>
                    <el-button type="info" plain v-else>关闭</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" :fixed="$elTable_fixed_computed('right')">
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
import { elTableScrollMixin } from '@/mixins/elTableScrollMixin.js'

defineOptions({ name: 'SystemMenuIndex' })
const dataList = ref([]);
const dataListLoading = ref(false);
const indexAddOrUpdateRef = ref(null);
const indexAddOrUpdateVisible = ref(false);
const { elTableRef, $elTable_fixed_computed } = elTableScrollMixin(dataList, dataListLoading)

onMounted(() => {
    queryList()
})

// 获取列表
function queryList () {
    dataListLoading.value = true
    userNav().then((res) => {
        dataListLoading.value = false
        if (res.code == 200) {
            dataList.value = menuToTreeMenu(res.data.menuList)
        }
    }).catch(() => {
        dataListLoading.value = false
    })
}
//新增或者修改
function addOrUpdateFun (item) {
    indexAddOrUpdateVisible.value = true
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

    userDeleteNav({
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
