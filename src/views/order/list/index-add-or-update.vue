<template>
    <el-dialog @close="closeFun" title="创建订单" :close-on-click-modal="false" v-model="visible">
        <indexAddOrUpdateSearch @change="indexAddOrUpdateSearchChange"></indexAddOrUpdateSearch>

        <div class="orderPay-box">
            <el-table :data="dataForm.goodsId" style="width: 100%">
                <el-table-column prop="name" label="商品名称" />
                <el-table-column prop="price" label="售价（￥）" align="right" header-align="right" />
                <el-table-column prop="count" label="数量" align="right" header-align="right" />
                <el-table-column prop="total" label="小计（￥）" align="right" header-align="right">
                    <template #default="scope">
                        <el-statistic :value="scope.row.total" :precision="2" />
                    </template>
                </el-table-column>
            </el-table>

            <div class="de">
                <div></div>
                <div>
                    <div class="item">
                        <div class="label">总件数</div>
                        <div class="txt">1件</div>
                    </div>
                    <div class="item">
                        <div class="label">金额</div>
                        <div class="txt">￥1</div>
                    </div>
                    <div class="item">
                        <div class="label">优惠</div>
                        <div class="txt">0</div>
                    </div>
                    <div class="item">
                        <div class="label">合计</div>
                        <div class="txt success-txt">￥<span class="num">150</span></div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="dataFormSubmit()">结账</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick, defineExpose } from 'vue'
import indexAddOrUpdateSearch from './index-add-or-update-search.vue'
import { ElLoading, ElMessage } from 'element-plus'
import { goodsGoodsGet } from '@/api/goods'

const visible = ref(false);
const emit = defineEmits(['refreshDataList', 'close'])
const dataForm = ref({
    id: '',  //修改时填写
    goodsId: [],
})

// eslint-disable-next-line
var init = (id) => {
    visible.value = true;
    dataForm.value.id = id || ''

    nextTick(async () => {
        if (id) {
            goodsGoodsGet({
                id,
            }).then(({ data }) => {
                data.imgUrl = data.img
                dataForm.value = data
            })
        }
    })
}
// indexAddOrUpdateSearch，change回调
const indexAddOrUpdateSearchChange = (item) => {
    const isHas = dataForm.value.goodsId.map((value) => value.parentId).includes(item.parentId) // 商品是否存在

    if (isHas) {
        dataForm.value.goodsId.forEach((value) => {
            value.count++
            console.log(value.count)
            value.total = Number(value.price * value.count)
        })
    } else {
        dataForm.value.goodsId.push({
            id: item.id,
            code: item.code,
            name: item.name,
            parentId: item.parentId,
            price: item.price,
            count: 1,
            total: Number(item.price),
        })
    }
}
// 表单提交
const dataFormSubmit = () => {
    const loading = ElLoading.service({
        lock: true,
    })
    loading.close()
    visible.value = false
    emit('refreshDataList')
    ElMessage.success('操作成功！')
}
//关闭
const closeFun = () => {
    emit('close')
}

//暴露给父组件使用的方法和数据
defineExpose({
    init,
})
</script>

<style lang="scss" scoped>
    .orderPay-box {
        .de {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;

            .item {
                display: flex;
                line-height: 24px;

                .label {
                    width: 100px;
                }

                .txt {
                    flex: 1;
                    text-align: right;
                }

                .num {
                    font-weight: bold;
                    font-size: 16px;
                }
            }
        }
    }
</style>
