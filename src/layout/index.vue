<template>
    <div
        class="site-wrapper"
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
    >
        <template v-if="!loading">
            <mainNavbar />
            <mainSidebar />
            <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight- 50 + 'px' }">
                <main-content v-if="!isRefresh" />
            </div>
        </template>
    </div>
</template>

<script setup>
import { provide, ref, nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStorePinia } from "@/store"
import mainContent from './main-content'
import mainNavbar from './main-navbar'
import mainSidebar from './main-sidebar'

const store = useStorePinia()
const { getUserInfo } = store;
let { documentClientHeight } = storeToRefs(store)
let loading = ref(true);
let isRefresh = ref(false); //main-content是否刷新

provide('refresh', () => {
    console.log('refresh')
    isRefresh.value = true;
    nextTick(() => {
        isRefresh.value = false;
    })
})

const updateDocumentClientHeight = function () {
    documentClientHeight.value = document.documentElement["clientHeight"];
    window.addEventListener('resize', () => {
        documentClientHeight.value = document.documentElement["clientHeight"];
    }, false)
}

onMounted(async () => {
    await getUserInfo()
    updateDocumentClientHeight()
    loading.value = false;
})

</script>
