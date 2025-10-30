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
        name: '',
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
        config.value.header = e.options.slice()
        console.log(config.value.header)
    }

    //暴露给父组件使用的方法和数据
    defineExpose({
        update,
    })
</script>

<style lang="scss" scoped>
</style>
