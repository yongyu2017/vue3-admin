<template>
    <el-dialog
        @close="closeFun"
        title="videojs"
        :close-on-click-modal="false"
        v-model="visible">

        <div style="width: 500px; height: 360px">
            <video
                ref="videoDom"
                class="video-js"
                controls
                preload="auto"
                width="100%"
                height="100%"
            >
            </video>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick, defineExpose } from 'vue'
// import 'flv.js'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-flvjs-es6'

const visible = ref(false)
const emit = defineEmits(['refreshDataList', 'close'])
const videoDom = ref(null)
let videoPlayer = null

// eslint-disable-next-line
var init = () => {
    visible.value = true;

    nextTick(() => {
        initVideo()
    })
}

const initVideo = () => {
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
    // 注：flv视频文件，有部分文件可能无法播放，m3u8不需要设置type
    // videoPlayer.src({ src: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv', type: 'video/x-flv' })
    videoPlayer.src({ src: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8' })
    // videoPlayer.src({ src: 'http://192.168.1.15/file/xdygxfile/video/2023/1608259900327190529/e2977d44-659b-4b46-b5a1-5f5229b898f3.flv', type: 'video/x-flv' })
    // videoPlayer.src({ src: 'https://www.runoob.com/try/demo_source/movie.mp4', type: 'video/mp4' })
}
//关闭
const closeFun = () => {
    emit('close')
    if (videoPlayer) {
        videoPlayer.pause()
        videoPlayer.currentTime(0)
        videoPlayer.dispose()
    }
}

//暴露给父组件使用的方法和数据
defineExpose({
    init,
})
</script>
