<template>
    <div class="codeGeneration-page">
        <indexPreview ref="indexPreviewRef"></indexPreview>
        <indexSetting ref="indexSettingRef"></indexSetting>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import indexPreview from './index-preview.vue'
    import indexSetting from './index-setting.vue'

    const indexPreviewRef = ref(null)
    const indexSettingRef = ref(null)
</script>

<style lang="scss" scoped>
    .codeGeneration-page {
        position: absolute;
        top: 20px;
        right: 20px;
        bottom: 20px;
        left: 20px;
        display: flex;

        .table-flex-page {
            position: relative;
            top: auto;
            right: auto;
            bottom: auto;
            left: auto;
            flex: 1;
            min-width: 0;
        }
    }
</style>
