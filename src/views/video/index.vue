<template>
    <video
        ref="videoDom"
        class="video-js"
        controls
        preload="auto"
        width="100%"
        height="100%"
    >
    </video>
</template>

<script setup>
import { onMounted, ref, onDeactivated, onBeforeUnmount } from 'vue'
// import 'flv.js'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-flvjs-es6'

const videoDom = ref(null)
let videoPlayer

onMounted(async () => {
    videoPlayer = videojs(videoDom.value, {
        autoplay: false,  //自动播放
        controls: true,  //用户可以与之交互的控件
        loop: false,  //视频一结束就重新开始
        muted: false,  //默认情况下将使所有音频静音
        aspectRatio: '16:9', //显示比率
        disablePictureInPicture: true,
        fullscreen:{
            options: {navigationUI: 'hide'}
        },
        techOrder: ['html5', 'flvjs'],
        flvjs: {
            mediaDataSource: {
                isLive: false,
                cors: true,
                withCredentials: false,
            },
        },
    })
    // 注：flv视频文件，有部分文件可能无法播放
    videoPlayer.src({ src: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv', type: 'video/x-flv' })
    // videoPlayer.src({ src: 'http://192.168.1.15/file/xdygxfile/video/2023/1608259900327190529/e2977d44-659b-4b46-b5a1-5f5229b898f3.flv', type: 'video/x-flv' })
    // videoPlayer.src({ src: 'https://www.runoob.com/try/demo_source/movie.mp4', type: 'video/mp4' })
})
onDeactivated(() => {
    console.log('onDeactivated')
    if (videoPlayer) {
        videoPlayer.dispose()
        videoPlayer.pause()
        videoPlayer.currentTime(0)
    }
})
onBeforeUnmount(() => {
    console.log('onBeforeUnmount')
    if (videoPlayer) {
        videoPlayer.pause()
        videoPlayer.currentTime(0)
        videoPlayer.dispose()
    }
})

</script>

<style>

</style>
