<template>
    <el-dialog @close="closeFun" title="商品出库" :close-on-click-modal="false" v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px">
            <el-form-item label="商品编码" prop="code">
                <el-input v-model="dataForm.code" placeholder="请输入" disabled class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" disabled class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="成本价格" prop="costPrice">
                <el-input v-model="dataForm.costPrice" placeholder="请输入" disabled class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
                <el-input v-model="dataForm.price" placeholder="请输入" disabled class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="销售价格" prop="salePrice">
                <el-input v-model="dataForm.salePrice" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick, defineExpose } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { goodsWarehousingSale, goodsWarehousingGet } from '@/api/goods'
import { isNumberValidator } from '@/utils/validate.js'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    name: '',
    code: '',
    costPrice: '',
    price: '',
    salePrice: '',
})
const dataRule = ref({
    salePrice: [
        { required: true, validator: isNumberValidator('请输入', 2, false), trigger: 'blur' },
    ],
})
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
var init = (id) => {
    visible.value = true;
    dataForm.value.id = id || ''

    nextTick(async () => {
        if (id) {
            goodsWarehousingGet({
                id,
            }).then(({ data }) => {
                data['salePrice'] = data['price'] || ''
                dataForm.value = data
            })
        }
    })
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })

            goodsWarehousingSale({
                ...dataForm.value,
            }).then(() => {
                loading.close()
                visible.value = false
                emit('refreshDataList')
                ElMessage.success('操作成功！')
            }).catch(() => {
                loading.close()
            })
        }
    })
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
</style>
