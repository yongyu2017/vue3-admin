<template>
    <div style="margin-bottom: 20px">
        <el-button @click="openMedia">开启摄像头</el-button>
        <el-button @click="closeMedia">关闭摄像头</el-button>
        <el-button @click="takePhoto">拍照</el-button>
        <el-button type="info" link>备注：电脑没有摄像头，可以安装e2eSoft VCam虚拟摄像头测试；摄像头调用需要https或者本地localhost运行环境；</el-button>
    </div>
    
    <cameraTakePhoto ref="cameraTakePhotoRef" @getImg="getPhoto"></cameraTakePhoto>

    <img :src="img" alt="" style="margin-top: 20px">

</template>

<script setup>
import { ref, onDeactivated } from 'vue'
import cameraTakePhoto from '@/components/cameraTakePhoto'

const img = ref('')
const cameraTakePhotoRef = ref(null)

onDeactivated(() => {
    closeMedia()
})

// 摄像头拍照成功回调
const getPhoto = (e) => {
    img.value = e;
}
// 开启摄像头
const openMedia = () => {
    cameraTakePhotoRef.value.openMedia()
}
// 拍照
const takePhoto = () => {
    cameraTakePhotoRef.value.takePhoto()
}
// 关闭摄像头
const closeMedia = () => {
    cameraTakePhotoRef.value.closeMedia()
}
</script>

<style lang="scss" scoped>
    .step-list {
        display: flex;
    li{
        position: relative;
        margin: 0 4px;
        flex: 1;
        line-height: 36px;
        text-align: center;
        padding: 0 40px;
        color: #090909;
        font-size: 14px;
        background: #eaeaea;
    &:after{
         content: "";
         position: absolute;
         right: -18px;
         top: 0;
         z-index: 10;
         display: block;
         border-top: 18px solid transparent;
         border-bottom: 18px solid transparent;
         border-left: 18px solid #eaeaea;
     }
    &:before{
         content: "";
         position: absolute;
         left: 0;
         top: 0;
         display: block;
         border-top: 18px solid transparent;
         border-bottom: 18px solid transparent;
         border-left: 18px solid #fff;
     }
    &:first-child{
         margin-left: 0;
         padding: 0 20px;
    &:before{
         display: none;
     }
    }
    &:last-child{
         margin-right: 0;
         padding: 0 20px 0 40px;
    &:after {
         display: none;
     }
    }
    &.active, &.end {
                   color: #fff;
                   background-color: #1890FF;
               }
    &.active:after, &.end:after {
                         border-left-color: #1890FF;
                     }
    }
    }
</style>
