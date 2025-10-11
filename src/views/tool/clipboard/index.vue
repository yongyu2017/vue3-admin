<template>
    <div id="clipboardHtml">
        <img src='http://www.baidu.com/img/bd_logo1.png' style='width:60px;'><br />
        <img src='http://www.baidu.com/img/bd_logo1.png' style='width:60px;'><br />
        <div>【网站】www.itxst.com</div>
        <div>写博客的时候，很多作者会用到截图上传的功能，通过微信截图，QQ截图，直接将截取的图片通过Ctrl+v 复制到编辑器里。编辑器自动将图片上传，并返回图片地址，将图片渲染到页面上。今天我就给大家实现一个这样的功能。 主要的知识点是，浏览的paste事件，clipboardData， 有关这两个属性的浏览器支持情况</div>
    </div>

    <div class="margin-top-10">
        <el-button type="primary" id="btn1" @click="createdClipboardFun('#contentBtn', 'clipboardHtml')">复制</el-button>
    </div>

    <!-- 用于复制内容使用 -->
    <div style="position: fixed; height: 0; opacity: 0; font-size: 0;">
        <div id="contentBtn">复制</div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import ClipboardJS from 'clipboard'

// 创建剪切板
function createdClipboardFun (trigger, target) {
    var clipboard = new ClipboardJS(trigger, {
        target: function () {
            return document.getElementById(target);
        },
    })
    clipboard.on('success', function (e) {
        ElMessage.success('复制成功')
        e.clearSelection()
        clipboard.destroy()
    })
    clipboard.on('error', function (err) {
        console.log('clipboard error', err)
        clipboard.destroy()
    })
    document.querySelector(trigger).click()
}
</script>

<style>

</style>
