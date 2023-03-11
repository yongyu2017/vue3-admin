<template>
    <div>A组件</div>
</template>

<script setup>
import { defineExpose, reactive } from 'vue'

const componentName = reactive('a')
const init = () => {
    console.log('a')
}
//暴露给父组件使用的方法和数据
defineExpose({
    init,
    componentName,
})
</script>

<style>

</style>
