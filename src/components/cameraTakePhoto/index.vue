<template>
    <div class="video-tack-photo-wrap" :style="{ width: videoWidth + 'px', height: videoHeight + 'px' }">
        <video ref="videoRef" autoplay="autoplay" :width="videoWidth" :height="videoHeight" class="video-dom"></video>
        <!-- 拍照 -->
        <video ref="canvasVideoRef" autoplay="autoplay" :width="videoWidth * enlarge" :height="videoHeight * enlarge" class="canvas-video-dom"></video>
        <canvas ref="canvasRef" :width="videoWidth * enlarge" :height="videoHeight * enlarge" class="canvas-dom"></canvas>
        <!-- 拍照 -->

        <div class="camera-txt-box" v-if="!iSOnline">
            <div class="error-tips-box" v-if="devicesList.length === 0">
                <div class="p1">未检测到可用摄像设备，如已连接，请拔插后重新连接.</div>
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

    <!-- 摄像头列表弹窗 -->
    <!--<index-select-camera ref="indexSelectCameraRef" @refreshDataList="linkMedia" @close="indexSelectCameraVisible = false" v-if="indexSelectCameraVisible"></index-select-camera>-->
    <!-- 掉线提示 -->
    <indexReconnection ref="indexReconnectionRef" @reconnection="openMedia" @close="indexReconnectionVisible = false" v-if="indexReconnectionVisible"></indexReconnection>
</template>

<script setup>
import { ref, toRefs, defineProps, defineEmits, defineExpose, onBeforeUnmount, provide, nextTick } from 'vue'
import indexReconnection from './index-reconnection.vue'
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
    enlarge: {
        type: Number,
        default: 1
    }, // 图片根据截图框输出比例倍数
})
const emit = defineEmits(['getImg', 'getFile', 'drop', 'success'])
const { videoWidth, videoHeight, enlarge } = toRefs(props);
const videoRef = ref(null)
const canvasVideoRef = ref(null)
const canvasRef = ref(null)
const mediaStream = ref(null)  // 摄像头视频流
const iSOnline = ref(false)  // 判断摄像头是否在线
const devicesList = ref([])  // 摄像头列表
const selectedDevice = ref(null)  // 已连接的设备信息
const indexReconnectionRef = ref(null) // 摄像头重连弹窗
const indexReconnectionVisible = ref(false) // 摄像头重连弹窗

provide('getISOnline', () => {
    return iSOnline.value
})

onBeforeUnmount(() => {
    closeMedia()
})
// 获取设备列表
const getMediaDevices = async () => {
    await navigator.mediaDevices.enumerateDevices().then((devices) => {
        devicesList.value = devices.filter(item => item.kind === 'videoinput')
        console.log('devices', devices)
    }).catch((err) => {
        console.log('enumerateDevices', err)
    })
}
// 开启摄像头
const openMedia = async (device) => {
    await getMediaDevices()
    if (devicesList.value.length === 0) {
        return
    }
    if (devicesList.value.length === 1 || device) {
        linkMedia(device || devicesList.value[0])
    }
}
// 链接摄像头
const linkMedia = (device) => {
    selectedDevice.value = device
    const constraints = {
        audio: false, // 音频轨道
        video: {
            width: videoWidth.value * enlarge.value,
            height: videoHeight.value * enlarge.value,
            deviceId: { exact: device.deviceId || undefined }  // 部分电脑查询不到摄像头的deviceId和label（有可能是电脑驱动问题），需要传undefined进去，才可调用摄像头
        } // 视频轨道
    }
    const mediaPromise = navigator.mediaDevices.getUserMedia(constraints)
    mediaPromise.then((stream) => {
        iSOnline.value = true
        mediaStream.value = stream
        videoRef.value.srcObject = stream
        videoRef.value.play()
        canvasVideoRef.value.srcObject = stream
        canvasVideoRef.value.play()
        // 延迟成功回调，解决画面出画时间慢，导致拍照异常的问题
        setTimeout(() => {
            emit('success')
        }, 1000)
    }).catch((err) => {
        console.log('getUserMedia', err)
        iSOnline.value = false
    })
}
// 拍照
const takePhoto = async () => {
    // mediaStream在摄像头拔出的一瞬间，active会从true变更为false，同时触发oninactive钩子，有了状态监听之后事情就简单了许多。代码经过测试后发现，对用户变更摄像头权限也有效。
    if ((mediaStream.value && !mediaStream.value.active) || !iSOnline.value) {
        mediaStream.value = null
        selectedDevice.value = null
        iSOnline.value = false
        await getMediaDevices()
        ElMessage.warning('摄像头掉线了，请检查！')
        emit('drop')

        // 掉线提示弹窗
        indexReconnectionVisible.value = true
        nextTick(() => {
            indexReconnectionRef.value.init()
        })
        return
    }
    const ctx = canvasRef.value.getContext('2d')
    ctx.drawImage(canvasVideoRef.value, 0, 0, videoWidth.value * enlarge.value, videoHeight.value * enlarge.value)
    const base64Data = canvasRef.value.toDataURL('image/jpeg', 1)
    emit('getImg', base64Data, selectedDevice.value)
    emit('getFile', base64ToFile(base64Data, 'filename'))
}
// 关闭摄像头
const closeMedia = () => {
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
        overflow: hidden;

        .video-dom{
            position: relative;
            z-index: 1;
            object-fit: fill;
        }

        .canvas-video-dom {
            position: absolute;
            z-index: 1;
            top: 0;
            right: 110%;
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
