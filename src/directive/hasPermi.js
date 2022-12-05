/**
* 操作权限处理
* Copyright (c) 2020 jvt
*/
import { storeToRefs } from 'pinia'
import { useStorePinia } from '@/store'

export default {
    mounted(el, binding) {
        const store = useStorePinia();
        const { permission } = storeToRefs(store); 
        const { value } = binding
        const all_permission = '*:*:*'

        if (value && value instanceof Array && value.length > 0) {
            const permissionFlag = value

            const hasPermissions = permission.value.some(v => {
                return all_permission === v || permissionFlag.includes(v)
            })

            if (!hasPermissions) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(`请设置操作权限标签值`)
        }
    }
}
