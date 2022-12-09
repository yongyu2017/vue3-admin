<template>
    <div class="video-tack-photo-wrap">
        <video ref="videoRef" autoplay="autoplay" :width="videoWidth" :height="videoHeight" class="video-dom"></video>

        <canvas ref="canvasRef" :width="videoWidth" :height="videoHeight" class="canvas-dom"></canvas>
    </div>
</template>

<script setup>
import { ref, toRefs, defineProps, defineEmits, defineExpose } from 'vue'

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

// 开启摄像头
const openMedia = () => {
    let constraints = {
        audio: false, //音频轨道
        video: { width: videoWidth.value, height: videoHeight.value }  //视频轨道
    }
    let mediaPromise = navigator.mediaDevices.getUserMedia(constraints);
    mediaPromise.then((stream) => {
        mediaStream.value = stream;
        videoRef.value.srcObject = stream;
        videoRef.value.play();
    }).catch((err) => {
        console.log(err)
    })
}
// 拍照
let takePhoto = () => {
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
}
</style>
