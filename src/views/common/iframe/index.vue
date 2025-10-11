<template>
    <div class="table-flex-page">
        <iframe
            :src="route.meta.iframeUrl"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="yes">
        </iframe>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style>

</style>
