<template>
    <ul class="step-list">
        <li class="end">第一步：填写报名信息</li>
        <li class="active">第二步：上传报名资料</li>
        <li>第三步：确认报名</li>
    </ul>

    <div class="video-tack-photo-wrap" :style="{ width: videoWidth + 'px', height: videoHeight + 'px' }">
        <video ref="videoRef" autoplay="autoplay" :width="videoWidth" :height="videoHeight" class="video-dom"></video>

        <canvas ref="canvasRef" :width="videoWidth" :height="videoHeight" class="canvas-dom"></canvas>

        <div class="error-tips-box" v-if="!isLinkVideoList">
            <div class="p1">未搜索到摄像头设备，请检查摄像头！</div>
            <div>
                <el-button @click="openMedia">重启摄像头</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, defineProps, defineEmits, defineExpose, onMounted } from 'vue'
import { ElMessage } from 'element-plus';

const props = defineProps({
    videoWidth: {
        type: Number,
        default: 300
    },
    videoHeight: {
        type: Number,
        default: 300
    },
})
const emit = defineEmits(['getImg', 'getFile'])
const { videoWidth, videoHeight } = toRefs(props);
const videoRef = ref(null)
const canvasRef = ref(null)
let mediaStream = ref()
let isLinkVideoList = ref(false)  //是否链接上摄像头设备
// let cameraIsOnline = ref(false)  // 判断摄像头是否在线

onMounted(() => {
    checkMediaDevices()
})
// 检测摄像头
const checkMediaDevices = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        let count = devices.filter(item => item.kind == 'videoinput').length;
        isLinkVideoList.value = count > 0 ? true : false;
        isLinkVideoList.value && openMedia()
    })
}
// 开启摄像头
const openMedia = () => {
    let constraints = {
        audio: false, //音频轨道
        video: { width: videoWidth.value, height: videoHeight.value }  //视频轨道
    }
    let mediaPromise = navigator.mediaDevices.getUserMedia(constraints);
    mediaPromise.then((stream) => {
        isLinkVideoList.value = true;
        mediaStream.value = stream;
        videoRef.value.srcObject = stream;
        videoRef.value.play();
    }).catch((err) => {
        console.log(err)
    })
}
// 拍照
let takePhoto = () => {
    // mediaStream在摄像头拔出的一瞬间，active会从true变更为false，同时触发oninactive钩子，有了状态监听之后事情就简单了许多。代码经过测试后发现，对用户变更摄像头权限也有效。
    if (!mediaStream.value.active) {
        isLinkVideoList.value = false;
        ElMessage.warning('摄像头掉线了，请检查！')
        return
    }
    let ctx = canvasRef.value.getContext('2d')
    ctx.drawImage(videoRef.value, 0, 0, videoWidth.value, videoHeight.value)
    const base64Data = canvasRef.value.toDataURL()
    emit('getImg', base64Data)
    emit('getFile', base64ToFile(base64Data, 'filename'))
}
// 关闭摄像头
let closeMedia = () => {
    mediaStream.value.getTracks().forEach(track => {
        track.stop()
    })
}
/** 将base64转换为文件对象
 * @param {String} base64 base64字符串
 * */
function base64ToFile (base64, fileName) {
    var mimeString = base64.split(',')[0].split(':')[1].split(';')[0] // mime类型
    var byteString = atob(base64.split(',')[1]) // base64 解码
    var arrayBuffer = new ArrayBuffer(byteString.length) // 创建缓冲数组
    var intArray = new Uint8Array(arrayBuffer) // 创建视图

    for (var i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i)
    }
    let blob = new Blob([intArray], { type: mimeString })

    blob.lastModifiedDate = new Date()
    blob.name = fileName

    return blob
}

defineExpose({
    openMedia,
    takePhoto,
    closeMedia,
})
</script>

<style lang="scss" scoped>
.video-tack-photo-wrap{
    position: relative;
    z-index: 0;
    .video-dom{
        position: relative;
        z-index: 1;
        object-fit: fill;
    }
    .canvas-dom{
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        opacity: 0;
    }
    .error-tips-box{
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 12px;
        background: rgba(255, 255, 255, 0.75);
        box-sizing: border-box;
        .p1{
            margin-bottom: 12px;
            font-size: 14px;
        }
    }
}
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
