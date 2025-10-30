<template>
    <el-tabs v-model="activeName" class="setting-box">
        <el-tab-pane label="操作盘" name="operationPanel">
            <indexSettingOperationPanel ref="indexSettingOperationPanelRef"></indexSettingOperationPanel>
        </el-tab-pane>
        <el-tab-pane label="配置文件" name="config">

            <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="80px">
                <el-form-item label="配置文件" prop="config">
                    <el-input type="textarea" v-model="dataForm.config" placeholder="请输入" :rows="10" show-word-limit />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dataFormSubmit(1)">确定</el-button>
                    <el-button type="primary" @click="dataFormSubmit(2)">下载</el-button>
                </el-form-item>
            </el-form>

        </el-tab-pane>
        <el-tab-pane label="代码预览" name="preview">

            <el-input type="textarea" v-model="codePreview" placeholder="" :rows="10" show-word-limit readonly />

        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
    import { ref } from 'vue'
    import indexSettingOperationPanel from './index-setting-operationPanel.vue'
    import { ElLoading, ElMessage } from 'element-plus'
    import { toolCodeGenerationGeneration, toolCodeGenerationPreview } from '@/api/tool.js'
    import { downloadForBlob } from '@/utils/download.js'

    const dataForm = ref({
        config: `{
    "componentName": "MyComponent",
    "props": {
        "title": { "type": "String", "default": "默认标题" },
        "count": { "type": "Number", "required": true }
    },
    "events": ["submit", "cancel"],
    "slots": {
        "default": "默认内容区域",
        "footer": "底部区域"
    },
    "children": [
        {
            "component": "el-button",
            "props": { "type": "primary" },
            "text": "提交按钮",
            "events": { "click": "handleSubmit" }
        }
    ]
}`,
    })
    const dataRule = ref({
        config: [
            { required: true, message: '请输入', trigger: 'blur' },
        ],
    })
    const dataFormRef = ref(null)
    const activeName = ref('operationPanel')
    const codePreview = ref('')
    const indexSettingOperationPanelRef = ref(null)

    // 表单提交
    const dataFormSubmit = (type = 1) => {
        dataFormRef.value.validate((valid) => {
            if (valid) {
                const loading = ElLoading.service({
                    lock: true,
                })

                const fn = type == 1 ? toolCodeGenerationPreview : toolCodeGenerationGeneration
                fn({
                    ...dataForm.value,
                }).then((res) => {
                    loading.close()

                    if (res.code == 200) {
                        ElMessage.success('操作成功')
                        if (type == 1) {
                            codePreview.value = res.data
                        } else {
                            downloadForBlob(res.data.file, res.data.filename)
                        }
                    }
                }).catch(() => {
                    loading.close()
                })
            }
        })
    }
</script>

<style lang="scss" scoped>
    .setting-box {
        width: 400px;
    }
</style>
