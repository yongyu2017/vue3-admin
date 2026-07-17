export const Version = 'v1.0.7'

/* global APP_VERSION */
/**
 * 完整构建版本号（包含日期时间后缀）
 * - 打包时由 vue.config.js 中的 DefinePlugin 注入 APP_VERSION（如 v1.0.7.202607170904）
 * - 开发环境下 APP_VERSION 未定义，回退为基础版本号
 * @type {string}
 */
export const AppVersion = typeof APP_VERSION !== 'undefined' ? APP_VERSION : Version
