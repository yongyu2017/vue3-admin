<template>
    <el-dialog @close="closeFun" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="120px">
            <el-form-item label="歌曲名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="歌曲类型" prop="directory">
                <el-cascader v-model="dataForm.directory" :options="directoryList" class="inp-dom" />
            </el-form-item>
            <el-form-item label="上传mp3文件" prop="fileid">
                <div style="width: 100%">
                    <el-upload
                        v-model:file-list="dataForm.fileid"
                        :limit="1"
                        :auto-upload="false"
                        @change="beforeUpload($event, 'fileid')"
                    >
                        <template #trigger>
                            <el-button type="primary">选择文件</el-button>
                        </template>
                    </el-upload>
                </div>
            </el-form-item>
            <el-form-item label="上传歌词文件" prop="lrc">
                <div style="width: 100%">
                    <el-upload
                        v-model:file-list="dataForm.lrc"
                        :limit="1"
                        :auto-upload="false"
                        @change="beforeUpload($event, 'lrc')"
                    >
                        <template #trigger>
                            <el-button type="primary">选择文件</el-button>
                        </template>
                    </el-upload>
                </div>
            </el-form-item>
            <el-form-item label="歌曲描述" prop="des">
                <el-input v-model="dataForm.des" placeholder="请输入" :rows="5" type="textarea" maxlength="500" show-word-limit class="inp-dom" style="width: 100%"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, nextTick, defineExpose } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { musicDirectoryList, musicLibraryGet, musicLibraryAddOrModify } from '@/api/music.js'
import { getSuffix, deepCopy } from '@/utils/index'
import { menuToTreeMenu } from '@/utils/index'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    name: '',
    directory: [],
    fileid: [],
    lrc: [],
    des: '',
})
const dataRule = ref({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    directory: [
        { required: true, message: '请选择', trigger: 'change' },
    ],
    // fileid: [
    //     { required: true, message: '请选择', trigger: 'change' },
    // ],
})
const emit = defineEmits(['refreshDataList', 'close'])
const fileTypeList = ref(['mp3'])
const fileSizeLimit = ref(20) // 文件大小限制，单位:MB
const lrcFileTypeList = ref(['lrc', 'txt'])
const directoryList = ref([])

// eslint-disable-next-line
var init = (id) => {
    visible.value = true;
    dataForm.value.id = id || ''

    nextTick(async () => {
        musicDirectoryListFun()
        if (id) {
            musicLibraryGet({
                id,
            }).then(({ data }) => {
                data.fileid = data.fileid ? data.fileList.filter((value) => value.id == data.fileid) : []
                data.lrc = data.lrc ? data.fileList.filter((value) => value.id == data.lrc) : []
                data.directory = data.directory ? data.directory.split(',') : []
                dataForm.value = data
            })
        }
    })
}
// 获取音乐类型
const musicDirectoryListFun = () => {
    musicDirectoryList().then(({ data }) => {
        data.menuList.forEach((value) => {
            value['label'] = value.name
            value['value'] = value.id + ''
        })
        directoryList.value = menuToTreeMenu(data.menuList);
    })
}
// 图片文件，change
const beforeUpload = (e, type) => {
    const file = e.raw
    const fileSuffix = getSuffix(file.name)[1]

    if (type == 'fileid') {
        if (!fileTypeList.value.includes(fileSuffix)) {
            ElMessage.warning('请上传' + fileTypeList.value.join(',') + '格式文件！')
            dataForm.value.fileid = []
            return
        }

        if (file.size > fileSizeLimit.value * 1024 * 1024) {
            ElMessage.warning('请上传小于' + fileSizeLimit.value + 'MB的文件！')
            dataForm.value.fileid = []
            return
        }
        dataForm.value.fileid = [file]
    }
    if (type == 'lrc') {
        if (!lrcFileTypeList.value.includes(fileSuffix)) {
            ElMessage.warning('请上传' + lrcFileTypeList.value.join(',') + '格式文件！')
            dataForm.value.lrc = []
            return
        }

        if (file.size > fileSizeLimit.value * 1024 * 1024) {
            ElMessage.warning('请上传小于' + fileSizeLimit.value + 'MB的文件！')
            dataForm.value.lrc = []
            return
        }
        dataForm.value.lrc = [file]
    }
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const formData = new FormData()
            let dataFromCopy = deepCopy(dataForm.value)
            dataFromCopy.fileid = dataForm.value.fileid.length > 0 ? dataForm.value.fileid[0].id ?  dataForm.value.fileid[0].id : dataForm.value.fileid[0] : ''
            dataFromCopy.lrc = dataForm.value.lrc.length > 0 ? dataForm.value.lrc[0].id ? dataForm.value.lrc[0].id : dataForm.value.lrc[0] : ''
            dataFromCopy.directory = dataFromCopy.directory.join(',')
            for (let i in dataFromCopy) {
                formData.append(i, dataFromCopy[i])
            }
            const loading = ElLoading.service({
                lock: true,
            })
            musicLibraryAddOrModify(formData).then(() => {
                loading.close()
                visible.value = false
                emit('refreshDataList')
                ElMessage.success('操作成功！')
            }).catch(() => {
                loading.close()
            })
        }
    })
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
    .upload-file-list {
        line-height: 1;

        li {
            margin: 0 8px 8px 0;
            vertical-align: top;
        }

        .img-preview {
            position: relative;
            z-index: 0;
            margin: 0 8px 8px 0;
            display: inline-block;
            padding: 0;
            line-height: 1;
            font-size: 0;
            border: 1px solid var(--el-border-color);
            border-radius: 6px;
            box-sizing: border-box;
            overflow: hidden;

            .el-image {
                width: 178px;
                height: 178px;
            }

            .file-actions {
                position: absolute;
                z-index: 2;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                cursor: default;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: var(--el-overlay-color-lighter);
                transition: opacity var(--el-transition-duration);

                &:hover {
                    opacity: 1;
                }

                .el-icon {
                    font-size: 26px;
                }

                span {
                    display: inline-flex;
                    cursor: pointer;

                    &+span {
                        margin-left: 1em;
                    }
                }
            }
        }

        .file-li {
            position: relative;
            z-index: 0;
            display: inline-block;
            width: 178px;
            height: 178px;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            outline: none;
            transition: var(--el-transition-duration-fast);
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            overflow: hidden;
            &:hover {
                border-color: var(--el-color-primary);
            }

            .icon-wrap {
                position: absolute;
                z-index: 2;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);

                .el-icon {
                    color: #8c939d;
                    font-size: 46px;
                }
            }

            .file-btn {
                position: absolute;
                z-index: 4;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                font-size: 180px;
                opacity: 0;
            }
        }
    }
</style>
