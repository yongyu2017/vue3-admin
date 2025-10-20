import { ElLoading } from "element-plus"

const download0 = (data, fileName, mineType) => {
    const blob = new Blob([data], { type: mineType })
    window.URL = window.URL || window.webkitURL
    const href = URL.createObjectURL(blob)
    const downA = document.createElement("a")
    downA.href = href
    downA.download = fileName
    downA.click()
    window.URL.revokeObjectURL(href)
}

const download = {
    // 下载 Excel 方法
    excel: (data, fileName) => {
        download0(data, fileName, "application/vnd.ms-excel")
    },
    // 下载 Word 方法
    word: (data, fileName) => {
        download0(data, fileName, "application/msword")
    },
    // 下载 Zip 方法
    zip: (data, fileName) => {
        download0(data, fileName, "application/zip")
    },
    // 下载 Html 方法
    html: (data, fileName) => {
        download0(data, fileName, "text/html")
    },
    // 下载 Markdown 方法
    markdown: (data, fileName) => {
        download0(data, fileName, "text/markdown")
    },
}

export default download

// 根据路径下载文件
export const downloadForUrl = (url, fileName, type = 0) => {
    const down_fileName = fileName ? fileName : url.split('/')[url.split('/').length - 1]
    const loading = ElLoading.service({ lock: true })

    if (type == 1) {
        fetch(url).then((res) => {
            if (res.ok) {
                return res.blob()
            }
            throw new Error('下载失败')
        }).then((blob) => {
            loading.close()
            downloadForBlob(blob, down_fileName)
        }).catch(() => {
            loading.close()
        })
        return
    }

    const downA = document.createElement("a")
    downA.href = url
    downA.download = down_fileName
    downA.target = '_blank'
    downA.click()
    downA?.remove()
    loading.close()
}

// blob文件流下载
export const downloadForBlob = (file, filename) => {
    // const blob = new Blob([file])
    let downloadElement = document.createElement('a')
    let href = window.URL.createObjectURL(file)
    downloadElement.href = href
    downloadElement.download = filename
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(href)
}
