<template>
    <el-dialog
        @close="closeFun"
        title="上传证件照"
        :close-on-click-modal="false"
        v-model="visible">
        
        <div class="avatar-crop">
            <VueCropper
                class="crop-box" 
                ref="cropper" 
                :img="options.img"
                :outputSize="options.outputSize"
                :outputType="options.outputType"
                :autoCrop="options.autoCrop" 
                :fixedBox="options.fixedBox" 
                :canMoveBox="options.canMoveBox" 
                :autoCropWidth="options.autoCropWidth" 
                :autoCropHeight="options.autoCropHeight" 
                :centerBox="options.centerBox" 
                :canMove="options.canMove" 
                :canScale="options.canScale" 
                :enlarge="options.enlarge">
            </VueCropper>

            <div class="crop-op fix">
                <div class="scale-box">
                    <el-button @click="scale--">
                        <el-icon>
                            <Minus />
                        </el-icon>
                    </el-button>
                    <div class="el-slider-wrap">
                        <el-slider v-model="scale" :max="10" />
                    </div>
                    <el-button @click="scale++">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-button>
                </div>
                <div class="rotate-box">
                    <el-button @click="rotateFun('left')">
                        <el-icon class="icon-btn">
                            <RefreshLeft />
                        </el-icon>
                    </el-button>
                    <el-button @click="rotateFun('right')">
                        <el-icon class="icon-btn">
                            <RefreshRight />
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, toRefs, watch, nextTick, defineProps, defineEmits, defineExpose } from 'vue';
import VueCropper from "vue-cropper/src/vue-cropper.vue"

const props = defineProps({
    outputSize: {
        type: Number,
        default: 1,
    },
    outputType: {
        type: String,
        default: 'jpeg',
    },
    autoCropWidth: {
        type: [String, Number],
        default: '80%',
    },
    autoCropHeight: {
        type: [String, Number],
        default: '80%',
    },
    enlarge: {
        type: Number,
        default: 1,
    },
    outputDataType : {
        type: String,
        default: 'base64',  //outputDataType值，base64|blob
    },
    canScale: {
        type: Boolean,
        default: true
    },
})
const { outputSize, outputType, autoCropWidth, autoCropHeight, enlarge, outputDataType, canScale } = toRefs(props)
const options = ref({
    img: '', // url 地址, base64, blob
    outputSize: outputSize.value,  // 裁剪生成图片的质量0.1 ~ 1
    outputType: outputType.value,  // 裁剪生成图片的格式jpeg, png, webp
    fixedBox: true, // 固定截图框大小
    canMoveBox: false, // 截图框能否拖动
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: autoCropWidth.value, // 截图框宽度
    autoCropHeight: autoCropHeight.value, // 截图框高度
    centerBox: false, // 截图框是否被限制在图片里面
    canMove: true, // 上传图片是否可以移动
    canScale: canScale.value, // 图片是否允许滚轮缩放
    enlarge: enlarge.value,  //图片根据截图框输出比例倍数
})
const cropper = ref(null)
const scale = ref(0);
const visible = ref(false)
const emit = defineEmits(['refreshDataList', 'close'])

watch(scale, (newVal, oldVal) => {
    const isPlus = newVal > oldVal ? true : false;
    cropper.value.changeScale(isPlus ? 1 : -1)
})

// eslint-disable-next-line
var init = (img) => {
    options.value.img = img;
    visible.value = true;

    nextTick(() => {
    })
}
/* eslint-disable */
// 获取截图的 base64 数据
const getCropData = () => {
    return new Promise((resolve) => {
        cropper.value.getCropData(data => {
            resolve(data)
        })
    })
}
// 获取截图的 blob 数据
const getCropBlob = () => {
    return new Promise((resolve) => {
        cropper.value.getCropBlob(data => {
            resolve(data)
        })
    })
}
/* eslint-disable */
// 旋转
const rotateFun = (direction) => {
    if (direction == 'right') {
        cropper.value.rotateRight()
    } else {
        cropper.value.rotateLeft()
    }
    console.log(cropper.value)
}
// 表单提交
const dataFormSubmit = async () => {
    const data = outputDataType.value == 'blob' ? await getCropBlob() : await getCropData()
    visible.value = false;
    emit('refreshDataList', data)
}
//关闭
const closeFun = () => {
    emit('close')
}

//暴露给父组件使用的方法和数据
defineExpose({
    init,
})
</script>

<style lang="scss" scoped>
.avatar-crop {
    position: relative;
    width: 380px;
    .crop-box {
        height: 300px;
    }
    .crop-op{
    margin-top: 16px;
    .scale-box{
        display: flex;
        float: left;
        width: 70%;
        .el-button{
            height: 26px;
            padding: 0 5px;
            border-radius: 0;
        }
    }
    .el-slider-wrap{
        width: 100%;
        padding: 0 16px;
        .el-slider{
            height: 26px;
            /deep/.el-slider__button-wrapper{
                top: -10px;
                width: 26px;
                height: 26px;
            }
            /deep/.el-slider__button{
                width: 12px;
                height: 12px;
                background-color: #409eff;
            }
        }
    }
    .rotate-box{
        margin-left: 70%;
        text-align: right;
        .el-button{
            height: 26px;
            padding: 0 8px;
            font-size: 20px;
            background: none;
            border: 0;
            &+.el-button{
                margin-left: 6px;
            }
        }
    }
    }
}
</style>
