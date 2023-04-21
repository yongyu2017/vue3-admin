/* eslint-disable */
;(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory()
    } else if (typeof define === 'function' && define.amd) {
        define([], factory)
    } else {
        root.ImagePreview = factory()
    }
})(window, function () {
    const ImagePreview = function (options) {
        this.winWidth = 0
        this.winHeight = 0
        this.imgWidth = 0
        this.imgHeight = 0
        this.defaultOptions = Object.assign({}, {
            urls: [],
            current: '',
            scale: 1, // 初始化倍数
            maxScale: 4, //最大放大倍数
            minScale: 0.2, //最小缩放倍数
            control: ['zoomOut', 'zoomIn', 'reset', 'rorateLeft', 'rorateRight'],
        }, options)
        this.currentScale = this.defaultOptions.scale
        this.translateX = 0
        this.translateY = 0
        this.rotate = 0
        this.Index = document.querySelectorAll('.imagePreview_wraper').length + 1
        this.imagePreviewContent = null
        this.poc = 0
        for (let i = 0; i< this.defaultOptions.urls.length; i++) {
            if (this.defaultOptions.urls[i] == this.defaultOptions.current) {
                this.poc = i
            }
        }

        this.init()
    }
    ImagePreview.prototype = {
        init: function () {
            this.getWindowWH()
            this.createHtml()
            this.initImg(this.defaultOptions.current)
            this.bindEvent()
        },
        createHtml: function () {
            const that = this
            const targetDom = document.createElement('div')
            targetDom.setAttribute('class', 'imagePreview_wraper')
            targetDom.setAttribute('id', 'imagePreview_wraper' + that.Index)
            document.querySelector('body').appendChild(targetDom)
            that.imagePreviewContent = document.querySelector('#imagePreview_wraper' + that.Index)
            let html = '<div class="imagePreview__mask"></div>'
            html += '<span class="imagePreview__close"><i class="icon icon-close"></i></span>'
            html += '<span class="imagePreview__prev"><i class="icon icon-arrowLeft"></i></span>'
            html += '<span class="imagePreview__next"><i class="icon icon-arrowRight"></i></span>'
            html += '<div class="imagePreview__actions"><div class="imagePreview__actions__inner">'
            for (let i = 0; i < that.defaultOptions.control.length; i++) {
                html += '<div class="item"><i class="icon icon-' + that.defaultOptions.control[i] + '" id="event_' + that.defaultOptions.control[i] + '"></i></div>'
            }
            html += '</div></div>'
            html += '<div class="imagePreview__canvas"></div>'
            that.imagePreviewContent.innerHTML = html
            if (that.defaultOptions.urls.length <= 1) {
                that.imagePreviewContent.querySelector('.imagePreview__prev').style.display = 'none'
                that.imagePreviewContent.querySelector('.imagePreview__next').style.display = 'none'
            }
        },
        // 初始化样式
        initStyle: function () {
            const that = this
            that.translateX = (that.winWidth - that.imgWidth) / 2
            that.translateY = (that.winHeight - that.imgHeight) / 2

            console.log(that.winWidth, that.winHeight)
            if (that.imgWidth < that.winWidth && that.imgHeight < that.winHeight) {
                that.currentScale = that.defaultOptions.scale
            } else {
                const scale_x = that.winWidth / that.imgWidth
                const scale_y = that.winHeight / that.imgHeight

                that.currentScale = scale_x > scale_y ? scale_y : scale_x
            }
            that.rotate = 0
            that.styleComputed(that.translateX, that.translateY, that.currentScale, that.rotate, 0)
        },
        // 样式计算
        styleComputed: function (translateX, translateY, scale, rotate, duration) {
            const that = this
            let style = {
                'display': 'block',
                'transform': 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scale + ') rotate(' + rotate + 'deg)',
                'transition': 'all ' + duration + 's ease 0s',
            }

            for (let i in style) {
                that.imagePreviewContent.querySelector('.imagePreview__img').style[i] = style[i]
            }
        },
        // 获取图片宽高
        getImageInfo: function (url) {
            const that = this
            let img = new Image()
            img.onload = function () {
                that.imgWidth = img.width
                that.imgHeight = img.height

                that.initStyle()
            }
            img.src = url
        },
        // 初始化图片
        initImg: function (url) {
            const that = this
            that.imagePreviewContent.querySelector('.imagePreview__canvas').innerHTML = '<img src="' + url + '" alt="" class="imagePreview__img" style="display: none" />'
            that.getImageInfo(url)
        },
        // 绑定事件
        bindEvent: function () {
            const that = this
            window.addEventListener('resize', that.getWindowWH)
            // 鼠标按下
            that.imagePreviewContent.querySelector('.imagePreview__canvas').addEventListener('mousedown', function(event) {
                that.mousedown(event)
            })
            // 滚轮事件 chrome & ie
            that.imagePreviewContent.querySelector('.imagePreview__canvas').addEventListener('mousewheel', function(event) {
                that.mousewheel(event)
            })
            // 滚轮事件 firefox
            that.imagePreviewContent.querySelector('.imagePreview__canvas').addEventListener('DOMMouseScroll', function(event) {
                that.mousewheel(event)
            })
            // 缩小
            that.imagePreviewContent.querySelector('#event_zoomOut').addEventListener('click', function() {
                that.zoomOutOrIn(0)
            })
            // 放大
            that.imagePreviewContent.querySelector('#event_zoomIn').addEventListener('click', function() {
                that.zoomOutOrIn(1)
            })
            // 重置
            that.imagePreviewContent.querySelector('#event_reset').addEventListener('click', function() {
                that.initStyle()
            })
            // 向右旋转
            that.imagePreviewContent.querySelector('#event_rorateRight').addEventListener('click', function() {
                that.rotate = that.rotate + 90
                that.styleComputed(that.translateX, that.translateY, that.currentScale, that.rotate, 0.3)
            })
            // 向左旋转
            that.imagePreviewContent.querySelector('#event_rorateLeft').addEventListener('click', function() {
                that.rotate = that.rotate - 90
                that.styleComputed(that.translateX, that.translateY, that.currentScale, that.rotate, 0.3)
            })
            // 关闭
            that.imagePreviewContent.querySelector('.imagePreview__close').addEventListener('click', function() {
                that.destroy()
            })
            // 上一页
            that.imagePreviewContent.querySelector('.imagePreview__prev').addEventListener('click', function() {
                if (that.poc == 0) {
                    return
                }
                that.poc--
                that.initImg(that.defaultOptions.urls[that.poc])
            })
            // 下一页
            that.imagePreviewContent.querySelector('.imagePreview__next').addEventListener('click', function() {
                if (that.poc == (that.defaultOptions.urls.length -1)) {
                    return
                }
                that.poc++
                that.initImg(that.defaultOptions.urls[that.poc])
            })
        },
        // 鼠标按下事件(拖拽用)
        mousedown: function(event) {
            event.preventDefault()
            if (event.target.className != 'imagePreview__img') {
                return
            }
            const that = this
            const startX = event.x
            const startY = event.y
            const startTranslateX = that.translateX
            const startTranslateY = that.translateY
            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
            // 拖拽
            function mousemove(event) {
                const x = event.x - startX
                const y = event.y - startY
                that.translateX = startTranslateX + x
                that.translateY = startTranslateY + y

                that.styleComputed(that.translateX, that.translateY, that.currentScale, that.rotate, 0)
            }
            // 鼠标放开
            function mouseup() {
                that.styleComputed(that.translateX, that.translateY, that.currentScale, that.rotate, 0.3)
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseup)
            }
        },
        // 缩放，type值0缩小1放大
        zoomOutOrIn: function (type) {
            const that = this
            if (type == 1) {
                that.currentScale = Number((that.currentScale + 0.1).toFixed(1))
                if (that.currentScale >= that.defaultOptions.maxScale) {
                    that.currentScale = that.defaultOptions.maxScale
                }
            } else {
                that.currentScale = Number((that.currentScale - 0.1).toFixed(1))
                if (that.currentScale <= that.defaultOptions.minScale) {
                    that.currentScale = that.defaultOptions.minScale
                }
            }

            that.styleComputed(that.translateX, that.translateY, that.currentScale, that.rotate, 0.3)
        },
        // 滚轮事件
        mousewheel: function(event) {
            const that = this
            const delta = (event.wheelDelta && (event.wheelDelta > 0 ? 1 : -1)) || (event.detail != 0 && (event.detail > 0 ? -1 : 1))
            event.preventDefault()

            if (delta > 0) {
                // 向上
                that.zoomOutOrIn(1)
            } else if (delta < 0) {
                // 向下
                that.zoomOutOrIn(0)
            }
        },
        // 获取浏览器宽高
        getWindowWH: function() {
            // 获取窗口宽度
            if (window.innerWidth)
                this.winWidth = window.innerWidth
            else if ((document.body) && (document.body.clientWidth))
                this.winWidth = document.body.clientWidth
            // 获取窗口高度
            if (window.innerHeight) {
                this.winHeight = window.innerHeight
            } else if ((document.body) && (document.body.clientHeight)) {
                this.winHeight = document.body.clientHeight
            }
            // 通过深入 Document 内部对 body 进行检测，获取窗口大小
            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                this.winHeight = document.documentElement.clientHeight
                this.winWidth = document.documentElement.clientWidth
            }
            console.log('getWindowWH', this.winWidth, this.winHeight)
        },
        // 销毁
        destroy: function () {
            const that = this
            that.imagePreviewContent.remove()
            that.imagePreviewContent = null
            window.removeEventListener('resize', that.getWindowWH)
        }
    }
    return ImagePreview
})