<template>
    <el-dialog @close="closeFun" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" v-model="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px">
            <el-form-item label="商品名称：" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="商品分类：" prop="category">
                <el-select v-model="dataForm.category" placeholder="请选择" filterable class="inp-dom">
                    <el-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品图片：" prop="img">
                <div>
                    <ul class="upload-file-list">
                        <li class="img-preview" v-if="dataForm.imgUrl">
                            <el-image :src="dataForm.imgUrl" fit="cover" />
                            <span class="file-actions">
                            <span>
                                <el-icon @click="showImageViewer = true"><zoom-in /></el-icon>
                            </span>
                            <span>
                                <el-icon @click="delImgFun"><Delete /></el-icon>
                            </span>
                        </span>
                            <Teleport to="body">
                                <el-image-viewer @close="showImageViewer = false" :url-list="[dataForm.imgUrl]" v-if="showImageViewer"/>
                            </Teleport>
                        </li>
                        <li class="file-li">
                        <span class="icon-wrap">
                            <el-icon><Plus /></el-icon>
                        </span>
                            <input type="file" class="file-btn" @change="fileChange">
                        </li>
                    </ul>
                    <div class="info-txt">支持格式：{{ fileTypeList.join(',') }}，单个文件不能超过{{ fileLimit }}MB</div>
                </div>
            </el-form-item>
            <el-form-item label="商品描述：" prop="des">
                <el-input v-model="dataForm.des" placeholder="请输入" :rows="3" type="textarea" class="inp-dom"></el-input>
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
import { goodsGoodsAddOrModify, goodsGoodsDetail, goodsCategoryList } from '@/api/goods'
import { getSuffix } from '@/utils/index'

const dataFormRef = ref();
const visible = ref(false);
const dataForm = ref({
    id: '',  //修改时填写
    name: '',
    category: '',
    img: '',
    imgUrl: '',
    des: '',
})
const dataRule = ref({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    category: [
        { required: true, message: '请选择', trigger: 'change' },
    ],
    img: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
})
const categoryList = ref([])
const emit = defineEmits(['refreshDataList', 'close'])
const showImageViewer = ref(false)
const fileTypeList = ref(['jpg', 'jpeg', 'png'])
const fileLimit = ref(1) // 文件大小限制，单位:MB

// eslint-disable-next-line
var init = (id) => {
    visible.value = true;
    dataForm.value.id = id || ''

    nextTick(async () => {
        goodsCategoryListFun()
        if (id) {
            goodsGoodsDetail({
                id,
            }).then(({ data }) => {
                data.imgUrl = data.img
                dataForm.value = data
            })
        }
    })
}
// 获取商品分类
const goodsCategoryListFun = () => {
    goodsCategoryList({
        name: '',
        pageIndex: '',
        pageSize: '',
    }).then(({ data }) => {
        categoryList.value = data.list.slice()
    })
}
// 图片文件，change
const fileChange = (e) => {
    const file = e.target.files[0]
    const fileSuffix = getSuffix(file.name)[1]

    if (!fileTypeList.value.includes(fileSuffix)) {
        ElMessage.warning('请上传' + fileTypeList.value.join(',') + '格式文件！')
        return
    }
    if (file.size > fileLimit.value * 1024 * 1024) {
        ElMessage.warning('请上传小于' + fileLimit.value + 'MB的文件！')
        return
    }
    const reader = new FileReader()
    reader.onloadend = function () {
        dataForm.value.img = e.target.files[0]
        dataForm.value.imgUrl = reader.result
        dataFormRef.value.validateField('img')
    }
    reader.readAsDataURL(e.target.files[0])
}
// 删除图片
const delImgFun = () => {
    dataForm.value.img = ''
    dataForm.value.imgUrl = ''
}
// 表单提交
const dataFormSubmit = () => {
    dataFormRef.value.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
            })
            const formData = new FormData()
            const filterKey = ['imgUrl']
            for (let i in dataForm.value) {
                !filterKey.includes(i) && formData.append(i, dataForm.value[i])
            }

            goodsGoodsAddOrModify(formData).then(() => {
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
                    font-size: 36px;
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
