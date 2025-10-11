<template>
    <router-view></router-view>
</template>

<script setup>
    // import { onMounted } from 'vue'
    // import { useRoute, useRouter } from 'vue-router'
    // import { storeToRefs } from 'pinia'
    // import { useStorePinia } from '@/store'
    //
    // const router = useRouter()
    // const route = useRoute()
    // const store = useStorePinia()
    // const { count } = storeToRefs(store)
    //
    // const navigatorFun = (name) => {
    //     router.push({
    //         name,
    //     })
    // }
    //
    // onMounted(() => {
    //     console.log(route, route.path)
    // })
    import { onMounted } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useStorePinia } from '@/store'

    const store = useStorePinia()
    const { documentClientWidth, documentClientHeight, isExpand, isMobile, resizeNumber } = storeToRefs(store)

    onMounted(() => {
        updateDocumentClientHeight()
    })

    function updateDocumentClientHeight () {
        documentClientWidth.value = document.documentElement['clientWidth']
        documentClientHeight.value = document.documentElement['clientHeight']
        isExpand.value = documentClientWidth.value <= 750 ? false : true
        isMobile.value = documentClientWidth.value <= 750 ? true : false

        window.addEventListener('resize', () => {
            documentClientWidth.value = document.documentElement['clientWidth']
            documentClientHeight.value = document.documentElement['clientHeight']
            resizeNumber.value++
            isExpand.value = documentClientWidth.value <= 750 ? false : true
            isMobile.value = documentClientWidth.value <= 750 ? true : false
        }, false)
    }
</script>

<style lang="scss">
    @import '@/assets/style/index.scss'
</style>
