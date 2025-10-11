<template>
    <el-form :inline="true" :model="formData" @submit.prevent>
        <el-form-item label="商品编码">
            <el-input v-model="formData.code" placeholder="请输入" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item label="商品名称">
            <el-input v-model="formData.name" placeholder="请输入" clearable class="inp-dom" />
        </el-form-item>
        <el-form-item label="所属商品">
            <el-select v-model="formData.parentId" placeholder="请选择" filterable clearable class="inp-dom">
                <el-option
                        v-for="item in parentIdList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="销售状态">
            <el-select v-model="formData.sale" placeholder="请选择" filterable clearable class="inp-dom">
                <el-option
                        v-for="item in sale_statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchFun">查询</el-button>
            <el-button @click="resetFun">重置</el-button>
        </el-form-item>
    </el-form>

    <div style="margin-bottom: 12px">
        <el-button type="primary" :icon="Plus" @click="addOrUpdateFun()">新增</el-button>
        <el-button :icon="Refresh" @click="refreshFun()">更新库存</el-button>
    </div>

    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
        <el-table-column prop="id" label="ID" fixed="left" width="70"></el-table-column>
        <el-table-column prop="code" label="商品编码" fixed="left" min-width="160"></el-table-column>
        <el-table-column prop="name" label="商品名称" fixed="left" min-width="200"></el-table-column>
        <el-table-column prop="parentId" label="所属商品" min-width="180">
            <template #default="scope">
                {{ codeToLabelComputed(scope.row.parentId, parentIdList) }}
            </template>
        </el-table-column>
        <el-table-column prop="costPrice" label="成本价格" min-width="160"></el-table-column>
        <el-table-column prop="price" label="价格" min-width="160"></el-table-column>
        <el-table-column prop="parentId" label="销售状态" min-width="160">
            <template #default="scope">
                <span :class="[scope.row.sale == 1 ? 'success-txt' : 'info-txt']">{{ scope.row.sale == 1 ? '已售' : '未售' }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="salePrice" label="销售价格" min-width="160"></el-table-column>
        <el-table-column prop="saleTime" label="销售时间" min-width="200"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="200"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" min-width="200"></el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
            <template #default="scope">
                <el-button type="primary" link @click="addOrUpdateFun(scope.row.id)" v-if="scope.row.sale == 0">编辑</el-button>
                <el-button type="primary" link @click="updateSaleFun(scope.row.id, scope.row.sale)">{{ scope.row.sale == 1 ? '重新入库' : '出库' }}</el-button>
                <el-button type="primary" link @click="delFun(scope.row.id, scope.row.parentId)" v-if="scope.row.sale == 0">删除</el-button>
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
    <!-- 商品出库 -->
    <indexSale ref="indexSaleRef" @refreshDataList="searchFun" @close="indexSaleVisible= false" v-if="indexSaleVisible"></indexSale>
</template>

<script setup>
import { ref, nextTick, onActivated, onMounted } from 'vue'
import indexAddOrUpdate from './index-add-or-update.vue'
import indexSale from './index-sale.vue'
import { goodsWarehousingPage, goodsWarehousingDelete, goodsGoodsListAll, goodsWarehousingSale, goodsWarehousingStockRefresh } from '@/api/goods'
import { ElLoading, ElMessage, ElMessageBox, dayjs } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { commonMixin } from '@/mixins/common'
import { deepCopy } from '@/utils/index'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStorePinia } from "@/store"

const store = useStorePinia()
const { dictType } = storeToRefs(store)
const { codeToLabelComputed } = commonMixin()
const route = useRoute()
const defaultDataForm = {
    code: '',
    name: '',
    parentId: '',
    sale: '',
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
}
const formData = ref(deepCopy(defaultDataForm))
const dataList = ref([])
const dataListLoading = ref(false)
const indexAddOrUpdateRef = ref(null)
const indexAddOrUpdateVisible = ref(false)
const indexSaleRef = ref(null)
const indexSaleVisible = ref(false)
const parentIdList = ref([])
const sale_statusList = ref(dictType.value['sale_status'])
let isQuery = true
let lastRouteId = ''

onMounted(() => {
    goodsGoodsListAllFun()
})
onActivated(() => {
    formData.value.parentId = route.query.id ? route.query.id : formData.value.parentId
    formData.value.sale = route.query.sale ? route.query.sale : formData.value.sale
    if (route.query.id && lastRouteId != route.query.id) {
        isQuery = true
    }
    lastRouteId = route.query.id || ''
    isQuery && queryList()
    isQuery = false
})

// 获取商品列表
const goodsGoodsListAllFun = () => {
    goodsGoodsListAll().then(({ data }) => {
        data.list.forEach((value) => {
            value['value'] = value.id + ''
            value['label'] = value.name
        })
        parentIdList.value = data.list.slice()
    })
}
// 获取列表
const queryList = () => {
    dataListLoading.value = true;
    goodsWarehousingPage({
        ...formData.value,
    }).then(({ data }) => {
        dataListLoading.value = false;
        data.list.forEach((value) => {
            value['createTime'] = dayjs(value.createTime).format('YYYY-MM-DD HH:mm:ss')
            value['updateTime'] = dayjs(value.updateTime).format('YYYY-MM-DD HH:mm:ss')
            value['saleTime'] = value.saleTime ? dayjs(value.saleTime).format('YYYY-MM-DD HH:mm:ss') : ''
        })
        dataList.value = data.list.slice();
        formData.value.totalPage = data.sum;
    }).catch(() => {
        dataListLoading.value = false;
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
const delFun = (id, parentId) => {
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
            parentId,
        }).then(() => {
            loading.close()
            queryList()

            ElMessage.success('操作成功')
        }).catch(() => {
            loading.close()
        })

    })
}
// 商品出入库
const updateSaleFun = async (id, sale) => {
    const confirmRes = await ElMessageBox.confirm(
        `确定要对ID为${ id }的数据进行出入库操作吗?`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => true).catch(() => false)
    if (!confirmRes) return

    if (sale == 1) {
        const loading = ElLoading.service({
            lock: true,
        })

        goodsWarehousingSale({
            id,
        }).then(() => {
            loading.close()
            queryList()

            ElMessage.success('操作成功')
        }).catch(() => {
            loading.close()
        })
    } else {
        indexSaleVisible.value = true;
        nextTick(() => {
            indexSaleRef.value.init(id)
        })
    }
}
// 同步更新商品库存
const refreshFun = () => {
    const loading = ElLoading.service({
        lock: true,
    })

    goodsWarehousingStockRefresh().then(() => {
        loading.close()

        ElMessage.success('操作成功')
    }).catch(() => {
        loading.close()
    })
}

</script>

<style>

</style>
