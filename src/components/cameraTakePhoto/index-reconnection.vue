<template>
    <el-dialog @close="closeFun" title="温馨提示" :close-on-click-modal="false" v-model="visible" width="500px">
        <div style="margin-bottom: 12px">未检测到摄像设备，请先连接设备后再继续</div>
        <div>
            <el-button @click="reconnectionFun">重新连接</el-button>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="dataFormSubmit()">我已连接</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick, defineExpose, inject } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList', 'close', 'reconnection'])
const visible = ref(false)
const getISOnline = inject('getISOnline')

var init = () => {
    visible.value = true;

    nextTick(() => {
    })
}
// 重连
const reconnectionFun = () => {
    emit('reconnection')
}
// 表单提交
const dataFormSubmit = () => {
    if (getISOnline()) {
        emit('refreshDataList')
        visible.value = false
    } else {
        ElMessage.warning('摄像头掉线了，请检查！')
    }
}
//关闭
const closeFun = () => {
    emit('close')
}

//暴露给父组件使用的方法和数据
defineExpose({
    init,
})
</script>

<style lang="scss" scoped>
</style>
