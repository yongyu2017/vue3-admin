<template>
    <el-dialog @close="closeFun" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" @keyup.enter="dataFormSubmit()"
            label-width="100px">
            <el-form-item label="商品名称：" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="商品分类：" prop="category">
                <el-select v-model="dataForm.category" placeholder="请选择" class="inp-dom">
                    <el-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品图片：" prop="img">
                <el-input v-model="dataForm.img" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="商品描述：" prop="des">
                <el-input v-model="dataForm.des" placeholder="请输入" :rows="3" type="textarea" class="inp-dom"></el-input>
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
import { ref, reactive, defineEmits, nextTick, defineExpose } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { goodsGoodsAddOrModify, goodsGoodsDetail, goodsCategoryList } from '@/api/goods'

const dataFormRef = ref();
let visible = ref(false);
let dataForm = ref({
    id: '',  //修改时填写
    name: '',
    category: '',
    img: '',
    des: '',
})
const dataRule = reactive({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    category: [
        { required: true, message: '请选择', trigger: 'change' },
    ],
    img: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
let categoryList = ref([])
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
var init = (id) => {
    visible.value = true;
    dataForm.value.id = id || ''

    nextTick(async () => {
        goodsCategoryListFun()
        if (id) {
            goodsGoodsDetail({
                id,
            }).then(({ data }) => {
                dataForm.value = data
            })
        }
    })
}
// 获取商品分类
const goodsCategoryListFun = () => {
    goodsCategoryList({
        name: '',
        pageIndex: '',
        pageSize: '',
    }).then(({ data }) => {
        categoryList.value = data.list.slice()
    })
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })

            goodsGoodsAddOrModify({
                ...dataForm.value
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
    dataForm,
    init,
})
</script>

<style lang="scss" scoped>

</style>
