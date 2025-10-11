<template>
    <div
        :class="['site-wrapper', isExpand ? '' : 'collapse', route.meta.isFullPage ? 'isFullPage' : '']"
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
    >
        <template v-if="!loading">
            <indexNavbar />
            <indexTabs ref="indexTabsRef" />
            <indexSidebar />
            <indexContent v-if="!isRefresh" />
        </template>
    </div>
</template>

<script setup>
import { provide, ref, nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStorePinia } from '@/store'
import { useRoute } from 'vue-router'
import indexContent from './index-content'
import indexNavbar from './index-navbar'
import indexSidebar from './index-sidebar'
import indexTabs from './index-tabs.vue'

const store = useStorePinia()
const { getUserInfo } = store
let { isExpand } = storeToRefs(store)
let loading = ref(true)
let isRefresh = ref(false) //main-content是否刷新
const route = useRoute()
const indexTabsRef = ref(null)

provide('refresh', () => {
    isRefresh.value = true;
    nextTick(() => {
        isRefresh.value = false;
    })
})
provide('closeCurrentPage', () => {
    indexTabsRef.value.tabsCloseCurrentHandle()
})

onMounted(async () => {
    await getUserInfo()
    loading.value = false
})
</script>
