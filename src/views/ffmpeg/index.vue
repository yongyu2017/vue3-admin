<template>
    <div class="home">
        <h2>视频前端压缩</h2>
        <video id="video" controls v-if="downloadFileUrl"></video><br />
        <input type="file" id="upload" ACCEPT="video/*" @change="upload">
        <p id="text">{{ msg }}</p>
        <div>开始时间：{{ startTime }}</div>
        <div>结束时间：{{ endTime }}</div>
        <div>用时：{{ zoneTime }}秒</div>
        <div>
            <a :href="downloadFileUrl" download="put.mp4">下载</a>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
const dayjs = require('dayjs')

let ffmpeg = null
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
}
const msg = ref(null)
const startTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const endTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const zoneTime = computed(() => {
    return dayjs(endTime.value).diff(dayjs(startTime.value), 'second')
})
const downloadFileUrl = ref('')

onMounted(async () => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load()
    }
})
onUnmounted(() => {
    ffmpeg = null
})

const upload = async (e) => {
    var { name } = e.target.files[0];
    ffmpeg.FS('writeFile', name, await fetchFile(e.target.files[0]))
    await ffmpeg.run('-i', name, '-r', '35', '-filter:v', 'setpts=0.25*PTS', 'put.mp4')
    const data = ffmpeg.FS('readFile', 'put.mp4')
    console.log(data)
    downloadFileUrl.value = URL.createObjectURL(new Blob([data.buffer], {
        type: 'video/mp4'
    }))
    nextTick(() => {
        const video = document.getElementById('video')
        video.src =  downloadFileUrl.value
    })

    // const ffmpeg = createFFmpeg({
    //     log: true,
    //     progress: ({ratio}) => {
    //         msg.value = `完成率: ${(ratio * 100.0).toFixed(2)}%`;
    //     },
    // });
    // await ffmpeg.load()
    // var {name} = e.target.files[0];
    // console.log(name)
    // msg.value = '正在加载 ffmpeg-core.js'
    // await ffmpeg.load();
    // msg.value = "开始压缩"
    // ffmpeg.FS('writeFile', name, await fetchFile(e.target.files[0]));
    // await ffmpeg.run('-i', name, '-b', '2000000', 'put.mp4');
    // msg.value = '压缩完成'
    // const data = ffmpeg.FS('readFile', 'put.mp4');
    // const video = document.getElementById('video');
    // video.src = URL.createObjectURL(new Blob([data.buffer], {
    //     type: 'video/mp4'
    // }))
}
</script>

<style>

</style>
