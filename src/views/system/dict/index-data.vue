<template>
    <el-dialog @close="closeFun" title="数据字典" :close-on-click-modal="false" v-model="visible" >

        <el-form :inline="true" :model="formData" label-width="70px" @submit.prevent style="margin-bottom: 12px">
            <el-form-item label="数据标签">
                <el-input v-model="formData.label" placeholder="请输入" clearable class="inp-dom" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchFun">查询</el-button>
                <el-button @click="resetFun()">重置</el-button>
            </el-form-item>
        </el-form>

        <div class="table-op-box" style="margin-bottom: 12px">
            <div class="box-l">
                <el-button type="primary" @click="addOrUpdateFun()"><el-icon><Plus /></el-icon><span>新增</span></el-button>
            </div>
        </div>

        <el-table ref="elTableRef" header-cell-class-name="table-cell-header" :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" label="序号" width="100"></el-table-column>
            <el-table-column prop="label" label="数据标签"></el-table-column>
            <el-table-column prop="value" label="数据键值"></el-table-column>
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <span v-if="scope.row.status == 1">开启</span>
                    <span v-else>关闭</span>
                </template>
            </el-table-column>
            <el-table-column prop="dictType" label="字典类型">
                <template #default="scope">
                    {{ codeToLabelComputed(scope.row.dictType, dictTypeList) }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" link @click="addOrUpdateFun(scope.row.id)">编辑</el-button>
                    <el-button type="danger" link @click="delFun(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="el-pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"
                       :current-page="formData.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="formData.pageSize"
                       :total="formData.totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>

        <!-- 新增和编辑弹框 -->
        <indexDataAdd ref="indexDataAddRef" @refreshDataList="searchFun" @close="indexDataAddVisible= false"
                         v-if="indexDataAddVisible"></indexDataAdd>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, nextTick, defineEmits, defineExpose } from 'vue'
import { dictDataPage, dictDataDelete, dictTypeListAll } from '@/api/system'
import { dayjs, ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import indexDataAdd from './index-data-add.vue'
import { commonMixin } from "@/mixins/common.js";
const lodash = require('lodash')

const visible = ref(false);
const emit = defineEmits(['close'])
const defaultFormData = {
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
    label: '',
    dictType: '',
}
const formData = ref(lodash.cloneDeep(defaultFormData));
const dataList = ref([]);
const dataListLoading = ref(false);
const indexDataAddRef = ref(null);
const indexDataAddVisible = ref(false);
const { codeToLabelComputed } = commonMixin()
const dictTypeList = ref([])

function init (dictType) {
    visible.value = true;
    formData.value.dictType = dictType

    nextTick(() => {
        dictTypePageFun()
        queryList()
    })
}
function queryList () {
    dataListLoading.value = true;

    dictDataPage(formData.value).then((res) => {
        dataListLoading.value = false;

        if (res.code == 200) {
            res.data.list.forEach((value) => {
                value['createTime'] = value.createTime ? dayjs(value.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
            })
            dataList.value = res.data.list.slice();
            formData.value.totalPage = res.data.sum;
        }
    }).catch(() => {
        dataListLoading.value = false;
    })
}
// 获取字典类型列表
function dictTypePageFun () {
    dictTypeListAll().then((res) => {
        if (res.code == 200) {
            res.data.list.forEach((value) => {
                value['label'] = value.name
                value['value'] = value.id
            })
            dictTypeList.value = res.data.list.slice();
        }
    })
}
// 搜索
function searchFun () {
    formData.value.pageIndex = 1;
    queryList()
}
// 重置
function resetFun () {
    formData.value = lodash.cloneDeep(defaultFormData)
    searchFun()
}
// 每页数
function sizeChangeHandle (val) {
    formData.value.pageSize = val
    formData.value.pageIndex = 1;
    queryList()
}
// 当前页
function currentChangeHandle (val) {
    formData.value.pageIndex = val
    queryList()
}
//新增或者修改
function addOrUpdateFun (id) {
    indexDataAddVisible.value = true;
    nextTick(() => {
        indexDataAddRef.value.init(formData.value.dictType, id || '')
    })
}
//删除
async function delFun (data) {
    await ElMessageBox.confirm(`确定要删除'${data.label}'的数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
    })

    const loading = ElLoading.service({ lock: true })

    dictDataDelete({ id: data.id }).then((res) => {
        loading.close()

        if (res.code == 200) {
            ElMessage.success('操作成功')
            queryList()
        }
    }).catch(() => {
        loading.close()
    })
}
//关闭
function closeFun () {
    emit('close')
}

//暴露给父组件使用的方法和数据
defineExpose({
    init,
})
</script>

<style></style>
