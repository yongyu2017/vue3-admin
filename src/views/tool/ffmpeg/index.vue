<template>
    <div class="home">
        <input type="file" id="upload" ACCEPT="video/*" @change="upload">
        <p id="text">{{ msg }}</p>
        <div>开始时间：{{ startTime }}</div>
        <div>结束时间：{{ endTime }}</div>
        <div>用时：{{ zoneTime }}秒</div>
        <div>
            <a :href="downloadFileUrl" download="put.mp4">下载</a>
        </div>
        <video id="video" controls v-if="downloadFileUrl"></video>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { loadJS } from '@/utils/index'
const dayjs = require('dayjs')

let ffmpeg = null
const msg = ref(null)
const startTime = ref('')
const endTime = ref('')
const zoneTime = computed(() => {
    return startTime.value ? dayjs(endTime.value).diff(dayjs(startTime.value), 'second') : 0
})
const downloadFileUrl = ref('')
let mediainfo = null

onMounted(async () => {
    loadJSFun()
    await initFFmpeg()
    // if (!ffmpeg.isLoaded()) {
    //     await ffmpeg.load()
    // }
    console.log(ffmpeg)
    console.log('ffmpeg.isLoaded()', ffmpeg.isLoaded())
})
onUnmounted(() => {
    try {
        ffmpeg.exit() //ffmpeg.exit()用来杀死程序的执行，同时删除 MEMFS 释放内存
    } catch (e) {
        console.log(e)
    }
    ffmpeg = null
})

const loadJSFun = () => {
    loadJS('./static/mediainfo/mediainfo.js', () => {
        // eslint-disable-next-line
        MediaInfo({
            format: 'object', // object|JSON|XML|HTML|text
            locateFile: (path, prefix) => prefix + path, // Make sure WASM file is loaded from CDN location
        }, (res) => {
            mediainfo = res
        })
    })
}
const upload = (e) => {
    const file = e.target.files[0]

    getVideoInfo(file)
    FFmpegToTranscoding(file)
}
const getVideoInfo = (file) => {
    const getSize = () => file.size
    const readChunk = (chunkSize, offset) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target.error) {
                    reject(event.target.error)
                }
                resolve(new Uint8Array(event.target.result))
            }
            reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
        })

    mediainfo
        .analyzeData(getSize, readChunk)
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
}
// 初始化FFmpeg
const initFFmpeg = async () => {
    if (!ffmpeg) {
        ffmpeg = createFFmpeg({
            // corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
            corePath: './ffmpeg/core/ffmpeg-core.js',
            log: true,
            progress: ({ratio}) => {
                msg.value = `完成率: ${(ratio * 100.0).toFixed(2)}%`;
                endTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
            },
        })
        console.log('ffmpeg', ffmpeg)
    }
}
// FFmpeg业务处理
const FFmpegToTranscoding = async (file) => {
    const { name } = file
    // ffmpeg模块加载，需放在业务需要时，否则会造成内存泄漏问题
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load()
    }
    startTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    ffmpeg.FS('writeFile', name, await fetchFile(file))
    await ffmpeg.run('-i', name, '-r', '35', '-filter:v', 'setpts=0.25*PTS', '-b:v', '5m', 'put.mp4')
    const data = ffmpeg.FS('readFile', 'put.mp4')

    downloadFileUrl.value = URL.createObjectURL(new Blob([data.buffer], {
        type: 'video/mp4'
    }))
    nextTick(() => {
        const video = document.getElementById('video')
        video.src =  downloadFileUrl.value
    })
}
</script>

<style>

</style>
