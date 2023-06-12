<template>
    <el-dialog
        @close="closeFun"
        title="xgplayer"
        :close-on-click-modal="false"
        v-model="visible">

        <el-button type="primary" @click="initVideo(videoList[0])">mp4</el-button>
        <el-button type="primary" @click="initVideo(videoList[1])">flv</el-button>
        <el-button type="primary" @click="initVideo(videoList[2])">m3u8</el-button>

        <div id="mse" style="width: 500px; height: 360px; margin-top: 20px"></div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
/* eslint-disable */
import { ref, defineEmits, nextTick, defineExpose } from 'vue'
/** 经测试xgplayer2.31.2、xgplayer-flv.js2.1.2、xgplayer-hls.js2.5.2等固定版本下，才可以正常播放视频 **/
import Player from 'xgplayer'
import FlvJsPlayer from 'xgplayer-flv.js'
import HlsJsPlayer from 'xgplayer-hls.js'
import { getSuffix } from '@/utils/index'

const visible = ref(false)
const emit = defineEmits(['refreshDataList', 'close'])
const videoList = ref([
    'https://www.runoob.com/try/demo_source/movie.mp4',
    '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv',
    '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8',
])
const player = ref(null)

// eslint-disable-next-line
var init = () => {
    visible.value = true;

    nextTick(() => {
    })
}

const initVideo = (url) => {
    const fileType = getSuffix(url)[1]
    if (player.value) {
        player.value.destroy(true)
        player.value = null
    }

    setTimeout(() => {
        switch (fileType) {
            case 'mp4':
                initVideoForMp4(url)
                break
            case 'flv':
                initVideoForFlv(url)
                break
            case 'm3u8':
                initVideoForHls(url)
                break
        }
    }, 0)
}
// 渲染mp4播放器
const initVideoForMp4 = (url) => {
    player.value = new Player({
        id: 'mse',
        url,
        width: '500px',
        height: '360px',
        ignores: ['fullscreen'],
        cssFullscreen: false,
        playsinline: true,
        autoplay: true,
        lang: 'zh-cn',
    })
}
// 渲染Flv播放器
const initVideoForFlv = (url) => {
    player.value = new FlvJsPlayer({
        id: 'mse',
        url,
        width: '500px',
        height: '360px',
        ignores: ['fullscreen'],
        cssFullscreen: false,
        playsinline: true,
        autoplay: true,
        lang: 'zh-cn',
    })
}
// 渲染hls播放器
const initVideoForHls = (url) => {
    player.value = new HlsJsPlayer({
        id: 'mse',
        url,
        width: '500px',
        height: '360px',
        ignores: ['fullscreen'],
        cssFullscreen: false,
        playsinline: true,
        autoplay: true,
        lang: 'zh-cn',
    })
}
//关闭
const closeFun = () => {
    emit('close')
}

//暴露给父组件使用的方法和数据
defineExpose({
    init,
})
</script>
