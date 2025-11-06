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
        value: 'date|dates',
        label: 'DatePicker 日期选择器',
        defaultSetting: [
            { value: '请选择', label: 'placeholder' },
            { value: true, label: 'clearable' },
            { value: true, label: 'editable' },
            { value: 'YYYY-MM-DD', label: 'format' },
            { value: 'YYYY-MM-DD', label: 'valueFormat' },
        ],
        keyList: ['type', 'label', 'keyName', 'placeholder', 'className', 'clearable', 'disabled', 'editable', 'readonly', 'format', 'valueFormat'],
    },
    {
        value: 'daterange',
        label: 'DatePicker 日期选择器',
        defaultSetting: [
            { value: '开始日期', label: 'startPlaceholder' },
            { value: '结束日期', label: 'endPlaceholder' },
            { value: true, label: 'clearable' },
            { value: true, label: 'editable' },
            { value: 'YYYY-MM-DD', label: 'format' },
            { value: 'YYYY-MM-DD', label: 'valueFormat' },
            { value: '至', label: 'rangeSeparator' },
        ],
        keyList: ['type', 'label', 'keyName', 'startPlaceholder', 'rangeSeparator', 'endPlaceholder', 'className', 'clearable', 'disabled', 'editable', 'readonly', 'format', 'valueFormat'],
    },
    {
        value: 'datetime',
        label: 'DatePicker 日期选择器',
        defaultSetting: [
            { value: '请选择', label: 'placeholder' },
            { value: true, label: 'clearable' },
            { value: true, label: 'editable' },
            { value: 'YYYY-MM-DD HH:mm:ss', label: 'format' },
            { value: 'YYYY-MM-DD HH:mm:ss', label: 'valueFormat' },
        ],
        keyList: ['type', 'label', 'keyName', 'placeholder', 'className', 'clearable', 'disabled', 'editable', 'readonly', 'format', 'valueFormat'],
    },
    {
        value: 'datetimerange',
        label: 'DatePicker 日期选择器',
        defaultSetting: [
            { value: '开始日期', label: 'startPlaceholder' },
            { value: '结束日期', label: 'endPlaceholder' },
            { value: true, label: 'clearable' },
            { value: true, label: 'editable' },
            { value: 'YYYY-MM-DD HH:mm:ss', label: 'format' },
            { value: 'YYYY-MM-DD HH:mm:ss', label: 'valueFormat' },
            { value: '至', label: 'rangeSeparator' },
        ],
        keyList: ['type', 'label', 'keyName', 'startPlaceholder', 'rangeSeparator', 'endPlaceholder', 'className', 'clearable', 'disabled', 'editable', 'readonly', 'format', 'valueFormat'],
    },
    {
        value: 'month|months',
        label: 'DatePicker 日期选择器',
        defaultSetting: [
            { value: '请选择', label: 'placeholder' },
            { value: true, label: 'clearable' },
            { value: true, label: 'editable' },
            { value: 'YYYY-MM', label: 'format' },
            { value: 'YYYY-MM', label: 'valueFormat' },
        ],
        keyList: ['type', 'label', 'keyName', 'placeholder', 'className', 'clearable', 'disabled', 'editable', 'readonly', 'format', 'valueFormat'],
    },
    {
        value: 'monthrange',
        label: 'DatePicker 日期选择器',
        defaultSetting: [
            { value: '开始日期', label: 'startPlaceholder' },
            { value: '结束日期', label: 'endPlaceholder' },
            { value: true, label: 'clearable' },
            { value: true, label: 'editable' },
            { value: 'YYYY-MM', label: 'format' },
            { value: 'YYYY-MM', label: 'valueFormat' },
            { value: '至', label: 'rangeSeparator' },
        ],
        keyList: ['type', 'label', 'keyName', 'startPlaceholder', 'rangeSeparator', 'endPlaceholder', 'className', 'clearable', 'disabled', 'editable', 'readonly', 'format', 'valueFormat'],
    },
    {
        value: 'year|years',
        label: 'DatePicker 日期选择器',
        defaultSetting: [
            { value: '请选择', label: 'placeholder' },
            { value: true, label: 'clearable' },
            { value: true, label: 'editable' },
            { value: 'YYYY', label: 'format' },
            { value: 'YYYY', label: 'valueFormat' },
        ],
        keyList: ['type', 'label', 'keyName', 'placeholder', 'className', 'clearable', 'disabled', 'editable', 'readonly', 'format', 'valueFormat'],
    },
    {
        value: 'yearrange',
        label: 'DatePicker 日期选择器',
        defaultSetting: [
            { value: '开始日期', label: 'startPlaceholder' },
            { value: '结束日期', label: 'endPlaceholder' },
            { value: true, label: 'clearable' },
            { value: true, label: 'editable' },
            { value: 'YYYY', label: 'format' },
            { value: 'YYYY', label: 'valueFormat' },
            { value: '至', label: 'rangeSeparator' },
        ],
        keyList: ['type', 'label', 'keyName', 'startPlaceholder', 'rangeSeparator', 'endPlaceholder', 'className', 'clearable', 'disabled', 'editable', 'readonly', 'format', 'valueFormat'],
    },
]
