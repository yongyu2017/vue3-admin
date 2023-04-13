<template>
    <el-upload
        :on-change="uploadFun"
        accept="image/jpeg, image/jpg"
        :show-file-list="false"
        :auto-upload="false">
        <el-button type="primary">选择图片</el-button>
    </el-upload>
    <img :src="img" alt="" style="margin-top: 20px" />

    <!-- 图片裁剪 -->
    <imageCropper ref="imageCropperRef" :autoCropWidth="172" :autoCropHeight="241" :enlarge="1.715" @refreshDataList="getImageCropper" @close="imageCropperVisible= false" v-if="imageCropperVisible"></imageCropper>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import imageCropper from '@/components/imageCropper'

const imageCropperRef = ref(null)
let imageCropperVisible = ref(false)
let img = ref('')

// 读取原图
const uploadFun = (file) => {
    let reader = new FileReader()
    reader.readAsDataURL(file.raw)
    reader.onload = e => {
        imageCropperVisible.value = true;
        nextTick(() => {
            imageCropperRef.value.init(e.target.result)// base64
        })
    }
}
// 获取图片
const getImageCropper = (e) => {
    img.value = e;
}
</script>

<style>

</style>
