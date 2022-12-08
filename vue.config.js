const { defineConfig } = require('@vue/cli-service')
const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);

module.exports = defineConfig({
    lintOnSave: true,
    transpileDependencies: true,
    devServer: {
        open: false,
        host: '0.0.0.0' || require('ip').address(), // 允许外部ip访问
        port: 8002,
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
