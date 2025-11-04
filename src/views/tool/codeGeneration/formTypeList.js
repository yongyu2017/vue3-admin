export const formTypeList = [
    {
        value: 'text',
        label: 'Input 输入框',
        defaultSetting: [
            { value: 'inp-dom', label: 'className' },
            { value: true, label: 'clearable' },
            { value: '请输入', label: 'placeholder' },
        ],
        keyList: ['type', 'label', 'keyName', 'placeholder', 'className', 'maxlength', 'showWordLimit', 'clearable', 'disabled', 'readonly'],
    },
    {
        value: 'password',
        label: 'Input 密码框',
        defaultSetting: [
            { value: 'inp-dom', label: 'className' },
            { value: true, label: 'clearable' },
            { value: '请输入', label: 'placeholder' },
        ],
        keyList: ['type', 'label', 'keyName', 'placeholder', 'className', 'maxlength', 'clearable', 'disabled', 'readonly', 'showPassword'],
    },
    {
        value: 'textarea',
        label: 'Input 文本域',
        defaultSetting: [
            { value: 'inp-dom', label: 'className' },
            { value: '500', label: 'maxlength' },
            { value: true, label: 'showWordLimit' },
            { value: '请输入', label: 'placeholder' },
        ],
        keyList: ['type', 'label', 'keyName', 'placeholder', 'className', 'maxlength', 'showWordLimit', 'clearable', 'disabled', 'readonly', 'rows', 'resize'],
    },
    {
        value: 'select',
        label: 'Select 选择器',
        defaultSetting: [
            { value: 'inp-dom', label: 'className' },
            { value: '请选择', label: 'placeholder' },
            { value: 0, label: 'multipleLimit' },
        ],
        keyList: ['type', 'label', 'keyName', 'placeholder', 'className', 'clearable', 'disabled', 'multiple', 'multipleLimit', 'filterable', 'dataList'],
    },
    {
        value: 'radio',
        label: 'Radio 单选框',
        defaultSetting: [
        ],
        keyList: ['type', 'label', 'keyName', 'disabled', 'dataList'],
    },
    {
        value: 'checkboxGroup',
        label: 'CheckboxGroup 复选框组',
        defaultSetting: [
        ],
        keyList: ['type', 'label', 'keyName', 'disabled', 'dataList'],
    },
    {
        value: 'checkbox',
        label: 'Checkbox 复选框',
        defaultSetting: [
        ],
        keyList: ['type', 'label', 'keyName', 'disabled'],
    },
    {
        value: 'switch',
        label: 'Switch 开关',
        defaultSetting: [
        ],
        keyList: ['type', 'label', 'keyName', 'disabled'],
    },
    {
        value: 'slider',
        label: 'Slider 滑块',
        defaultSetting: [
        ],
        keyList: ['type', 'label', 'keyName', 'className', 'disabled'],
    },
    {
        value: 'rate',
        label: 'Rate 评分',
        defaultSetting: [
        ],
        keyList: ['type', 'label', 'keyName', 'disabled', 'clearable'],
    },
    {
        value: 'inputNumber',
        label: 'Input Number 数字输入框',
        defaultSetting: [
        ],
        keyList: ['type', 'label', 'keyName', 'disabled'],
    },
    {
        value: 'datePicker',
        label: 'DatePicker 日期选择器',
        defaultSetting: [
        ],
        keyList: ['type', 'label', 'keyName', 'disabled'],
    },

]
