<template>
    <el-dialog
        @close="closeFun"
        :title="!dataForm.id ? '新增' : '修改'"
        :close-on-click-modal="false"
        v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px">
            <el-form-item label="类型">
                <el-radio-group v-model="dataForm.type">
                    <el-radio :label="item.value" v-for="(item, index) in typeList" :key="index">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="menuNameStr" prop="menuName">
                <el-input v-model="dataForm.menuName" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select
                    class="inp-dom"
                    v-model="dataForm.parentId"
                    :data="parentIdList"
                    check-strictly
                    filterable
                    :render-after-expand="false">
                </el-tree-select>
            </el-form-item>
            <el-form-item label="排序" prop="orderNum" v-if="dataForm.type !== 2">
                <el-input-number v-model="dataForm.orderNum" :step="1" step-strictly  class="inp-dom" />
            </el-form-item>
            <el-form-item label="菜单路由" prop="jumpUrl" v-if="dataForm.type === 1">
                <el-input v-model="dataForm.jumpUrl" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="授权标识" prop="roleUrl" v-if="dataForm.type === 2">
                <el-input v-model="dataForm.roleUrl" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon" v-if="dataForm.type != 2">
                <el-popover
                    placement="top-end"
                    title=""
                    :width="600"
                    trigger="click"
                    :teleported="false"
                >
                    <div class="icon-list-box">
                        <div class="flex-box">
                            <div class="item" v-for="(item, index) in iconList" :key="index">
                                <el-button :type="dataForm.icon == item ? 'primary' : 'info'" plain :icon="item" @click="iconChange(item)"></el-button>
                            </div>
                        </div>
                    </div>
                    <template #reference>
                        <el-input v-model="dataForm.icon" placeholder="请选择" clearable class="inp-dom"></el-input>
                    </template>
                </el-popover>
            </el-form-item>
            <el-form-item label="菜单状态">
                <el-radio-group v-model="dataForm.status">
                    <el-radio :label="item.value" v-for="item in menuStatus" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="显示状态" v-if="dataForm.type != '2'">
                <el-radio-group v-model="dataForm.visible">
                    <el-radio :label="item.value" v-for="item in menuStatus" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否缓存" v-if="dataForm.type == '1'">
                <el-radio-group v-model="dataForm.keepAlive">
                    <el-radio :label="item.value" v-for="item in menuStatus" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
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
import { ElLoading, ElMessage } from 'element-plus'
import { userNav, userGetNav, userAddOrModifyNav } from '@/api/user'
import { menuToTreeMenu, nullToEmptyString } from '@/utils'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    menuName: '',
    type: 0,
    parentId: '',
    jumpUrl: '',
    roleUrl: '',
    icon: '',
    orderNum: 0,
    status: '1',
    visible: '1',
    keepAlive: '1',
})
const dataRule = ref({
    menuName: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    parentId: [
        { required: true, message: '请选择', trigger: 'change' },
    ],
    orderNum: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
const typeList = ref([
    { value: 0, name: '目录'},
    { value: 1, name: '菜单'},
    { value: 2, name: '按钮'},
])
const parentIdList = ref([]);
const iconList = Object.entries(ElementPlusIconsVue).map((value) => {
    return value[0]
})
const emit = defineEmits(['refreshDataList', 'close'])
const menuNameStr = computed(() => {
    let str = '';
    typeList.value.forEach((value) => {
        (value.value == dataForm.value.type) && (str = value.name + '名称：')
    })

    return str
})
const menuStatus = ref([
    { label: '开启', value: '1' },
    { label: '关闭', value: '0' },
])

// eslint-disable-next-line
var init = (item) => {
    visible.value = true;

    nextTick(() => {
        userNavFun()
        if (item) {
            userGetNav({
                id: item.id,
            }).then(({ data }) => {
                data.status = nullToEmptyString(data.status) + ''
                data.visible = nullToEmptyString(data.visible) + ''
                data.keepAlive = nullToEmptyString(data.keepAlive) + ''
                dataForm.value = data;
                console.log(dataForm.value)
            })
        }
    })
}
// 获取上级菜单
const userNavFun = () => {
    userNav().then(({ data }) => {
        data.menuList = data.menuList.filter((value) => {
            value['value'] = value.id;
            value['label'] = value.menuName;
            return value.type === 0 || value.type === 1
        })
        parentIdList.value = [
            {
                value: 0,
                label: '一级菜单',
                children: menuToTreeMenu(data.menuList),
            }
        ]
    })
}
// 图标选择
const iconChange = (icon) => {
    dataForm.value.icon = dataForm.value.icon == icon ? '' : icon;
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })

            userAddOrModifyNav({
                ...dataForm.value
            }).then(() => {
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
.icon-list-box{
    height: 220px;
    overflow-y: auto;
    .el-button--primary{
        color: var(--el-color-white);
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary);
    }
    .el-button{
        font-size: 16px;
    }
    .flex-box{
        display: flex;
        flex-wrap: wrap;
        .item{
            padding: 4px;
        }
    }
}
</style>
