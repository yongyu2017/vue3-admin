import request from '@/utils/httpRequest.js'

// ffmpeg视频转码
export function ffmpegTranscoding(data) {
    return request({
        url: '/ffmpeg/transcoding',
        method: 'post',
        data: data,
        timeout: 0,
    })
}
// 代码生成
export function toolCodeGenerationGeneration (data) {
    return request({
        url: '/tool/codeGeneration/generation',
        method: 'post',
        data: data,
        timeout: 0,
        responseType: 'blob',
    })
}
// 代码生成预览
export function toolCodeGenerationPreview (data) {
    return request({
        url: '/tool/codeGeneration/preview',
        method: 'post',
        data: data,
    })
}
