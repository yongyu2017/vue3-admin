<template>
    <el-button type="primary" @click="preveiwFun">预览</el-button>

    <div class="imagePreview__wraper" v-if="false">
        <div class="imagePreview__mask"></div>

        <span class="imagePreview__close">
             <i class="icon icon-close"></i>
        </span>

        <span class="imagePreview__prev">
             <i class="icon icon-arrowLeft"></i>
        </span>

        <span class="imagePreview__next">
             <i class="icon icon-arrowRight"></i>
        </span>

        <span class="imagePreview__loading">
             <i class="icon icon-loading"></i>
        </span>

        <div class="imagePreview__canvas">
            <img :src="imgUrl[0]" alt="" class="imagePreview__img" />
        </div>

        <div class="imagePreview__actions">
            <div class="imagePreview__actions__inner">
                <div class="item">
                    <i class="icon icon-zoomOut"></i>
                </div>
                <div class="item">
                    <i class="icon icon-zoomIn"></i>
                </div>
                <div class="item">
                    <i class="icon icon-reset"></i>
                </div>
                <div class="item">
                    <i class="icon icon-rorateLeft"></i>
                </div>
                <div class="item">
                    <i class="icon icon-rorateRight"></i>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted } from 'vue'
import ImagePreview from '@/utils/imagePreview/index'

const imgUrl = [
    require('@/assets/img/img1.jpg'),
    require('@/assets/img/img2.jpg'),
    require('@/assets/img/img3.jpg'),
    '/static/测试文件.pdf',
    require('@/assets/img/img4.jpg'),
]
onMounted(() => {
})

const preveiwFun = () => {
    console.log('preveiwFun')
    new ImagePreview({
        urls: imgUrl,
        current: imgUrl[0],
        slideChange: function (index, that) {
            if (index == 3) {
                that.imagePreviewContent.querySelector('.imagePreview__canvas').innerHTML = '<iframe src="' + imgUrl[index] + '" style="width: 100%; height: 100%"></iframe>'
                that.imagePreviewContent.querySelector('.imagePreview__actions').style.display = 'none'
            } else {
                that.imagePreviewContent.querySelector('.imagePreview__actions').style.display = 'block'
            }
        }
    })
    // setTimeout(() => {
    //     ImagePreviewDom.destroy()
    // }, 1000)
}
</script>

<style lang="scss">
    @import '@/utils/imagePreview/index.scss';
</style>
