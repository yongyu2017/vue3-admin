module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    env: {
        dev: {
            plugins: ['dynamic-import-node']
        }
    }
}
