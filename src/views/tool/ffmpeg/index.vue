<template>
    <div class="fileChange-page">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-position="left" label-width="100px">
            <el-form-item label="上传文件：" prop="file">
                <el-upload
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-change="fileUpload"
                >
                    <el-button type="primary">选择文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="帧数：" prop="frameRate">
                <el-input-number
                        v-model="dataForm.frameRate"
                        :min="0"
                        :step="1"
                        :precision="2"
                        controls-position="right"
                        size="large"
                        class="inp-dom inp-number-dom"
                />
                <el-popover
                        placement="top-start"
                        :width="200"
                        trigger="hover"
                >
                    <div>-r rate：帧速率(fps) （可以改，确认非标准桢率会导致音画不同步，所以只能设定为15或者29.97）</div>
                    <template #reference>
                        <el-button type="danger" link class="tips-btn"><el-icon><Warning /></el-icon></el-button >
                    </template>
                </el-popover>
            </el-form-item>
            <el-form-item label="宽度：" prop="width">
                <el-input-number
                        v-model="dataForm.width"
                        :min="0"
                        :step="1"
                        :precision="0"
                        controls-position="right"
                        size="large"
                        class="inp-dom inp-number-dom"
                />
            </el-form-item>
            <el-form-item label="高度：" prop="height">
                <el-input-number
                        v-model="dataForm.height"
                        :min="0"
                        :step="1"
                        :precision="0"
                        controls-position="right"
                        size="large"
                        class="inp-dom inp-number-dom"
                />
            </el-form-item>
            <el-form-item label="开始时间：" prop="rangeStart">
                <el-input v-model="dataForm.rangeStart" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="结束时间：" prop="rangeEnd">
                <el-input v-model="dataForm.rangeEnd" placeholder="请输入" class="inp-dom"></el-input>
            </el-form-item>
            <el-form-item label="文件格式：" prop="fileType">
                <el-select v-model="dataForm.fileType" class="inp-dom">
                    <el-option :label="item" :value="item" :key="index" v-for="(item, index) in fileTypeList" />
                </el-select>
            </el-form-item>
            <el-form-item label="进度：" prop="rangeEnd">
                {{ progress }}%
            </el-form-item>
            <el-form-item label="用时：" prop="rangeEnd">
                {{ zoneTime }}秒
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dataFormSubmit">开始转换</el-button>
            </el-form-item>
        </el-form>

        <div class="con">
            <div class="file-info" v-if="fileInfo.length > 0">
                <div class="elTabs-wrap">
                    <el-button link class="expend-btn" @click="activeName = activeName ? '' : 'Index0'">
                        <el-icon>
                            <ArrowDown v-if="activeName" />
                            <ArrowRight v-else />
                        </el-icon>
                    </el-button>
                    <el-tabs
                            type="card"
                            v-model="activeName"
                    >
                        <el-tab-pane :label="item.type" :name="'Index' + index" v-for="(item, index) in fileInfo" :key="index">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%" class="custom-table">
                                <template v-for="(val, key, index2) in item">
                                    <tr v-if="key != 'type'" :key="index2">
                                        <td width="100" class="label-td">{{ key }}：</td>
                                        <td>{{ val }}</td>
                                    </tr>
                                </template>
                            </table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>

            <div class="video-box">
                <video id="video" controls style="width: 100%" v-if="downloadFileUrl"></video>
                <div>
                    <a :href="downloadFileUrl" download="put.mp4">下载</a>
                </div>
            </div>
        </div>
    </div>

    <!--<div class="home">-->
        <!--<input type="file" id="upload" ACCEPT="video/*" @change="upload">-->
        <!--<p id="text">{{ msg }}</p>-->
        <!--<div>开始时间：{{ startTime }}</div>-->
        <!--<div>结束时间：{{ endTime }}</div>-->
        <!--<div>用时：{{ zoneTime }}秒</div>-->
    <!--</div>-->
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { loadJS, getSuffix, secondToTime } from '@/utils/index'
const dayjs = require('dayjs')

let ffmpeg = null
const progress = ref(0)
const startTime = ref('')
const endTime = ref('')
const downloadFileUrl = ref('')
let mediainfo = null
const defaultDataForm = {
    frameRate: 25,
}
const dataForm = ref({
    file: '',
    frameRate: 25,
    width: 0,
    height: 0,
    rangeStart: '00:00:00',
    rangeEnd: '00:00:00',
    fileType: 'mp4',
})
const dataRule = ref({})
const uploadFileType = ['mp4', 'avi', 'flv', 'webm', 'mpeg', '3gp']
const fileTypeList = ['mp4', 'avi', 'webm', 'mpeg', 'flv']
const fileInfo = ref([])
const activeName = ref('Index0')
let st = null

const zoneTime = computed(() => {
    return startTime.value && endTime.value ? dayjs(endTime.value).diff(startTime.value, 'second') : 0
})

