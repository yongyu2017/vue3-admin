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