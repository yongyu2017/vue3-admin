const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const WebpackObfuscator = require('webpack-obfuscator')
const TerserPlugin = require('terser-webpack-plugin')
const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);

module.exports = defineConfig({
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '南京市城建管理系统后台管理',
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
        config.plugin('define').tap(definitions => {
            Object.assign(definitions[0], {
                '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false'
            })
            return definitions
        })
        // config.plugin('html')
        //     .tap(args => {
        //         args[0].title = "南京市城建管理系统后台管理";
        //         return args;
        //     })
    },
})
