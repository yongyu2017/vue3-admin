import {
    createFFmpeg,
    fetchFile,
} from "@ffmpeg/ffmpeg";
import {onMounted, onUnmounted} from 'vue'

let ffmpeg = null;

export function useFFmpeg() {
    if (!("SharedArrayBuffer" in window)) {
        console.log("浏览器不支持 SharedArrayBuffer， 无法使用视频功能！");
    }

    if (!ffmpeg) {
        ffmpeg = createFFmpeg({log: true});
    }

    onMounted(loadFFmpeg);

    onUnmounted(() => {
        ffmpeg = null;
    });

    async function loadFFmpeg() {
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
    }

    async function writeFile(file) {
        try {
            ffmpeg && ffmpeg.FS("writeFile", file.name, await fetchFile(file));
        } catch (error) {
            console.log("写入文件失败！请重试");
        }
    }

    function readFile(fileName) {
        try {
            if (ffmpeg) return ffmpeg.FS("readFile", fileName).buffer;
            return null;
        } catch (error) {
            console.log("读取文件失败！请重试");
        }
        return null;
    }

    async function ffmpegRun(config) {
        const info = {
            url: "",
            size: 0,
        };
        if (!ffmpeg) return info;
        const {outputName, fileType} = config;
        try {
            await ffmpeg.run(...handleCommand(config));
            const buffer = await readFile(`${outputName}.${fileType}`);
            // info.url = bufferChangeUrl(buffer, fileType);
            info.size = buffer?.byteLength || 0;
            return info;
        } catch (error) {
            console.log("文件操作失败！请重试");
        }
        return info;
    }

    return {ffmpeg, loadFFmpeg, writeFile, readFile, ffmpegRun};
}

function handleCommand(config) {
    const {
        filename,
        frameRate = 25,
        rangeStart = 0,
        rangeEnd,
        width = -1,
        height = -1,
        fileType,
        outputName = "output",
        type,
    } = config;
    const CommandMap = {
        image: `-ss ${rangeStart} -i ${filename} -s ${width}x${height} -f image2 -frames 1 ${outputName}.${fileType}`,
        video: `-i ${filename} -r ${frameRate} -ss ${rangeStart} -to ${rangeEnd} -vf scale=${width}:${height},fade=t=in:st=${rangeStart}:d=0.05 ${outputName}.${fileType}`,
    };
    return CommandMap[type].split(/(?:\s+)/);
}
