<template>
    <el-form :inline="true" :model="formData" @submit.prevent>
        <el-form-item label="歌曲名称">
            <el-input v-model="formData.name" placeholder="请输入" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item label="歌曲类型">
            <el-cascader v-model="formData.directory" :options="directoryList" clearable @change="directoryChange" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchFun">查询</el-button>
            <el-button @click="resetFun">重置</el-button>
        </el-form-item>
    </el-form>

    <div style="margin-bottom: 12px">
        <el-button type="primary" :icon="Plus" @click="addOrUpdateFun()">新增</el-button>
    </div>

    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="70"></el-table-column>
        <el-table-column prop="name" label="歌曲名称"></el-table-column>
        <el-table-column prop="directory" label="歌曲类型">
            <template #default="scope">
                {{ codeToLabelComputed(scope.row.directory, directoryAllList) }}
            </template>
        </el-table-column>
        <el-table-column prop="fileid" label="歌曲地址">
            <template #default="scope">
                <el-link :href="scope.row.fileid.url" type="primary" :underline="false" target="_blank" v-if="scope.row.fileid">{{ scope.row.fileid.url }}</el-link>
            </template>
        </el-table-column>
        <el-table-column prop="lrc" label="歌词地址">
            <template #default="scope">
                <el-link :href="scope.row.lrc.url" type="primary" :underline="false" target="_blank" v-if="scope.row.lrc">{{ scope.row.lrc.url }}</el-link>
            </template>
        </el-table-column>
        <el-table-column prop="des" label="描述"></el-table-column>
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
import { musicLibraryList, musicDirectoryList, musicLibraryDelete } from '@/api/music.js'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { deepCopy, menuToTreeMenu } from '@/utils/index'
import { commonMixin } from '@/mixins/common'
const dayjs = require('dayjs')

const { codeToLabelComputed } = commonMixin()
const defaultDataForm = {
    name: '',
    directory: '',
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
}
const formData = ref(deepCopy(defaultDataForm))
const dataList = ref([]);
const dataListLoading = ref(false);
const indexAddOrUpdateRef = ref(null);
const indexAddOrUpdateVisible = ref(false);
const directoryList = ref([])
const directoryAllList = ref([])

onMounted(() => {
    musicDirectoryListFun()
    queryList()
})

// 获取员工列表
const queryList = () => {
    dataListLoading.value = true;
    musicLibraryList({
        ...formData.value
    }).then(({ data }) => {
        dataListLoading.value = false;
        data.list.forEach((value) => {
            value['directory'] = value['directory'].split(',')[value['directory'].split(',').length - 1]
            value['createTime'] = dayjs(value.createTime).format('YYYY-MM-DD HH:mm:ss')
            value['updateTime'] = dayjs(value.updateTime).format('YYYY-MM-DD HH:mm:ss')
            if (value.fileid) {
                value.fileid = value.fileList.find((value2) => value2.id == value.fileid)
            }
            if (value.lrc) {
                value.lrc = value.fileList.find((value2) => value2.id == value.lrc)
            }
        })
        dataList.value = data.list.slice();
        formData.value.totalPage = data.sum;
    }).catch(() => {
        dataListLoading.value = false;
    })
}
// 获取音乐类型
const musicDirectoryListFun = () => {
    musicDirectoryList().then(({ data }) => {
        data.menuList.forEach((value) => {
            value['label'] = value.name
            value['value'] = value.id
        })
        directoryAllList.value = data.menuList
        directoryList.value = menuToTreeMenu(data.menuList);
    })
}
// 重置
const resetFun = () => {
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

        musicLibraryDelete({
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
// 音乐类型，change
const directoryChange = (e) => {
    console.log(e)
}
</script>

<style>

</style>
