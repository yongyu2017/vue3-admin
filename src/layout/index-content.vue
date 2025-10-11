<template>
    <div :class="['site-content__wrapper', route.meta.isTab ? 'has-tabs' : '']">
        <div class="site-content">
            <el-card class="el-card-main" :style="siteContentViewHeight">
                <router-view v-slot="{ Component }">
                    <keep-alive :include="keepAliveIncludeList" :max="15">
                        <component :is="Component"></component>
                    </keep-alive>
                </router-view>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStorePinia } from '@/store'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useStorePinia()
const { documentClientHeight, mainTabs } = storeToRefs(store)
const keepAliveIncludeList = ref([
]) // 修复F5刷新页面时，keepAlive缓存页面未触发onActivated问题，所以提前缓存所有需要缓存页面

const siteContentViewHeight = computed(() => {
    let height = documentClientHeight.value - 50 - 30
    if (route.meta.isFullPage) {
        height += 50 + 30
    }
    if (route.meta.isTab) {
        height -= 40
    }

    return { minHeight: height + 'px' }
})
const mainTabsComputed = computed(() => {
    return mainTabs.value.map((value) => {
        return {
            name: value.name,
            keepAlive: value.keepAlive
        }
    })
})

watch(() => mainTabsComputed.value, (newVal) => {
    keepAliveIncludeList.value = newVal.filter((value) => value.keepAlive).map((value) => value.name)
}, {
    deep: true,
})

</script>

<style lang="scss" scoped>
    .el-card-main {
        position: relative;
    }
</style>

