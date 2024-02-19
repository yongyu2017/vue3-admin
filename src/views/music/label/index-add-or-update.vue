<template>
    <el-dialog @close="closeFun" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="90px">
            <el-form-item label="标签名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" clearable class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="dataForm.sort" :min="0" :precision="0" />
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
import { musicLabelAddOrModify, musicLabelGet } from '@/api/music.js'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    name: '',
    sort: 0,
})
const dataRule = ref({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    sort: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
const emit = defineEmits(['refreshDataList', 'close'])

// eslint-disable-next-line
var init = (id) => {
    visible.value = true;
    dataForm.value.id = id || ''

    nextTick(async () => {
        if (id) {
            musicLabelGet({
                id,
            }).then(({ data }) => {
                dataForm.value = data
            })
        }
    })
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })
            musicLabelAddOrModify(dataForm.value).then(() => {
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
