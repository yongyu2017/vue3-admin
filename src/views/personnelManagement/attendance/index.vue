<template>
    <div id="html">
        <img src='http://www.baidu.com/img/bd_logo1.png' style='width:60px;'><br />
        <img src='http://www.baidu.com/img/bd_logo1.png' style='width:60px;'><br />
        <div>【网站】www.itxst.com</div>
        <div>写博客的时候，很多作者会用到截图上传的功能，通过微信截图，QQ截图，直接将截取的图片通过Ctrl+v 复制到编辑器里。编辑器自动将图片上传，并返回图片地址，将图片渲染到页面上。今天我就给大家实现一个这样的功能。 主要的知识点是，浏览的paste事件，clipboardData， 有关这两个属性的浏览器支持情况</div>
    </div>

    <el-button type="primary" id="btn1" @click="copyFun('#btn1')">复制</el-button>
</template>

<script setup>
import ClipboardJS from 'clipboard'

const copyFun = (obj) => {
    var clipboard = new ClipboardJS(obj, {
        target: function (trigger) {
            console.log(document.getElementById("html"), trigger)
            return document.getElementById("html");
        },
        text: function (e) {
            console.log(e)
        }
    })
    clipboard.on('success', function (e) {
        console.log('success', e)
        e.clearSelection()
    })

    clipboard.on('error', function (err) {
        console.log('err', err)
    })
}
</script>

<style>

</style>
