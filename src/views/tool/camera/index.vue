<template>
    <div style="margin-bottom: 20px">
        <div class="info-txt" style="margin-bottom: 12px">
            备注：<br />
            1、如果电脑没有摄像头，可以安装e2eSoft VCam虚拟摄像头测试；<br />
            2、摄像头调用需要https或者本地localhost运行环境；<br />
            3、或者修改浏览器安全配置， 浏览器地址栏输入“chrome://flags/#unsafely-treat-insecure-origin-as-secure”，开启INSECURE ORIGINS TREATED AS SECURE，在下方输入栏内输入，你访问的地址url，然后将右侧Disabled 改成 Enabled即可，浏览器会提示重启（RELAUNCH），Relaunch即可；</div>
        <el-button @click="openMedia">开启摄像头</el-button>
        <el-button @click="closeMedia">关闭摄像头</el-button>
        <el-button @click="takePhoto">拍照</el-button>
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
