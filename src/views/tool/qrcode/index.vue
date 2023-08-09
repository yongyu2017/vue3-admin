<template>
    <div class="qrcode-page">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="70px">
            <el-form-item label="文本" prop="content">
                <div style="display: flex; align-items: flex-start; width: 100%;">
                    <el-input v-model="dataForm.content" placeholder="请输入" :rows="5" type="textarea" style="width: 500px"></el-input>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dataFormSubmit()">生成</el-button>
            </el-form-item>
        </el-form>

        <div class="img-box">
            <img :src="dataForm.img" v-if="dataForm.img">
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import QRCode from 'qrcode'

const dataFormRef = ref(null)
const dataForm = ref({
    content: '',
    img: '',
})
const dataRule = ref({
    content: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})

// 生成二维码
const QRCodePrintBase64 = async (txt) => {
    const res = await QRCode.toDataURL(txt, {
        errorCorrectionLevel: 'L',
        margin: 1,
        height: 320,
        width: 320,
    })

    return res
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate(async (valid) => {
        if (valid) {
            dataForm.value.img = await QRCodePrintBase64(dataForm.value.content)
        } else {
            ElMessage.warning('请完善标红字段信息')
        }
    })
}
</script>

<style lang="scss" scoped>
    .qrcode-page {
        display: flex;

        .img-box {
            margin-left: 20px;

            img {
                border: 1px solid #dcdcdc;
            }
        }
    }
</style>
