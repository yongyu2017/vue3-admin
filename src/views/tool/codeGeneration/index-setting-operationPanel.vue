<template>
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="80px">
        <el-form-item label="筛选项" prop="options">
            <div class="options-list-wrap">
                <div class="options-list">
                    <div class="options-item" v-for="(item, index) in dataForm.options" :key="index">
                        <div class="name">{{ item.label }}</div>
                        <div class="btn-box">
                            <span class="btn" title="编辑" @click="addOrUpdateFun(item)">
                                <el-icon><Edit /></el-icon>
                            </span>
                            <span class="btn" title="向上" @click="sortFun(1, index)">
                                <el-icon><Top /></el-icon>
                            </span>
                            <span class="btn" title="向下" @click="sortFun(0, index)">
                                <el-icon><Bottom /></el-icon>
                            </span>
                            <span class="btn txt-color-danger" title="删除" @click="delFun(index)">
                                <el-icon><Delete /></el-icon>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="add-btn" title="新增" @click="addOrUpdateFun()">
                    <el-icon><Plus /></el-icon>
                </div>
            </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
    </el-form>

    <!-- 新增或者修改 -->
    <indexSettingOperationPanelAdd ref="indexSettingOperationPanelAddRef" @refreshDataList="indexSettingOperationPanelAdd_refreshDataList" @close="indexSettingOperationPanelAddVisible= false" v-if="indexSettingOperationPanelAddVisible"></indexSettingOperationPanelAdd>
</template>

<script setup>
    import { ref, nextTick, inject } from 'vue'
    import indexSettingOperationPanelAdd from './index-setting-operationPanel-add.vue'
    import { ElMessage } from 'element-plus'
    const lodash = require('lodash')

    const operationPanel_form_update = inject('operationPanel_form_update')
    const dataForm = ref({
        options: [],
    })
    const dataRule = ref({
        options: [
            { required: true, message: '请选择', trigger: 'change' },
        ],
    })
    const dataFormRef = ref(null)
    const indexSettingOperationPanelAddRef = ref(null)
    const indexSettingOperationPanelAddVisible = ref(false)

    //新增或者修改
    function addOrUpdateFun (item) {
        indexSettingOperationPanelAddVisible.value = true;
        nextTick(() => {
            indexSettingOperationPanelAddRef.value.init(item)
        })
    }
    function indexSettingOperationPanelAdd_refreshDataList (item) {
        const Index = dataForm.value.options.findIndex((value) => value.id == item.id)
        const options_sort_list = dataForm.value.options.map((value) => value.sort)
        const maxValue = options_sort_list.length > 0 ? lodash.max(options_sort_list) : 0

        if (Index == -1) {
            dataForm.value.options.push({
                ...item,
                sort: maxValue + 1
            })
        } else {
            dataForm.value.options[Index] = item
        }
    }
    function delFun (Index) {
        dataForm.value.options.splice(Index, 1)
    }
    // type值0向下1向上
    function sortFun (type, Index) {
        if (type == 1 && Index == 0) return
        if (type == 0 && Index == (dataForm.value.options.length - 1)) return
        const options_copy = lodash.cloneDeep(dataForm.value.options)
        let index1 = Index
        let index2 = type == 0 ? Index + 1 : Index - 1
        let item1 = options_copy[index1]
        let item2 = options_copy[index2]

        lodash.set(options_copy, index1, item2)
        lodash.set(options_copy, index2, item1)
        dataForm.value.options = options_copy
    }
    // 表单提交
    async function dataFormSubmit () {
        const valid = await dataFormRef.value.validate((valid) => valid)
        if (!valid) {
            ElMessage.warning('请完善标红字段信息')
            return
        }

        operationPanel_form_update(lodash.cloneDeep(dataForm.value))
        ElMessage.success('操作成功')
    }
</script>

<style lang="scss" scoped>
    .options-list-wrap {
        display: flex;
        width: 100%;

        .add-btn {
            margin-left: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            cursor: pointer;
            background-color: #efefef;
            border-radius: 6px;

            &:hover {
                opacity: 0.7;
            }
        }
    }

    .options-list {
        flex: 1;
        min-width: 0;

        .options-item {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            line-height: 1;
            padding: 7px 12px;
            border: 1px solid #dcdcdc;
            border-radius: 6px;

            .name {
                margin-right: 12px;
                flex: 1;
                min-width: 0;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .btn-box {
                .btn {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;

                    &.disabled {
                        opacity: 0.3;

                        &:hover {
                            opacity: 0.3;
                        }
                    }

                    &:hover {
                        opacity: 0.6;
                    }
                }
            }
        }
    }

</style>
