<template>
    <el-dialog
            @close="closeFun"
            :title="!dataForm.id ? '新增' : '修改'"
            :close-on-click-modal="false"
            v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px" class="indexSettingOperationPanelAdd-form">
            <el-form-item :label="item.label" :prop="item.value" v-for="(item, index) in formItemListComputed" :key="index">
                <el-select v-model="dataForm[item.value]" placeholder="请选择" class="inp-dom" v-if="item.type == 'select'">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in selectListComputed(item.value)" :key="index" />
                </el-select>
                <el-input v-model="dataForm[item.value]" placeholder="请输入" class="inp-dom" v-if="item.type == 'text'"></el-input>
                <el-switch v-model="dataForm[item.value]" v-if="item.type == 'switch'" />
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
    import { ref, defineEmits, nextTick, defineExpose, computed } from 'vue'
    import { ElMessage } from 'element-plus'
    import { formTypeList } from './formTypeList.js'

    const emit = defineEmits(['refreshDataList', 'close'])
    const visible = ref(false);
    const dataFormRef = ref();
    const dataForm = ref({
        id: '',  //修改时填写
        type: 'text',
        dataType: '',
        label: '',
        value: '',
        keyName: '',
        placeholder: '',
        size: '',
        width: '',
        height: '',
        className: '',
        maxlength: '',
        showWordLimit: false,
        clearable: false,
        disabled: false,
        readonly: false,
        showPassword: false,
        rows: 2,
        resize: 'none',
    })
    const dataRule = ref({
    })
    const typeList = ref([
        { value: 'text', label: '文本框' },
        { value: 'password', label: '密码框' },
        { value: 'textarea', label: '文本域' },
    ])
    const sizeList = ref([
        { value: 'small', label: '小' },
        { value: 'default', label: '标准' },
        { value: 'large', label: '大' },
    ])
    const formItemList = [
        { value: 'type', label: '类型', type: 'select' },
        { value: 'label', label: '标签名', type: 'text' },
        { value: 'value', label: '默认值', type: 'text' },
        { value: 'keyName', label: '字段名', type: 'text' },
        { value: 'placeholder', label: '占位文本', type: 'text' },
        { value: 'size', label: '尺寸', type: 'select' },
        { value: 'width', label: '宽度', type: 'text' },
        { value: 'height', label: '高度', type: 'text' },
        { value: 'className', label: '样式名', type: 'text' },
        { value: 'maxlength', label: '最大长度', type: 'text' },
        { value: 'showWordLimit', label: '是否显示统计字数', type: 'switch' },
        { value: 'clearable', label: '是否显示清除按钮', type: 'switch' },
        { value: 'disabled', label: '是否禁用', type: 'switch' },
        { value: 'readonly', label: '是否只读', type: 'switch' },
        { value: 'showPassword', label: '是否显示切换密码图标', type: 'switch' },
        { value: 'rows', label: '文本域行数', type: 'switch' },
        { value: 'resize', label: '控制是否能被用户缩放', type: 'switch' },
    ]

    const formItemListComputed = computed(() => {
        const formTypeItem = formTypeList.find((value) => value.value == dataForm.value.type)
        if (dataForm.value.id == '') {
            formTypeItem.defaultSetting.forEach((value) => {
                dataForm.value[value.label] = value.value
            })
        }
        return formItemList.filter((value) => {
            return formTypeItem.keyList.includes(value.value)
        })
    })
    const selectListComputed = computed(() => {
        return (value) => {
            console.log([value + 'List'].value)
            return [value + 'List'].value
        }
    })

    // eslint-disable-next-line
    function init (item) {
        visible.value = true;
        item && (dataForm.value = item)

        nextTick(() => {
        })
    }

    // 表单提交
    async function dataFormSubmit () {
        const valid = await dataFormRef.value.validate((valid) => valid)
        if (!valid) {
            ElMessage.warning('请完善标红字段信息')
            return
        }

        visible.value = false
        emit('refreshDataList')
        ElMessage.success('操作成功')
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
    .indexSettingOperationPanelAdd-form {
        display: flex;
        flex-wrap: wrap;

        .el-form-item {
            width: 33.333%;
        }

        &::v-deep.el-form {
            .el-form-item__label {
                align-items: center;
                line-height: 20px;
                text-align: right;
            }

            .el-form-item.is-required:not(.is-no-asterisk).asterisk-left>.el-form-item__label:before {
                margin-right: 3px;
                min-width: 0;
            }
        }
    }
</style>
