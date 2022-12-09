<template>
    <div style="margin-bottom: 20px">
        <el-button @click="openMedia">开启摄像头</el-button>
        <el-button @click="closeMedia">关闭摄像头</el-button>
        <el-button @click="takePhoto">拍照</el-button>
        <el-button type="info" link>备注：电脑没有摄像头，可以安装e2eSoft VCam虚拟摄像头测试；</el-button>
    </div>
    
    <cameraTakePhoto ref="cameraTakePhotoRef" @getImg="getPhoto"></cameraTakePhoto>
    <img :src="img" alt="" style="margin-left: 20px">

</template>

<script setup>
import { ref } from 'vue'
import cameraTakePhoto from '@/components/cameraTakePhoto'

let img = ref('')
const cameraTakePhotoRef = ref(null)

const getPhoto = (e) => {
    img.value = e;
}
const openMedia = () => {
    cameraTakePhotoRef.value.openMedia()
}
// 拍照
let takePhoto = () => {
    cameraTakePhotoRef.value.takePhoto()
}
// 关闭摄像头
let closeMedia = () => {
    cameraTakePhotoRef.value.closeMedia()
}
</script>

<style>

</style>
