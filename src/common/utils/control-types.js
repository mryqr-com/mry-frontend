export default {
    SECTION_TITLE: {
        type: 'SECTION_TITLE',
        name: '分段标题',
        icon: 'heading',
        title: '分段标题',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    SEPARATOR: {
        type: 'SEPARATOR',
        name: '分隔符',
        icon: 'grip-lines',
        title: '分隔符',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    PARAGRAPH: {
        type: 'PARAGRAPH',
        name: '段落文本',
        icon: 'parking',
        title: '段落文本支持Markdown语法',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    RICH_TEXT: {
        type: 'RICH_TEXT',
        name: '富文本',
        icon: 'file-code',
        title: '通过所见即所得的方式编辑文段',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    IMAGE_VIEW: {
        type: 'IMAGE_VIEW',
        name: '图片展示',
        icon: 'image',
        title: '上传静态图片进行展示',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    VIDEO_VIEW: {
        type: 'VIDEO_VIEW',
        name: '视频展示',
        icon: 'video',
        title: '上传静态视频进行展示',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    ATTACHMENT_VIEW: {
        type: 'ATTACHMENT_VIEW',
        name: '附件查看',
        icon: 'file-pdf',
        title: '上传文件以供查看或下载',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    IMAGE_CARD_LINK: {
        type: 'IMAGE_CARD_LINK',
        name: '图卡链接',
        icon: 'images',
        title: '链接到其他页面或外部网页的图形卡片',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    BUTTON_PAGE_LINK: {
        type: 'BUTTON_PAGE_LINK',
        name: '按钮链接',
        icon: 'link',
        title: '链接到其他页面或外部网页的按钮',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    ICON_PAGE_LINK: {
        type: 'ICON_PAGE_LINK',
        name: '图标链接',
        icon: 'icons',
        title: '链接到其他页面或外部网页的图标按钮',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    INSTANCE_LIST: {
        type: 'INSTANCE_LIST',
        name: '实例列表',
        icon: 'list',
        title: '用于显示实例列表',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    SUBMIT_HISTORY: {
        type: 'SUBMIT_HISTORY',
        name: '提交历史',
        icon: 'history',
        title: '用于展示已提交的表单数据',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    ANSWER_REFERENCE: {
        type: 'ANSWER_REFERENCE',
        name: '答案引用',
        icon: 'anchor',
        title: '引用某填值控件的最后一次提交值',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    SUBMISSION_REFERENCE: {
        type: 'SUBMISSION_REFERENCE',
        name: '表单引用',
        icon: 'file-alt',
        title: '引用某页面的最后一次提交的表单数据',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    ATTRIBUTE_TABLE: {
        type: 'ATTRIBUTE_TABLE',
        name: '属性表格',
        icon: 'table',
        title: '以表格形式引用自定义属性',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    ATTRIBUTE_DASHBOARD: {
        type: 'ATTRIBUTE_DASHBOARD',
        name: '属性表盘',
        icon: 'border-all',
        title: '以表盘形式引用自定义属性',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    TREND: {
        type: 'TREND',
        name: '趋势图',
        icon: 'chart-line',
        title: '展示控件值随时间的变化情况',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    BAR: {
        type: 'BAR',
        name: '条形图',
        icon: 'signal',
        title: '条形图',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    PIE: {
        type: 'PIE',
        name: '饼状图',
        icon: 'chart-pie',
        title: '饼状图',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    DOUGHNUT: {
        type: 'DOUGHNUT',
        name: '圆环图',
        icon: 'circle-notch',
        title: '圆环图',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    TIME_SEGMENT: {
        type: 'TIME_SEGMENT',
        name: '分时统计',
        icon: 'chart-bar',
        title: '分时段进行统计，包括页面提交量或者控件数值',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    NUMBER_RANGE_SEGMENT: {
        type: 'NUMBER_RANGE_SEGMENT',
        name: '值域分布',
        icon: 'sort-amount-up',
        title: '对多个数值分段区间分别统计相应的提交次数，仅支持数字输入控件和打分控件',
        fillable: false,
        answerValueType: null,
        autoFillEligible: false,
    },

    RADIO: {
        type: 'RADIO',
        name: '单选框',
        icon: ['far', 'dot-circle'],
        title: '单选框',
        fillable: true,
        answerValueType: 'RADIO_VALUE',
        autoFillEligible: true,
    },

    CHECKBOX: {
        type: 'CHECKBOX',
        name: '多选框',
        icon: ['far', 'check-square'],
        title: '多选框',
        fillable: true,
        answerValueType: 'CHECKBOX_VALUE',
        autoFillEligible: true,
    },

    SINGLE_LINE_TEXT: {
        type: 'SINGLE_LINE_TEXT',
        name: '单行文本',
        icon: 'font',
        title: '单行文本',
        fillable: true,
        answerValueType: 'TEXT_VALUE',
        autoFillEligible: true,
    },

    MULTI_LINE_TEXT: {
        type: 'MULTI_LINE_TEXT',
        name: '多行文本',
        icon: 'align-justify',
        title: '多行文本支持Markdown语法',
        fillable: true,
        answerValueType: 'MULTI_LINE_TEXT_VALUE',
        autoFillEligible: true,
    },

    RICH_TEXT_INPUT: {
        type: 'RICH_TEXT_INPUT',
        name: '富文本框',
        icon: 'code',
        title: '通过所见即所得的方式编辑文段',
        fillable: true,
        answerValueType: 'RICH_TEXT_VALUE',
        autoFillEligible: true,
    },

    PERSON_NAME: {
        type: 'PERSON_NAME',
        name: '姓名',
        icon: 'user',
        title: '姓名',
        fillable: true,
        answerValueType: 'IDENTIFIER_VALUE',
        autoFillEligible: true,
    },

    MOBILE: {
        type: 'MOBILE',
        name: '手机',
        icon: 'tablet-alt',
        title: '手机号码',
        fillable: true,
        answerValueType: 'MOBILE_VALUE',
        autoFillEligible: true,
    },

    EMAIL: {
        type: 'EMAIL',
        name: '邮箱',
        icon: ['far', 'envelope'],
        title: '电子邮件',
        fillable: true,
        answerValueType: 'EMAIL_VALUE',
        autoFillEligible: true,
    },

    DROPDOWN: {
        type: 'DROPDOWN',
        name: '下拉框',
        icon: 'caret-square-down',
        title: '下拉框',
        fillable: true,
        answerValueType: 'DROPDOWN_VALUE',
        autoFillEligible: true,
    },

    MULTI_LEVEL_SELECTION: {
        type: 'MULTI_LEVEL_SELECTION',
        name: '多级下拉',
        icon: 'angle-double-down',
        title: '多级下拉框',
        fillable: true,
        answerValueType: 'MULTI_LEVEL_SELECTION_VALUE',
        autoFillEligible: true,
    },

    FILE_UPLOAD: {
        type: 'FILE_UPLOAD',
        name: '文件上传',
        icon: 'file-upload',
        title: '文件上传',
        fillable: true,
        answerValueType: 'FILES_VALUE',
        autoFillEligible: false,
    },

    IMAGE_UPLOAD: {
        type: 'IMAGE_UPLOAD',
        name: '图片上传',
        icon: 'cloud-upload-alt',
        title: '图片上传',
        fillable: true,
        answerValueType: 'IMAGES_VALUE',
        autoFillEligible: false,
    },

    ADDRESS: {
        type: 'ADDRESS',
        name: '省市地址',
        icon: 'map-marked-alt',
        title: '省市地址',
        fillable: true,
        answerValueType: 'ADDRESS_VALUE',
        autoFillEligible: true,
    },

    GEOLOCATION: {
        type: 'GEOLOCATION',
        name: '定位',
        icon: 'map-marker-alt',
        title: '定位',
        fillable: true,
        answerValueType: 'GEOLOCATION_VALUE',
        autoFillEligible: true,
    },

    NUMBER_INPUT: {
        type: 'NUMBER_INPUT',
        name: '数字',
        icon: 'calculator',
        title: '数字',
        fillable: true,
        answerValueType: 'DOUBLE_VALUE',
        autoFillEligible: true,
    },

    NUMBER_RANKING: {
        type: 'NUMBER_RANKING',
        name: '五星打分',
        icon: ['far', 'star'],
        title: '五星打分',
        fillable: true,
        answerValueType: 'INTEGER_VALUE',
        autoFillEligible: true,
    },

    DATE: {
        type: 'DATE',
        name: '日期',
        icon: ['far', 'calendar-minus'],
        title: '日期',
        fillable: true,
        answerValueType: 'LOCAL_DATE_VALUE',
        autoFillEligible: true,
    },

    TIME: {
        type: 'TIME',
        name: '时间',
        icon: ['far', 'clock'],
        title: '时间',
        fillable: true,
        answerValueType: 'LOCAL_TIME_VALUE',
        autoFillEligible: true,
    },

    IDENTIFIER: {
        type: 'IDENTIFIER',
        name: '编号标识',
        icon: 'fingerprint',
        title: '编号标识，可用于编号，标签等需要进行搜索的字段',
        fillable: true,
        answerValueType: 'IDENTIFIER_VALUE',
        autoFillEligible: true,
    },

    ITEM_COUNT: {
        type: 'ITEM_COUNT',
        name: '物品明细',
        icon: 'list-ol',
        title: '选择物品及相应数量',
        fillable: true,
        answerValueType: 'ITEM_COUNT_VALUE',
        autoFillEligible: true,
    },

    ITEM_STATUS: {
        type: 'ITEM_STATUS',
        name: '状态选择',
        icon: 'traffic-light',
        title: '状态选择控件，可为每种状态配置不同显示颜色',
        fillable: true,
        answerValueType: 'ITEM_STATUS_VALUE',
        autoFillEligible: true,
    },

    POINT_CHECK: {
        type: 'POINT_CHECK',
        name: '点检',
        icon: 'check-square',
        title: '点检，用于有若干检查项的场景',
        fillable: true,
        answerValueType: 'POINT_CHECK_VALUE',
        autoFillEligible: true,
    },

    SIGNATURE: {
        type: 'SIGNATURE',
        name: '电子签名',
        icon: 'file-signature',
        title: '电子签名',
        fillable: true,
        answerValueType: 'SIGNATURE_VALUE',
        autoFillEligible: false,
    },

    MEMBER_SELECT: {
        type: 'MEMBER_SELECT',
        name: '成员选择',
        icon: 'user-friends',
        title: '成员选择（仅对非公开页面可用）',
        fillable: true,
        answerValueType: 'MEMBERS_VALUE',
        autoFillEligible: true,
    },
}
