import { computed } from 'vue'
import { codeToLabel } from '@/utils/index.js'

export function commonMixin () {
    const codeToLabelComputed = computed(() => {
        return (val, list, spaceMark) => {
            let str = ''
            const isArray = Array.isArray(val)
            if (isArray) {
                const arr = []
                val.forEach((value) => {
                    arr.push(codeToLabel(value, list))
                })
                str = arr.join(spaceMark ? spaceMark : '，')
            } else {
                str = codeToLabel(val, list)
            }
            return str
        }
    })

    return {
        codeToLabelComputed,
    }
}
