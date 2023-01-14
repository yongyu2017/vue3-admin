<template>
    <div class="video-tack-photo-wrap" :style="{ width: videoWidth + 'px', height: videoHeight + 'px' }">
        <video ref="videoRef" autoplay="autoplay" :width="videoWidth" :height="videoHeight" class="video-dom"></video>

        <canvas ref="canvasRef" :width="videoWidth" :height="videoHeight" class="canvas-dom"></canvas>

        <div class="camera-txt-box" v-if="!iSOnline">
            <div class="error-tips-box" v-if="devicesList.length === 0">
                <div class="p1">未检测到可用摄像设备，如已连接，请拔插后刷新页面.</div>
                <div>
                    <el-button @click="openMedia">重新连接</el-button>
                </div>
            </div>
            <div v-else>
                <div class="p1">请选择摄像头：</div>
                <ul class="devices-list">
                    <li v-for="(item, index) in devicesList" :key="index">
                        <div class="devices-name" :title="item.label">设备：{{ item.label || '未知设备' }}</div>
                        <el-button link type="primary" class="ant-btn-link-custom" @click="linkMedia(item)">连接</el-button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, defineProps, defineEmits, defineExpose, onBeforeMount } from 'vue'
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
let mediaStream = ref(null)  // 摄像头视频流
let iSOnline = ref(false)  // 判断摄像头是否在线
let devicesList = ref([])  // 摄像头列表
let selectedDevice = ref(null)  // 已连接的设备信息

onBeforeMount(() => {
    closeMedia()
})
// 检测摄像头
const checkMediaDevices = async () => {
    await navigator.mediaDevices.enumerateDevices().then((devices) => {
        devicesList.value = devices.filter(item => item.kind === 'videoinput')
        console.log('devices', devices)
    }).catch((err) => {
        console.log('enumerateDevices', err)
    })
}
// 开启摄像头
const openMedia = async (device) => {
    await checkMediaDevices()
    if (devicesList.value.length === 0) {
        return
    }
    if (devicesList.value.length === 1 || device) {
        linkMedia(device || devicesList.value[0])
    }
}
// 链接摄像头
let linkMedia = (device) => {
    selectedDevice.value = device
    const constraints = {
        audio: false, // 音频轨道
        video: {
            width: videoWidth.value,
            height: videoHeight.value,
            deviceId: { exact: device.deviceId || undefined }  // 部分电脑查询不到摄像头的deviceId和label（有可能是电脑驱动问题），需要传undefined进去，才可调用摄像头
        } // 视频轨道
    }
    const mediaPromise = navigator.mediaDevices.getUserMedia(constraints)
    mediaPromise.then((stream) => {
        iSOnline.value = true
        mediaStream.value = stream
        videoRef.value.srcObject = stream
        videoRef.value.play()
    }).catch((err) => {
        console.log('getUserMedia', err)
        iSOnline.value = false
    })
}
// 拍照
let takePhoto = async () => {
    // mediaStream在摄像头拔出的一瞬间，active会从true变更为false，同时触发oninactive钩子，有了状态监听之后事情就简单了许多。代码经过测试后发现，对用户变更摄像头权限也有效。
    if ((mediaStream.value && !mediaStream.value.active) || !iSOnline.value) {
        mediaStream.value = null
        selectedDevice.value = null
        iSOnline.value = false
        await checkMediaDevices()
        ElMessage.warning('摄像头掉线了，请检查！')
        return
    }
    const ctx = canvasRef.value.getContext('2d')
    ctx.drawImage(videoRef.value, 0, 0, videoWidth.value, videoHeight.value)
    const base64Data = canvasRef.value.toDataURL('image/jpeg', 1)
    emit('getImg', base64Data, selectedDevice.value)
    emit('getFile', base64ToFile(base64Data, 'filename'))
}
// 关闭摄像头
let closeMedia = () => {
    mediaStream.value && mediaStream.value.getTracks().forEach(track => {
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
        background-color: #dcdcdc;

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

        .camera-txt-box{
            position: absolute;
            z-index: 10;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            line-height: 20px;
            padding: 6px;
            background-color: #fff;
            font-size: 14px;
            box-sizing: border-box;
            overflow-y: auto;

            .p1{
                margin-bottom: 6px;
            }
        }

        .devices-list {
            li {
                display: flex;
                padding: 4px 0;
                border-bottom: 1px dashed #dcdcdc;

                &:last-child {
                    border-bottom: 0;
                }

                .devices-name {
                    flex: 1;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
    }
</style>
