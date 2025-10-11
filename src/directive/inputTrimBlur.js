function getInputElement(el) {
    // 支持原生 input 和 Element Plus 的 el-input
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        return el
    }
    return el.querySelector('input') || el.querySelector('textarea')
}

function trimValue(inputEl) {
    const newVal = inputEl.value.trim()
    if (inputEl.value !== newVal) {
        inputEl.value = newVal // 更新 DOM 显示
        // 触发 input 事件同步 v-model 数据
        inputEl.dispatchEvent(new Event('input', { bubbles: true }))
    }
}

export default {
    mounted (el) {
        const inputEl = getInputElement(el)
        if (!inputEl) return

        const handler = () => trimValue(inputEl)
        // const keyHandler = (e) => {
        //     if (e.key === 'Enter') trimValue(inputEl) // 回车键触发
        // }

        inputEl.addEventListener('blur', handler)
        // inputEl.addEventListener('keydown', keyHandler)

        // 存储 handler 用于卸载
        el._trimHandlers = { blur: handler }
    },
    unmounted (el) {
        const inputEl = getInputElement(el)
        if (!inputEl || !el._trimHandlers) return

        inputEl.removeEventListener('blur', el._trimHandlers.blur)
        // inputEl.removeEventListener('keydown', el._trimHandlers.keydown)
    }
}
