<template>
    <el-dialog @close="closeFun" title="歌曲标签" :close-on-click-modal="false" v-model="visible">
        <el-transfer
                v-model="dataForm.label"
                filterable
                :filter-method="filterMethod"
                filter-placeholder="请输入"
                :data="labelList"
                :props="{
                    key: 'value',
                    label: 'label',
                }"
                :titles="['未选', '已选']"
        />

        <template #footer>
            <el-affix position="bottom" :offset="0">
                <span class="dialog-footer">
                    <el-button @click="visible = false">取消</el-button>
                    <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
                </span>
            </el-affix>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick, defineExpose } from 'vue'
import { musicLabelListAll } from '@/api/music.js'

const visible = ref(false);
const dataForm = ref({
    label: [],
})
const emit = defineEmits(['refreshDataList', 'close'])
const labelList = ref([])

// eslint-disable-next-line
var init = (label) => {
    visible.value = true;
    dataForm.value.label = label

    nextTick(async () => {
        musicDirectoryListFun()
    })
}
const filterMethod = (query, item) => {
    return item.label.toLowerCase().includes(query.toLowerCase())
}
// 获取音乐类型
const musicDirectoryListFun = () => {
    musicLabelListAll().then(({ data }) => {
        data.list.forEach((value) => {
            value['label'] = value.name
            value['value'] = value.id + ''
        })
        labelList.value = data.list.slice()
    })
}
// 表单提交
const dataFormSubmit = () => {
    visible.value = false
    emit('refreshDataList', dataForm.value.label)
}
//关闭
const closeFun = () => {
    emit('close')
}

//暴露给父组件使用的方法和数据
defineExpose({
    dataForm,
    init,
})
</script>

<style lang="scss" scoped>
</style>
