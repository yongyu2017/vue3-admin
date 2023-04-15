<template>
    <el-button type="primary" @click="generateFun">生成</el-button>
</template>

<script setup>
import { onMounted } from 'vue'
import { ElLoading } from 'element-plus'
import { templateGenerate } from '@/api/system'

onMounted(() => {
    console.log('demo')
})

// 生成
const generateFun = () => {
    const loading = ElLoading.service({
        lock: true,
    })

    templateGenerate().then(() => {
        loading.close()
    }).catch(() => {
        loading.close()
    })
}
</script>

<style lang="scss" scoped>
</style>