onMounted(async () => {
    loadJSFun()
    await initFFmpeg()
})
onUnmounted(() => {
    try {
        ffmpeg.exit() //ffmpeg.exit()用来杀死程序的执行，同时删除 MEMFS 释放内存
    } catch (e) {
        console.log(e)
    }
    ffmpeg = null
    clearInterValFun()
})

const loadJSFun = () => {
    loadJS('./static/mediainfo/mediainfo.js', () => {
        // eslint-disable-next-line
        MediaInfo({
            format: 'object', // object|JSON|XML|HTML|text
            locateFile: (path, prefix) => prefix + path, // Make sure WASM file is loaded from CDN location
        }, (res) => {
            mediainfo = res
        })
    })
}
const fileUpload = (e) => {
    const file = e.raw
    const fileType = getSuffix(file.name)[1]
    if (!uploadFileType.includes(fileType)) {
        ElMessage.warning('请上传' + uploadFileType.join(',') + '等文件格式！')
        return
    }

    downloadFileUrl.value = ''
    dataForm.value.file = file
    getVideoInfo(file)
    // FFmpegToTranscoding(file)
}
const getVideoInfo = (file) => {
    const getSize = () => file.size
    const readChunk = (chunkSize, offset) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target.error) {
                    reject(event.target.error)
                }
                resolve(new Uint8Array(event.target.result))
            }
            reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
        })

    mediainfo
        .analyzeData(getSize, readChunk)
        .then((result) => {
            let videoInfo = {}
            result.media.track.forEach((value) => {
                value['type'] = value['@type']
                delete value['@type']
                if (value.type == 'Video') {
                    videoInfo['Width'] = value.Width
                    videoInfo['Height'] = value.Height
                }
                if (value.type == 'General') {
                    videoInfo['Duration'] = value.Duration
                    videoInfo['FrameRate'] = value.FrameRate || defaultDataForm.frameRate
                }
            })
            fileInfo.value = result.media.track
            dataForm.value.frameRate = Number(videoInfo.FrameRate)
            dataForm.value.width = Number(videoInfo.Width)
            dataForm.value.height = Number(videoInfo.Height)
            dataForm.value.rangeEnd = secondToTime(Math.floor(Number(videoInfo.Duration))).date
            console.log(fileInfo.value, dataForm.value)
        })
        .catch((error) => {
            console.log(error)
        })
}
// 初始化FFmpeg
const initFFmpeg = async () => {
    if (!ffmpeg) {
        ffmpeg = createFFmpeg({
            // corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
            corePath: './static/ffmpeg/core/ffmpeg-core.js',
            log: true,
            progress: ({ ratio }) => {
                progress.value = ` ${(ratio * 100).toFixed(2)}`
                if (ratio == 1) {
                    clearInterValFun()
                }
            },
        })
    }
}
// FFmpeg业务处理
const FFmpegToTranscoding = async (file) => {
    clearInterValFun()
    st = setInterval(() => {
        endTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }, 1000)
    const { name } = file
    // ffmpeg模块加载，需放在业务需要时，否则会造成内存泄漏问题
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load()
    }
    startTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    ffmpeg.FS('writeFile', name, await fetchFile(file))
    const outputName = 'put.' + dataForm.value.fileType
    await ffmpeg.run('-i', name, '-r', dataForm.value.frameRate + '', '-ss', dataForm.value.rangeStart, '-to', dataForm.value.rangeEnd, outputName)
    const data = ffmpeg.FS('readFile', outputName)
    // await ffmpeg.run('-i', name, '-r', '35', '-filter:v', 'setpts=0.25*PTS', '-b:v', '5m', 'put.mp4')
    // const data = ffmpeg.FS('readFile', 'put.mp4')

    downloadFileUrl.value = URL.createObjectURL(new Blob([data.buffer], {
        type: 'video/mp4'
    }))
    activeName.value = ''
    nextTick(() => {
        const video = document.getElementById('video')
        video.src =  downloadFileUrl.value
    })
}
const clearInterValFun = () => {
    if (st) {
        clearInterval(st)
        st = null
    }
}
const dataFormSubmit = () => {
    if (!dataForm.value.file) {
        ElMessage.warning('请上传文件！')
        return
    }

    FFmpegToTranscoding(dataForm.value.file)
}
</script>

<style lang="scss" scoped>
    .tips-btn {
        margin-left: 10px;
        font-size: 18px;
    }

    .fileChange-page {
        display: flex;
        flex-direction: row;

        .con {
            flex: 1;
            margin-left: 60px;

            .elTabs-wrap {
                position: relative;
                z-index: 0;

                .expend-btn {
                    position: absolute;
                    z-index: 2;
                    top: 6px;
                    right: 0;
                    font-size: 20px;
                }
            }
        }
    }
</style>
