const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('../utils/index.js')
const statusCodeMap = require('../utils/statusCodeMap.js')
const prettier = require('prettier')
const { Readable } = require('stream')

// 代码生成
async function toolCodeGenerationGeneration (req, res) {
    const { token } = req.headers
    const { config } = req['body']
    const userInfo = await verifyToken(token)

    if(userInfo){
        const configObject = JSON.parse(config)
        const vueCode = await generateVueComponent(configObject)
        const fileName = `${configObject.componentName}.vue`

        // 设置响应头触发下载
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
        res.setHeader('Content-Type', 'application/octet-stream')

        // 创建可读流
        const stream = new Readable()
        stream.push(vueCode)
        stream.push(null) // 结束流

        stream.pipe(res)
    }else{
        res.send({
            data: '',
            ...statusCodeMap['401']
        })
    }
}
// 代码生成预览
async function toolCodeGenerationPreview (req, res) {
    const { token } = req.headers
    const { config } = req['body']
    const userInfo = await verifyToken(token)

    if(userInfo){
        const configObject = JSON.parse(config)
        const vueCode = await generateVueComponent(configObject)

        res.send({
            code: 200,
            data: vueCode,
            msg: '',
        })
    }else{
        res.send({
            data: '',
            ...statusCodeMap['401']
        })
    }
}


/**
 * 根据 JSON 配置生成 Vue 组件代码
 * @param {Object} config - 组件配置对象
 * @returns {Promise<string>} - 格式化后的 Vue 代码
 */
async function generateVueComponent(config) {
    const { componentName, props = {}, events = [], slots = {}, children = [] } = config;

    // 生成 props 代码段
    const propsCode = Object.entries(props)
        .map(([name, options]) => {
            const { type, default: defaultValue, required } = options;
            return `${name}: {
  type: ${type},
  ${required ? 'required: true,' : ''}
  ${defaultValue !== undefined ? `default: ${typeof defaultValue === 'string' ? `'${defaultValue}'` : defaultValue}` : ''}
}`;
        })
        .join(',\n');

    // 生成事件处理代码
    const eventsCode = events.length > 0
        ? `const emit = defineEmits([${events.map(e => `'${e}'`).join(', ')}]);`
        : '';

    // 生成插槽代码
    const slotsCode = Object.entries(slots)
        .map(([name, description]) => {
            return name === 'default'
                ? `<div>\n<!-- ${description} -->\n${generateChildrenCode(children)}\n</div>`
                : `<template #${name}>\n<!-- ${description} -->\n</template>`;
        })
        .join('\n');

    // 生成子组件代码
    function generateChildrenCode(nodes) {
        return nodes.map(node => {
            const { component, props = {}, text, events = {}, children = [] } = node;
            const propsStr = Object.entries(props)
                .map(([key, value]) => {
                    if (key.startsWith(':')) {
                        return `${key}="${value}"`;
                    }
                    return `${key}="${value}"`;
                })
                .join(' ');

            const eventsStr = Object.entries(events)
                .map(([event, handler]) => `@${event}="${handler}"`)
                .join(' ');

            const childrenCode = children.length > 0
                ? generateChildrenCode(children)
                : text || '';

            return `<${component} ${propsStr} ${eventsStr}>${childrenCode}</${component}>`;
        }).join('\n');
    }

    // 组合成完整 Vue 模板
    const template = `
<template>
  <div class="${componentName.toLowerCase()}">
    ${slotsCode}
  </div>
</template>

<script setup>
${eventsCode}

const props = defineProps({
${propsCode}
});
</script>

<style scoped>
.${componentName.toLowerCase()} {
  /* 组件样式 */
}
</style>
`;

    // 使用 Prettier 格式化代码
    return await prettier.format(template, {
        parser: 'vue',
        semi: false,
        singleQuote: true
    });
}

module.exports = {
    toolCodeGenerationGeneration,
    toolCodeGenerationPreview,
}
