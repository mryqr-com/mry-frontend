/* eslint-disable */
import {isIpAddress} from "@/common/utils/common-utils";

let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let mobileRegex = /^1[3456789]\d{9}$/;
let unifiedCodeRegex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
let bankAccountRegex = /^[1-9]\d{9,29}$/;
let phoneRegex = /^[\d\s\-]{5,15}$/;

export default {
    MOBILE_REGEX: mobileRegex,
    EMAIL_REGEX: emailRegex,

    VERIFICATION_RULE: (rule, value, callback) => {
        if (value && /^\d{6}$/.test(value) === false) {
            callback(new Error('验证码格式不正确'));
        } else {
            callback();
        }
    },

    NO_SPACE_RULE: (rule, value, callback) => {
        if (value && /\s/.test(value) === true) {
            callback(new Error('不能包含空白字符'));
        } else {
            callback();
        }
    },

    SUBDOMAIN_RULE: (rule, value, callback) => {
        if (value && /^[a-zA-Z0-9][a-zA-Z0-9-]{0,20}[a-zA-Z0-9]$/.test(value) === false) {
            callback(new Error('子域名由字母、数字、或中划线组成，最多20个字符，只能以数字或字母开始，同时只能以数字或字母结束'));
        } else {
            callback();
        }
    },

    MOBILE_RULE: (rule, value, callback) => {
        if (value && mobileRegex.test(value) === false) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    },

    EMAIL_RULE: (rule, value, callback) => {
        if (value && !(emailRegex.test(value))) {
            callback(new Error('邮箱格式不正确'));
        } else {
            callback();
        }
    },

    MOBILE_OR_EMAIL_RULE: (rule, value, callback) => {
        if (value && !(mobileRegex.test(value) || emailRegex.test(value))) {
            callback(new Error('手机号或邮箱格式不正确'));
        } else {
            callback();
        }
    },

    //8-20为字符，由字母或数字或特殊符号组成，注意不是并且的关系
    PASSWORD_RULE: (rule, value, callback) => {
        if (value && /^[A-Za-z\d!@#$%^&*()_+]{8,20}$/.test(value) === false) {
            callback(new Error('密码格式不正确，密码由8-20位字符组成，可以为字母、数字或特殊符号'));
        } else {
            callback();
        }
    },

    QR_BATCH_MAX_RULE: (rule, value, callback) => {
        if (value > 100) {
            callback(new Error('最大不超过100个'));
        } else {
            callback();
        }
    },

    PLATE_ID_RULE: (rule, value, callback) => {
        if (value && /^MRY[0-9]{15,19}$/.test(value) === false) {
            callback(new Error('请输入正确格式的码牌号'));
        } else {
            callback();
        }
    },

    HTTP_URL_RULE: (rule, value, callback) => {
        let url;
        try {
            url = new URL(value);
        } catch (_) {
            callback(new Error('URL格式不正确'));
            return;
        }

        if (url.protocol === "http:" || url.protocol === "https:") {
            callback();
        } else {
            callback(new Error('请使用HTTP协议的URL'));
        }
    },

    WEBHOOK_URL_RULE: (rule, value, callback) => {
        let url;
        try {
            url = new URL(value);
        } catch (_) {
            callback(new Error('URL格式不正确'));
            return;
        }

        if (isIpAddress(url.hostname)) {
            callback(new Error('不能使用IP地址'));
            return;
        }

        if (url.hostname === 'localhost') {
            callback(new Error('不能使用localhost地址'));
            return;
        }
        callback();
    },

    NUMBER_RANGE_SEGMENT_RULE: (rule, value, callback) => {
        if (!value) {
            callback();
            return;
        }

        if (!value.includes(',') && !value.includes("，")) {
            callback(new Error('必须包含以逗号(,)分隔的数字'));
            return;
        }

        let split = value.split(/[,，]/).filter(e => !!e);
        if (split.length <= 1) {
            callback(new Error('必须包含至少2个数字分段'));
            return;
        }

        callback();
    },

    UNIFIED_CODE_RULE: (rule, value, callback) => {
        if (value && !(unifiedCodeRegex.test(value))) {
            callback(new Error('统一社会信用代码格式不正确'));
        } else {
            callback();
        }
    },

    BANK_ACCOUNT_RULE: (rule, value, callback) => {
        if (value && !(bankAccountRegex.test(value))) {
            callback(new Error('银行账号格式不正确'));
        } else {
            callback();
        }
    },

    PHONE_RULE: (rule, value, callback) => {
        if (value && !(phoneRegex.test(value))) {
            callback(new Error('电话号码格式不正确'));
        } else {
            callback();
        }
    },

}