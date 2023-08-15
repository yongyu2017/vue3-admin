import { checkEamil, checkIDcard, checkPhone, checkTax, isNumber, isURL } from './index'

// 校验邮箱地址
export function EamilValidator(placeholder) {
    return (rule, value, callback) => {
        const required = rule.required ? rule.required : false
        if (value) {
            if (checkEamil(value)) {
                callback()
            } else {
                callback(new Error(placeholder || '请输入正确的邮箱'))
            }
        } else {
            callback(required ? new Error('请输入') : undefined)
        }
    }
}
// 校验身份证号码
export function IDcardValidator(placeholder) {
    return (rule, value, callback) => {
        const required = rule.required ? rule.required : false
        if (value) {
            if (checkIDcard(value)) {
                callback()
            } else {
                callback(new Error(placeholder || '请输入正确的证件号码'))
            }
        } else {
            callback(required ? new Error('请输入') : undefined)
        }
    }
}
// 校验手机号码
export function phoneValidator(placeholder) {
    return (rule, value, callback) => {
        const required = rule.required ? rule.required : false
        if (value) {
            if (checkPhone(value)) {
                callback()
            } else {
                callback(new Error(placeholder || '请输入正确的手机号码'))
            }
        } else {
            callback(required ? new Error('请输入') : undefined)
        }
    }
}
// 验证企业税号
export function invoiceIdnumberValidator(placeholder) {
    return (rule, value, callback) => {
        const required = rule.required ? rule.required : false
        if (value) {
            if (checkTax(value)) {
                callback()
            } else {
                callback(new Error(placeholder || '请输入正确的企业税号'))
            }
        } else {
            callback(required ? new Error('请输入') : undefined)
        }
    }
}
/**
 * 校验数字
 * ecimalDigits小数点位数，0则校验为整数，-1则不校验
 * positiveNumber是否为正数（Boolean）
 * **/
export function isNumberValidator(placeholder, ecimalDigits, positiveNumber, min, max) {
    return (rule, value, callback) => {
        const required = rule.required ? rule.required : false

        if (value) {
            let cb = undefined
            if (!isNumber(value, ecimalDigits, positiveNumber)) {
                cb = new Error(placeholder || '请输入正确的数字')
            }
            if (min !== undefined && Number(value) < min) {
                cb = new Error(`请输入大于${ min }的数字`)
            }
            if (max !== undefined && Number(value) > max) {
                cb = new Error(`请输入小于${ max }的数字`)
            }

            callback(cb)
        } else {
            callback(required ? new Error('请输入') : undefined)
        }
    }
}
// 校验url
export function urlValidator(placeholder) {
    return (rule, value, callback) => {
        const required = rule.required ? rule.required : false
        if (value) {
            if (isURL(value)) {
                callback()
            } else {
                callback(new Error(placeholder || '请输入正确的网址'))
            }
        } else {
            callback(required ? new Error('请输入') : undefined)
        }
    }
}
// 判断是否为选中,布尔值校验是否是选中
export function isTrueValidator(placeholder) {
    return (rule, value, callback) => {
        const required = rule.required ? rule.required : false
        if (value) {
            callback();
        } else {
            callback(required ? new Error(placeholder || '请选择') : undefined)
        }
    }
}
