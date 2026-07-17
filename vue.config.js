const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const WebpackObfuscator = require('webpack-obfuscator')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);

// 读取 src/utils/setting.js 中的 Version 值，并拼接当前日期时间
function getBuildVersion() {
    const settingContent = fs.readFileSync(resolve('src/utils/setting.js'), 'utf-8')
    const match = settingContent.match(/Version\s*=\s*['"]([^'"]+)['"]/)
    const baseVersion = match ? match[1] : 'v0.0.0'
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const dateStr =
        `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
        `${pad(now.getHours())}${pad(now.getMinutes())}`
    return `${baseVersion}.${dateStr}`
}

const APP_VERSION = getBuildVersion()

module.exports = defineConfig({
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '后台管理系统',
        },
    }, // 多页面应用配置
    lintOnSave: true,
    transpileDependencies: true,
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
    devServer: {
        client: {
            overlay: false,
        },
        open: false,
        host: '0.0.0.0' || require('ip').address(), // 允许外部ip访问
        port: 8002,
        proxy: {
            '/dev-api': {
                target: `http://192.168.1.193:8000`,
                changeOrigin: true,
                router: function (req) {
                    delete req.headers.origin
                },
                pathRewrite: {
                    '^/dev-api': '',
                }
            }
        },
    },
    configureWebpack: (config) => {
        config.resolve.alias['@'] = resolve('src')
        config.resolve.alias['asset'] = resolve('src/assets')
        config.resolve.alias['@public'] = path.resolve(__dirname, 'public')
        config.plugins.push(new NodePolyfillPlugin())
        // 注入全局变量 APP_VERSION，可在业务代码中直接使用
        config.plugins.push(
            new webpack.DefinePlugin({
                APP_VERSION: JSON.stringify(APP_VERSION),
            })
        )
        if (process.env.NODE_ENV === 'production') {
            // 启用Webpack Obfuscator插件进行代码加密
            config.plugins.push(
                new WebpackObfuscator({
                    rotateUnicodeArray: true, // 打乱Unicode数组顺序
                })
            )
            // 启用Terser插件进行代码混淆
            config.optimization.minimizer.push(
                new TerserPlugin({
                    terserOptions: {
                        mangle: true, // 开启变量名混淆
                    },
                })
            )
        }
    },
    chainWebpack: config => {
        config.module.rules.delete("svg") //重点:删除默认配置中处理svg
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
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer('terser').tap((args) => {
                args[0].terserOptions = {
                    ...args[0].terserOptions,
                    format: {
                        comments: false, // 移除所有注释
                    },
                }
                args[0].extractComments = false // 禁止提取注释
                return args
            })
        }
    },
})
