<template>
    <div
        :class="['site-wrapper', isExpand ? '' : 'collapse']"
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
    >
        <template v-if="!loading">
            <indexNavbar />
            <indexSidebar />
            <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight- 50 + 'px' }">
                <indexContent v-if="!isRefresh" />
            </div>
        </template>
    </div>
</template>

<script setup>
import { provide, ref, nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStorePinia } from "@/store"
import { dictDataListAll } from '@/api/system.js'
import indexContent from './index-content'
import indexNavbar from './index-navbar'
import indexSidebar from './index-sidebar'

const store = useStorePinia()
const { getUserInfo, setDictType } = store;
const { documentClientHeight, isExpand } = storeToRefs(store)
const loading = ref(true);
const isRefresh = ref(false); //main-content是否刷新

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
    dictDataListAllFun()
    updateDocumentClientHeight()
    loading.value = false;
})
// 获取数据字典
const dictDataListAllFun = () => {
    dictDataListAll().then((res) => {
        if (res.code == 200) {
            setDictType(res.data)
        }
    })
}
</script>
