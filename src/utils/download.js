import { ElLoading } from "element-plus";

// 根据路径下载文件
export const downloadForUrl = (url, fileName) => {
    const loading = ElLoading.service({ lock: true });
    const fileName2 = fileName || url.split('/')[url.split('/').length - 1]
    // 创建 href 超链接，点击进行下载
    const downA = document.createElement("a");
    downA.href = url;
    downA.download = fileName2;
    downA.click();
    // 销毁超连接
    downA?.remove();
    loading.close();
};

// blob文件流下载
export const downloadForBlob = (file, filename) => {
    const blob = new Blob([file])

    let downloadElement = document.createElement('a');
    let href = window.URL.createObjectURL(blob);           //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = filename; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click();                               //点击下载
    document.body.removeChild(downloadElement);            //下载完成移除元素
    window.URL.revokeObjectURL(href);                      //释放掉blob对象
};
