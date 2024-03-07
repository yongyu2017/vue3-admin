<template>
    <el-dialog @close="closeFun" title="批量上传" :close-on-click-modal="false" v-model="visible" class="el-dialog-fixed">
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between" v-loading="dataListLoading">
            <input type="file" multiple @change="uploadChange" />
            <el-button type="primary" @click="startUpload">开始上传</el-button>
        </div>

        <el-table :data="dataList" border style="width: 100%">
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="fileid_name" label="mp3">
                <template #default="scope">
                    {{ scope.row.fileid_name + '(' + fileSizeComputed(scope.row.fileid.size) + 'KB)' }}
                </template>
            </el-table-column>
            <el-table-column prop="lrc_name" label="歌词">
                <template #default="scope">
                    <span v-if="scope.row.lrc_name">{{ scope.row.lrc_name + '(' + fileSizeComputed(scope.row.lrc.size) + 'KB)' }}</span>

                </template>
            </el-table-column>
            <el-table-column prop="duration" label="时长"></el-table-column>
            <el-table-column prop="status" label="状态" width="160">
                <template #default="scope">
                    <el-text size="default" type="info" v-if="scope.row.status == 0">未上传</el-text>
                    <el-text size="default" type="info" v-if="scope.row.status == 1">上传中（{{ scope.row.uploadProgress }}）</el-text>
                    <el-text size="default" type="success" v-if="scope.row.status == 2">已上传</el-text>
                    <el-text size="default" type="danger" v-if="scope.row.status == 3">上传失败</el-text>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
                <template #default="scope">
                    <div v-loading="scope.row.status == 1">
                        <el-button type="primary" link @click="uploadFun(scope.row, scope.$index)" v-if="scope.row.status != 2">{{ scope.row.status == 0 ? '上传' : '重新上传' }}</el-button>
                        <el-button type="primary" link @click="delFun(scope.$index)" v-if="scope.row.status != 2">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <template #footer>
            <el-affix position="bottom" :offset="0">
                <span class="dialog-footer">
                    <el-button @click="visible = false">取消</el-button>
                </span>
            </el-affix>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick, defineExpose, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { musicLibraryAddOrModify } from '@/api/music.js'
import { getSuffix, deepCopy, secondToTime } from '@/utils/index'

const emit = defineEmits(['refreshDataList', 'close'])
const visible = ref(false);
const dataList = ref([]);
const dataListLoading = ref(false);
const fileTypeList = ref(['.m4a', '.aac', '.mp3', '.wav'])
const fileSizeLimit = ref(20) // 文件大小限制，单位:MB
const lrcFileTypeList = ref(['.lrc', '.txt'])
let fileUploadSuccess = false

const fileSizeComputed = computed(function () {
    return (size) => {
        return (size / 1024).toFixed(2)
    }
})

// eslint-disable-next-line
var init = () => {
    visible.value = true;

    nextTick(async () => {
    })
}
// 图片文件，change
const uploadChange = async (e) => {
    let filesList = Object.values(e.target.files)
    const lrcList = filesList.filter((value) => {
        const fileSuffix = getSuffix(value.name)[0].toLowerCase()
        return lrcFileTypeList.value.includes(fileSuffix)
    })
    let mp3List = await Promise.all(filesList.filter((value) => {
        const fileSuffix = getSuffix(value.name)[0].toLowerCase()
        return fileTypeList.value.includes(fileSuffix)
    }).map(async (value) => {
        const fileSuffix = getSuffix(value.name)[0]
        const fileName = value.name.replace(fileSuffix, '')
        const duration = await getMp3Times(value)
        const lrc = lrcList.find((value2) => {
            return value2.name.replace(getSuffix(value2.name)[0], '') === fileName
        })
        return {
            name: fileName,
            fileid: value,
            fileid_name: value.name,
            lrc,
            lrc_name: lrc ? lrc.name: '',
            duration,
            label: '',
            des: '',
            sort: 0,
            status: 0,
            uploadProgress: '0%',
        }
    }))
    dataList.value = mp3List
}
// 获取时长
const getMp3Times = (file) => {
    return new Promise((resolve) => {
        var url = URL.createObjectURL(file)
        var audioElement = new Audio(url)
        audioElement.addEventListener('loadedmetadata', () => {
            resolve(secondToTime(Math.floor(audioElement.duration)).date)
        })
    })
}
// 开始上传
const startUpload = async () => {
    for (var i = 0; i < dataList.value.length; i++) {
        const item = dataList.value[i]
        if (item.status == 0 || item.status == 3) {
            await uploadFun(dataList.value[i], i)
        }
    }
}
// 删除
const delFun = (Index) => {
    dataList.value.splice(Index, 1)
}
// 上传
const uploadFun = (item, Index) => {
    return new Promise((resolve) => {
        if (item.fileid.size > fileSizeLimit.value * 1024 * 1024 || (item.lrc && item.lrc.size > fileSizeLimit.value * 1024 * 1024)) {
            ElMessage.warning('请上传小于' + fileSizeLimit.value + 'MB的mp3或者lrc文件')
            resolve({ code: -1 })
            return
        }
        const formData = new FormData()
        let dataFromCopy = deepCopy(item)
        dataFromCopy.fileid = item.fileid
        dataFromCopy.lrc = item.lrc
        for (let i in dataFromCopy) {
            formData.append(i, dataFromCopy[i])
        }
        dataListLoading.value = true
        dataList.value[Index].status = 1
        musicLibraryAddOrModify(formData, (e) => {
            const uploadProgress = ((e.loaded / e.total) * 100).toFixed(2) + '%'
            dataList.value[Index].uploadProgress = uploadProgress
        }).then(() => {
            dataListLoading.value = false
            fileUploadSuccess = true
            ElMessage.success('上传成功')
            dataList.value[Index].status = 2
            resolve({ code: 0 })
        }).catch(() => {
            dataListLoading.value = false
            dataList.value[Index].status = 3
            resolve({ code: -1 })
        })
    })
}
//关闭
const closeFun = () => {
    fileUploadSuccess &&  emit('refreshDataList')
    emit('close')
}

//暴露给父组件使用的方法和数据
defineExpose({
    init,
})
</script>

<style lang="scss" scoped>
</style>
