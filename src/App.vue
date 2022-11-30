<template>
    <router-view></router-view>
</template>

<script setup>
// import { useRoute } from "vue-router"
import { onMounted } from "vue"
// import { storeToRefs } from "pinia"
// import { useStorePinia } from "@/store"

// const router = useRouter()
// const route = useRoute()
// const store = useStorePinia()
// const { count } = storeToRefs(store)

// const navigatorFun = (name) => {
//     router.push({
//         name,
//     })
// }

onMounted(() => {
    // console.log(route, route.path)
})
</script>

<style lang="scss">
@import '@/assets/style/index.scss'
</style>
