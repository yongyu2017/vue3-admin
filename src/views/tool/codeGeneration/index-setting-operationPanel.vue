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
                            <span class="btn" title="向上">
                                <el-icon><Top /></el-icon>
                            </span>
                            <span class="btn" title="向下">
                                <el-icon><Bottom /></el-icon>
                            </span>
                            <span class="btn txt-color-danger" title="删除">
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
    </el-form>

    <!-- 新增或者修改 -->
    <indexSettingOperationPanelAdd ref="indexSettingOperationPanelAddRef" @refreshDataList="indexSettingOperationPanelAdd_refreshDataList" @close="indexSettingOperationPanelAddVisible= false" v-if="indexSettingOperationPanelAddVisible"></indexSettingOperationPanelAdd>
</template>

<script setup>
    import { ref, nextTick } from 'vue'
    import indexSettingOperationPanelAdd from './index-setting-operationPanel-add.vue'

    const dataForm = ref({
        options: [],
    })
    const dataRule = ref({
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
        dataForm.value.options.push(item)
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

                    &:hover {
                        opacity: 0.6;
                    }
                }
            }
        }
    }

</style>
