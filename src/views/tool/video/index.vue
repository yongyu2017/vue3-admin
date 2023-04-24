<template>
    <el-button type="primary" @click="showVideoJs('videojs')">videojs播放器</el-button>
    <el-button type="primary" @click="showVideoJs('xgplayer')">xgplayer播放器</el-button>

    <!-- videojs播放器 -->
    <indexVideojs ref="indexVideojsRef" @close="indexVideojsVisible= false" v-if="indexVideojsVisible"></indexVideojs>
    <!-- xgplayer播放器 -->
    <indexXgplayer ref="indexXgplayerRef" @close="indexXgplayerVisible= false" v-if="indexXgplayerVisible"></indexXgplayer>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import indexVideojs from './index-videojs.vue'
import indexXgplayer from './index-xgplayer.vue'

const indexVideojsRef = ref(null)
const indexVideojsVisible = ref(false)
const indexXgplayerRef = ref(null)
const indexXgplayerVisible = ref(false)

// 打开videojs播放器
const showVideoJs = (name) => {
    if (name == 'videojs') {
        indexVideojsVisible.value = true
        nextTick(() => {
            indexVideojsRef.value.init()
        })
    } else if (name == 'xgplayer') {
        indexXgplayerVisible.value = true
        nextTick(() => {
            indexXgplayerRef.value.init()
        })
    }
}
</script>

<style>

</style>
