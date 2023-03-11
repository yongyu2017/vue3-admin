import { computed } from 'vue'
import { codeToLabel } from '@/utils/index.js'

export function commonMixin () {
    const codeToLabelComputed = computed(() => {
        return (val, list) => {
            return codeToLabel(val, list)
        }
    })

    return {
        codeToLabelComputed,
    }
}