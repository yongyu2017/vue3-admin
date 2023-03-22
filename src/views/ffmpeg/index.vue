<template>
    <div class="home">
        <h2>视频前端压缩</h2>
        <video id="video" controls></video><br />
        <input type="file" id="upload" ACCEPT="video/*" @change="upload">
        <p id="text">{{ msg }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    log: true,
    progress: ({ratio}) => {
        msg.value = `完成率: ${(ratio * 100.0).toFixed(2)}%`;
    },
})

const msg = ref(null)
onMounted(async () => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load()
    }
})

const upload = async (e) => {
    var { name } = e.target.files[0];
    ffmpeg.FS('writeFile', name, await fetchFile(e.target.files[0]))
    await ffmpeg.run('-i', name, '-b', '2000000', 'put.mp4')
    const data = ffmpeg.FS('readFile', 'put.mp4')
    console.log(data)
    const video = document.getElementById('video')
    video.src = URL.createObjectURL(new Blob([data.buffer], {
        type: 'video/mp4'
    }))
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
