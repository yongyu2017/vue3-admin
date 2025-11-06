<template>
    <div class="table-flex-page">
        <el-form :inline="true" :model="formData" @submit.prevent v-if="config.header.length > 0">
            <el-form-item :label="item.label" v-for="(item, index) in config.header" :key="index">
                <el-input
                        v-if="item.type == 'text'"
                        v-model="formData[item.keyName]"
                        type="text"
                        :placeholder="item.placeholder"
                        :clearable="item.clearable"
                        :disabled="item.disabled"
                        :readonly="item.readonly"
                        :maxlength="item.maxlength"
                        :showWordLimit="item.showWordLimit"
                        :class="[classNameComputed(item)]"
                        :style="[styleComputed(item)]"
                />
                <el-input
                        v-if="item.type == 'password'"
                        v-model="formData[item.keyName]"
                        type="password"
                        :placeholder="item.placeholder"
                        :clearable="item.clearable"
                        :disabled="item.disabled"
                        :readonly="item.readonly"
                        :maxlength="item.maxlength"
                        :showPassword="item.showPassword"
                        :class="[classNameComputed(item)]"
                        :style="[styleComputed(item)]"
                />
                <el-input
                        v-if="item.type == 'textarea'"
                        v-model="formData[item.keyName]"
                        type="textarea"
                        :placeholder="item.placeholder"
                        :disabled="item.disabled"
                        :readonly="item.readonly"
                        :maxlength="item.maxlength"
                        :showWordLimit="item.showWordLimit"
                        :rows="item.rows"
                        :resize="item.resize"
                        :class="[classNameComputed(item)]"
                        :style="[styleComputed(item)]"
                />
                <el-select
                        v-if="item.type == 'select'"
                        v-model="formData[item.keyName]"
                        :placeholder="item.placeholder"
                        :clearable="item.clearable"
                        :disabled="item.disabled"
                        :multiple="item.multiple"
                        :multipleLimit="Number(item.multipleLimit)"
                        :filterable="item.filterable"
                        :class="[classNameComputed(item)]"
                        :style="[styleComputed(item)]"
                >
                    <el-option v-for="(item, index) in selectListComputed(item.dataList)" :key="index" :label="item.label" :value="item.value" />
                </el-select>
                <el-radio-group
                        v-if="item.type == 'radio'"
                        v-model="formData[item.keyName]"
                        :disabled="item.disabled"
                >
                    <el-radio v-for="(item, index) in selectListComputed(item.dataList)" :key="index" :value="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
                <el-checkbox-group
                        v-if="item.type == 'checkboxGroup'"
                        v-model="formData[item.keyName]"
                        :disabled="item.disabled"
                >
                    <el-checkbox v-for="(item, index) in selectListComputed(item.dataList)" :key="index" :value="item.value">{{ item.label }}</el-checkbox>
                </el-checkbox-group>
                <el-checkbox
                        v-if="item.type == 'checkbox'"
                        v-model="formData[item.keyName]"
                        :disabled="item.disabled"
                >{{ item.label }}</el-checkbox>
                <el-switch
                        v-if="item.type == 'switch'"
                        v-model="formData[item.keyName]"
                        :disabled="item.disabled"
                />
                <el-slider
                        v-if="item.type == 'slider'"
                        v-model="formData[item.keyName]"
                        :disabled="item.disabled"
                        :class="[classNameComputed(item)]"
                />
                <el-rate
                        v-if="item.type == 'rate'"
                        v-model="formData[item.keyName]"
                        :disabled="item.disabled"
                        :clearable="item.clearable"
                />
                <el-input-number
                        v-if="item.type == 'inputNumber'"
                        v-model="formData[item.keyName]"
                        :disabled="item.disabled"
                />
                <el-date-picker
                        v-if="['daterange', 'datetimerange', 'monthrange', 'yearrange'].includes(item.type)"
                        v-model="formData[item.keyName]"
                        :type="item.type"
                        :range-separator="item.rangeSeparator"
                        :start-placeholder="item.startPlaceholder"
                        :end-placeholder="item.endPlaceholder"
                        :format="item.format"
                        :value-format="item.valueFormat"
                        :disabled="item.disabled"
                        :clearable="item.clearable"
                        :editable="item.editable"
                        :readonly="item.readonly"
                        :class="[classNameComputed(item)]"
                />
                <el-date-picker
                        v-if="['date', 'datetime', 'month', 'year', 'dates', 'months', 'years'].includes(item.type)"
                        v-model="formData[item.keyName]"
                        :type="item.type"
                        :placeholder="item.placeholder"
                        :format="item.format"
                        :value-format="item.valueFormat"
                        :disabled="item.disabled"
                        :clearable="item.clearable"
                        :editable="item.editable"
                        :readonly="item.readonly"
                        :class="[classNameComputed(item)]"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchFun">查询</el-button>
                <el-button @click="resetFun">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { onMounted, ref, computed, defineExpose } from 'vue'
    import { personnelPeopleList } from '@/api/personnel'
    const lodash = require('lodash')

    const defaultFormData = {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
    }
    const formData = ref(lodash.cloneDeep(defaultFormData))
    const dataList = ref([])
    const dataListLoading = ref(false)
    const config = ref({
        header: [],
    })

    const classNameComputed = computed(() => {
        return (item) => {
            return item.className
        }
    })
    const styleComputed = computed(() => {
        return (item) => {
            let style = {}

            if (item.width !== '') {
                style['width'] = item.width
            }
            if (item.height !== '') {
                style['height'] = item.height
            }

            return style
        }
    })
    const selectListComputed = computed(() => {
        return (val) => {
            let list = []

            if (val) {
                list = val.split(',').map((value) => {
                    return {
                        value: value.split(':')[0],
                        label: value.split(':')[1],
                    }
                })
            }

            return list
        }
    })

    onMounted(() => {
        queryList()
    })

    // 获取员工列表
    function queryList () {
        dataListLoading.value = true

        personnelPeopleList({
            ...formData.value
        }).then((res) => {
            dataListLoading.value = false

            if (res.code == 200) {
                dataList.value = res.data.list.slice()
                formData.value.totalPage = res.data.sum
            }
        }).catch(() => {
            dataListLoading.value = false
        })
    }
    // 重置
    const resetFun = () => {
        formData.value = lodash.cloneDeep(defaultFormData)
        searchFun()
    }
    // 搜索
    const searchFun = () => {
        formData.value.pageIndex = 1;
        queryList()
    }
    // 每页数
    const sizeChangeHandle = (val) => {
        formData.value.pageSize = val
        formData.value.pageIndex = 1;
        queryList()
    }
    // 当前页
    const currentChangeHandle = (val) => {
        formData.value.pageIndex = val
        queryList()
    }
    function update (e) {
        let header_keyName = {}
        config.value.header = e.options.slice()
        config.value.header.forEach((value) => {
            let val = ''
            if (!value.keyName) return
            if (['checkbox', 'switch'].includes(value.type)) {
                val = false
            }
            if (['inputNumber'].includes(value.type)) {
                val = undefined
            }

            header_keyName[value.keyName] = val
        })

        formData.value = lodash.cloneDeep({
            ...header_keyName,
            ...defaultFormData,
        })
        console.log(config.value.header, formData.value)
    }

    //暴露给父组件使用的方法和数据
    defineExpose({
        update,
    })
</script>

<style lang="scss" scoped>
</style>
