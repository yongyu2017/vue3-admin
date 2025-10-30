export const formTypeList = [
    {
        value: 'text',
        label: '输入框',
        defaultSetting: [
            { value: 'inp-dom', label: 'className' },
            { value: true, label: 'clearable' },
        ],
        keyList: ['type', 'label', 'value', 'keyName', 'placeholder', 'size', 'width', 'height', 'className', 'maxlength', 'showWordLimit', 'clearable', 'disabled', 'readonly'],
    },
    {
        value: 'password',
        label: '密码框',
        defaultSetting: [
            { value: 'inp-dom', label: 'className' },
            { value: true, label: 'clearable' },
        ],
        keyList: ['type', 'label', 'value', 'keyName', 'placeholder', 'size', 'width', 'height', 'className', 'maxlength', 'clearable', 'disabled', 'readonly', 'showPassword'],
    },
    {
        value: 'textarea',
        label: '文本框',
        defaultSetting: [
            { value: 'inp-dom', label: 'className' },
            { value: '500', label: 'maxlength' },
            { value: true, label: 'showWordLimit' },
        ],
        keyList: ['type', 'label', 'value', 'keyName', 'placeholder', 'size', 'width', 'height', 'className', 'maxlength', 'showWordLimit', 'clearable', 'disabled', 'readonly', 'rows', 'resize'],
    },
]
