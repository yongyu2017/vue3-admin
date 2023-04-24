const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);

module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production' ? './' : '',
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
    outputDir: 'dist',
    lintOnSave: true,
    transpileDependencies: true,
    devServer: {
        open: false,
        host: '0.0.0.0' || require('ip').address(), // 允许外部ip访问
        port: 8002,
        /** ffmpeg WebAssembly 版本在网页运行的工具，发现使用到了 SharedArrayBuffer，涉及到跨域隔离的问题，需要设置两个 HTTP 消息头启用跨域隔离：
        **Cross-Origin-Opener-Policy 设置为 same-origin（保护源站免受攻击）
        **Cross-Origin-Embedder-Policy 设置为 require-corp（保护源站免受侵害）
        **该配置会影响视频资源的播放**/
        // headers: {
        //     "Cross-Origin-Opener-Policy": "same-origin",
        //     "Cross-Origin-Embedder-Policy": "require-corp",
        // },
        proxy: {
            '/dev-api': {
                target: `http://192.168.1.22:8000`,
                changeOrigin: true,
                pathRewrite: {
                    '^/dev-api': '',
                }
            }
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                "@": resolve("src"),
                assets: resolve("src/assets"),
            },
        },
        plugins: [new NodePolyfillPlugin()],
    },
    chainWebpack: config => {
        config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include
            .add(resolve('src/assets/icon')) //处理svg目录
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
    },
})
