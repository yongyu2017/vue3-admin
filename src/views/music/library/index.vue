<template>
    <el-form :inline="true" :model="formData" @submit.prevent @keydown.enter="searchFun">
        <el-form-item label="歌曲名称">
            <el-input v-model="formData.name" placeholder="请输入" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item label="歌曲标签">
            <el-select v-model="formData.label" multiple clearable placeholder="请选择">
                <el-option
                    v-for="item in labelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchFun">查询</el-button>
            <el-button @click="resetFun">重置</el-button>
        </el-form-item>
    </el-form>

    <div style="margin-bottom: 12px">
        <el-button type="primary" :icon="Plus" @click="addOrUpdateFun()">新增</el-button>
        <el-button type="primary" :icon="UploadFilled" @click="moreUploadFun()">批量上传</el-button>
        <el-button type="danger" :icon="Delete" :disabled="ids.length == 0" @click="delFun()">批量删除</el-button>
    </div>

    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" header-align="center" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" align="center" header-align="center" width="70"></el-table-column>
        <el-table-column prop="name" label="歌曲名称"></el-table-column>
        <el-table-column prop="label" label="歌曲标签">
            <template #default="scope">
                {{ codeToLabelComputed(scope.row.label, labelList) }}
            </template>
        </el-table-column>
        <el-table-column prop="fileid" label="歌曲地址">
            <template #default="scope">
                <el-link :href="scope.row.fileid.url" type="primary" :underline="false" target="_blank" v-if="scope.row.fileid">{{ urlSplitComputed(scope.row.fileid.url) }}</el-link>
            </template>
        </el-table-column>
        <el-table-column prop="lrc" label="歌词地址">
            <template #default="scope">
                <el-link :href="scope.row.lrc.url" type="primary" :underline="false" target="_blank" v-if="scope.row.lrc">{{ urlSplitComputed(scope.row.lrc.url) }}</el-link>
            </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长"></el-table-column>
        <el-table-column prop="des" label="描述"></el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column label="操作" width="130">
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

    <!-- 新增或编辑 -->
    <indexAddOrUpdate ref="indexAddOrUpdateRef" @refreshDataList="searchFun" @close="indexAddOrUpdateVisible= false" v-if="indexAddOrUpdateVisible"></indexAddOrUpdate>
    <!-- 批量上传 -->
    <indexUpload ref="indexUploadRef" @refreshDataList="searchFun" @close="indexUploadVisible= false" v-if="indexUploadVisible"></indexUpload>
</template>

<script setup>
import { onMounted, ref, nextTick, computed } from 'vue'
import indexAddOrUpdate from './index-add-or-update.vue'
import indexUpload from './index-upload.vue'
import { musicLibraryList, musicLabelListAll, musicLibraryDelete } from '@/api/music.js'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { Plus, UploadFilled, Delete } from '@element-plus/icons-vue'
import { deepCopy } from '@/utils/index'
import { commonMixin } from '@/mixins/common'
const dayjs = require('dayjs')

const { codeToLabelComputed } = commonMixin()
const defaultDataForm = {
    name: '',
    label: '',
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
    orderBy: 'updateTime',
}
const formData = ref(deepCopy(defaultDataForm))
const dataList = ref([]);
const dataListLoading = ref(false);
const indexAddOrUpdateRef = ref(null);
const indexAddOrUpdateVisible = ref(false);
const indexUploadRef = ref(null);
const indexUploadVisible = ref(false);
const labelList = ref([])
const ids = ref([])

const urlSplitComputed = computed(function () {
    return (url) => {
        const arr = url.split('/')
        return arr[arr.length - 1]
    }
})

onMounted(() => {
    musiclabelListFun()
    queryList()
})

// 获取列表
const queryList = () => {
    dataListLoading.value = true;
    let formDataCopy = deepCopy(formData.value)
    formDataCopy.label = formDataCopy.label ? formDataCopy.label.join(',') : ''
    musicLibraryList({
        ...formDataCopy
    }).then(({ data }) => {
        dataListLoading.value = false;
        data.list.forEach((value) => {
            value['label'] = value['label'] ? value['label'].split(',') : []
            value['createTime'] = dayjs(value.createTime).format('YYYY-MM-DD HH:mm:ss')
            value['updateTime'] = dayjs(value.updateTime).format('YYYY-MM-DD HH:mm:ss')
            if (value.fileid) {
                value.fileid = value.fileList.find((value2) => value2.id == value.fileid)
            }
            if (value.lrc) {
                value.lrc = value.fileList.find((value2) => value2.id == value.lrc)
            }
        })
        dataList.value = data.list.slice()
        formData.value.totalPage = data.sum
    }).catch(() => {
        dataListLoading.value = false;
    })
}
// 获取歌曲标签
const musiclabelListFun = () => {
    musicLabelListAll().then(({ data }) => {
        data.list.forEach((value) => {
            value['label'] = value.name
            value['value'] = value.id
        })
        labelList.value = data.list
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
const handleSelectionChange = (e) => {
    ids.value = e.slice()
}
//删除
const delFun = (id) => {
    let idList = id ? [id] : ids.value.map((value) => value.id)
    ElMessageBox.confirm(
        `确定要删除ID为【${ idList.join(',') }】的数据吗?`,
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
            id: idList.join(','),
        }).then(() => {
            loading.close()
            queryList()
            ElMessage.success('操作成功')
        }).catch(() => {
            loading.close()
        })

    })
}
// 批量上传
const moreUploadFun = () => {
    indexUploadVisible.value = true;
    nextTick(() => {
        indexUploadRef.value.init()
    })
}
</script>

<style>

</style>
