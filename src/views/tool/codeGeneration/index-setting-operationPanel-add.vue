<template>
    <el-dialog
            @close="closeFun"
            :title="!dataForm.id ? '新增' : '修改'"
            :close-on-click-modal="false"
            v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px" class="indexSettingOperationPanelAdd-form">
            <el-form-item label="类型" prop="type">
                <el-select v-model="dataForm.type" placeholder="请选择" class="inp-dom" @change="formItemListComputed">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in selectListComputed('type')" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item :label="item.label" :prop="item.value" v-for="(item, index) in formItemListList" :key="index">
                <el-select v-model="dataForm[item.value]" placeholder="请选择" clearable class="inp-dom" v-if="item.type == 'select'">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in selectListComputed(item.value)" :key="index" />
                </el-select>
                <el-input v-model="dataForm[item.value]" placeholder="请输入" clearable class="inp-dom" v-if="item.type == 'text'"></el-input>
                <el-input v-model="dataForm[item.value]" placeholder="例：0:张三,1:李四" type="textarea" :rows="5" class="inp-dom" v-if="item.type == 'textarea'"></el-input>
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
    const lodash = require('lodash')

    const emit = defineEmits(['refreshDataList', 'close'])
    const visible = ref(false);
    const dataFormRef = ref();
    const dataForm_default = {
        id: '',  //修改时填写
        type: 'text',
        componentType: '',
        label: '',
        keyName: '',
        placeholder: '',
        className: '',
        maxlength: '',
        showWordLimit: false,
        clearable: false,
        disabled: false,
        readonly: false,
        showPassword: false,
        rows: 2,
        resize: 'none',
        multiple: false,
        multipleLimit: 0,
        filterable: false,
        dataList: '',
    }
    const dataForm = ref(lodash.cloneDeep(dataForm_default))
    const dataRule = ref({
        label: [
            { required: true, message: '请输入', trigger: 'blur' },
        ],
    })
    const selectList = ref({
        typeList: [
            { value: 'text', label: 'Input 文本框' },
            { value: 'password', label: 'Input 密码框' },
            { value: 'textarea', label: 'Input 文本域' },
            { value: 'select', label: 'Select 选择器' },
            { value: 'radio', label: 'Radio 单选框' },
            { value: 'checkboxGroup', label: 'CheckboxGroup 复选框组' },
            { value: 'checkbox', label: 'Checkbox 复选框' },
            { value: 'switch', label: 'Switch 开关' },
            { value: 'slider', label: 'Slider 滑块' },
            { value: 'rate', label: 'Rate 评分' },
            { value: 'inputNumber', label: 'Input Number 数字输入框' },
            { value: 'date', label: 'DatePicker 日期选择器 date' },
            { value: 'daterange', label: 'DatePicker 日期选择器 daterange' },
            { value: 'datetime', label: 'DatePicker 日期选择器 datetime' },
            { value: 'datetimerange', label: 'DatePicker 日期选择器 datetimerange' },
            { value: 'month', label: 'DatePicker 日期选择器 month' },
            { value: 'monthrange', label: 'DatePicker 日期选择器 monthrange' },
            { value: 'year', label: 'DatePicker 日期选择器 year' },
            { value: 'yearrange', label: 'DatePicker 日期选择器 yearrange' },
            { value: 'dates', label: 'DatePicker 日期选择器 dates' },
            { value: 'months', label: 'DatePicker 日期选择器 months' },
            { value: 'years', label: 'DatePicker 日期选择器 years' },
        ],
        sizeList: [
            { value: 'small', label: '小' },
            { value: 'default', label: '标准' },
            { value: 'large', label: '大' },
        ],
        datePickerList: [
            { value: 'year', label: 'year' },
            { value: 'years', label: 'years' },
            { value: 'month', label: 'month' },
            { value: 'months', label: 'months' },
            { value: 'date', label: 'date' },
            { value: 'dates', label: 'dates' },
            { value: 'datetime', label: 'datetime' },
            { value: 'datetimerange', label: 'datetimerange' },
            { value: 'daterange', label: 'daterange' },
            { value: 'monthrange', label: 'monthrange' },
            { value: 'yearrange', label: 'yearrange' },
        ],
    })
    const formItemList = [
        // { value: 'type', label: '类型', type: 'select' },
        { value: 'label', label: '标签名', type: 'text' },
        { value: 'keyName', label: '字段名', type: 'text' },
        { value: 'placeholder', label: '占位文本', type: 'text' },
        { value: 'className', label: '样式名', type: 'text' },
        { value: 'maxlength', label: '最大长度', type: 'text' },
        { value: 'showWordLimit', label: '是否显示统计字数', type: 'switch' },
        { value: 'clearable', label: '是否显示清除按钮', type: 'switch' },
        { value: 'disabled', label: '是否禁用', type: 'switch' },
        { value: 'readonly', label: '是否只读', type: 'switch' },
        { value: 'showPassword', label: '是否显示切换密码图标', type: 'switch' },
        { value: 'rows', label: '文本域行数', type: 'text' },
        { value: 'resize', label: '控制是否能被用户缩放', type: 'switch' },
        { value: 'multiple', label: '是否多选', type: 'switch' },
        { value: 'multipleLimit', label: '多选个数限制', type: 'text' },
        { value: 'filterable', label: '是否可筛选', type: 'switch' },
        { value: 'dataList', label: '数据列表', type: 'textarea' },
        { value: 'editable', label: '文本框可输入', type: 'switch' },
        { value: 'format', label: '显示在输入框中的格式', type: 'text' },
        { value: 'valueFormat', label: '绑定值的格式', type: 'text' },
        { value: 'valueFormat', label: '绑定值的格式', type: 'text' },
        { value: 'startPlaceholder', label: '范围选择时开始日期的占位内容', type: 'text' },
        { value: 'endPlaceholder', label: '范围选择时结束日期的占位内容', type: 'text' },
        { value: 'rangeSeparator', label: '选择范围时的分隔符', type: 'text' },
    ]
    const formItemListList = ref([])

    const selectListComputed = computed(() => {
        return (value) => {
            return selectList.value[value + 'List']
        }
    })

    // eslint-disable-next-line
    function init (item) {
        visible.value = true;
        item && (dataForm.value = item)

        nextTick(() => {
            formItemListComputed()
        })
    }
    function formItemListComputed () {
        const formTypeItem = formTypeList.find((value) => value.value.split('|').includes(dataForm.value.type))
        let list = []
        let dataForm_default_copy = lodash.cloneDeep(dataForm_default)

        formTypeItem.defaultSetting.forEach((value) => {
            dataForm_default_copy[value.label] = value.value
        })
        for (var i in dataForm_default_copy) {
            if (!['id', 'type', 'label', 'keyName'].includes(i)) {
                dataForm.value[i] = dataForm_default_copy[i]
            }
        }
        formTypeItem.keyList.forEach((value) => {
            const item = formItemList.find((value2) => value2.value == value)
            item && list.push(item)
        })

        formItemListList.value = list
    }
    // 表单提交
    async function dataFormSubmit () {
        const valid = await dataFormRef.value.validate((valid) => valid)
        if (!valid) {
            ElMessage.warning('请完善标红字段信息')
            return
        }

        visible.value = false
        dataForm.value.id = lodash.uniqueId()
        emit('refreshDataList', dataForm.value)
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
                align-items: flex-start;
                height: auto;
                line-height: 20px;
                text-align: right;
                padding: 10px 12px 0 0;
            }

            .el-form-item.is-required:not(.is-no-asterisk).asterisk-left>.el-form-item__label:before {
                margin-right: 3px;
                min-width: 0;
            }

            .el-form-item__content {
                align-items: baseline;
            }
        }
    }
</style>
