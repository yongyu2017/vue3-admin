import { onActivated, onDeactivated, onBeforeUnmount, ref, nextTick, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStorePinia } from '@/store'
import { delayRun } from '@/utils/index.js'
const lodash = require('lodash')

export function elTableScrollMixin (dataList, dataListLoading) {
    const store = useStorePinia()
    const { isMobile } = storeToRefs(store)
    const elTableRef = ref(null)
    let elTable_scrollX = 0
    let elTable_scrollY = 0
    let dataList_copy = []
    const dataList_limit = 100 // 列表数据数量限制。如果超过100条数据，则在页面路由跳出前清空列表数据，以保证页面路由切换时候不卡顿，再切换回来时，再赋值回去

    const $elTable_fixed_computed = computed(() => {
        return (e) => {
            return isMobile.value ? false : e
        }
    })

    onBeforeUnmount(() => {
        elTableRef.value = null
        elTable_scrollX = 0
        elTable_scrollY = 0
    })
    onBeforeRouteLeave(() => {
        const el_scrollbar__wrap_dom = elTableRef.value?.$refs.bodyWrapper.querySelector('.el-scrollbar__wrap')
        elTable_scrollX = el_scrollbar__wrap_dom?.scrollLeft || 0
        elTable_scrollY = el_scrollbar__wrap_dom?.scrollTop || 0
    })
    onDeactivated(() => {
        if (elTableRef.value && dataList && dataList.value.length > dataList_limit) {
            dataList_copy = lodash.cloneDeep(dataList.value)
            dataList.value = []
        }
    })
    onActivated(async () => {
        if (elTableRef.value) {
            if (dataList_copy.length > 0) {
                dataListLoading.value = true

                await delayRun(280)
                dataList.value = lodash.cloneDeep(dataList_copy)
                dataList_copy = []
                dataListLoading.value = false
            }

            nextTick(() => {
                elTableRef.value?.scrollTo(elTable_scrollX, elTable_scrollY)
            })
        }
    })

    return {
        elTableRef,
        $elTable_fixed_computed,
    }
}
