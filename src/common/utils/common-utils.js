/* eslint-disable */
import dayjs from 'dayjs';
import eventBus from '@/common/utils/event-bus';
import {allViewableAcceptTypes} from "@/common/utils/mime-utils";
import controlTypes from "@/common/utils/control-types";
import fonts from "@/common/utils/fonts";
import commonApi from '@/common/api/common-api';
import valueTypes from "@/common/utils/value-types";
import playTypes from '@/common/utils/plan-types';
import uuid from "short-uuid";

export function goToMryOfficialWebsite() {
    window.open("//www.mryqr.com", '_blank');
}

//比如，对于www.dev.mryqr.com，返回mryqr.com，用于设置cookie等处
export function rootDomain() {
    let hostname = location.hostname;
    if (!isCurrentUsingDomainName()) {
        return hostname;
    }

    let temp = location.hostname.split('.').reverse();
    return temp[1] + '.' + temp[0];
}

export function isSubdomainCustomized() {
    const hostname = location.hostname;
    return !hostname.startsWith('console') && !hostname.startsWith('m') && isCurrentUsingDomainName();
}

export function isCurrentUsingDomainName() {
    const hostname = location.hostname;
    return !isIpAddress(hostname) && hostname !== 'localhost';
}

//比如对于，www.uat.mryqr.com，返回www
export function currentSubdomainPrefix() {
    return location.hostname.split('.')[0];
}

export function replaceCurrentUrlWithSubdomain(subdomainPrefix) {
    const original = new URL(location.href);
    original.hostname = location.hostname.replace(/^[^.]*/, subdomainPrefix);
    return original.href;
}

export function isIpAddress(address) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address);
}

export function isMobileBrowser() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isAndroidBrowser() {
    return /Android/i.test(navigator.userAgent);
}

export function isInWx() {
    let ua = navigator.userAgent.toLowerCase();
    let isWx = ua.includes('micromessenger');
    if (!isWx) {
        return false;
    }

    return !(ua.includes("wxwork"));
}

export function isInWxWork() {
    let ua = navigator.userAgent.toLowerCase();
    return ua.includes("wxwork");
}

export function isInMobileChrome() {
    if (!isMobileBrowser()) {
        return false;
    }

    let ua = navigator.userAgent.toLowerCase();
    return ua.includes("chrome") || ua.includes("crios");
}

export function isInMobileSafari() {
    if (!isMobileBrowser()) {
        return false;
    }

    let ua = navigator.userAgent.toLowerCase();
    return ua.includes("safari") &&
        !ua.includes("fxios") &&
        !ua.includes("crios") &&
        !ua.includes("chrome") &&
        !ua.includes("alipay") &&
        !ua.includes("micromessenger");
}

export function formatEpochToMinute(epoch) {
    return dayjs.tz(epoch).format('YYYY-MM-DD HH:mm');
}

export function formatDateToMinute(date) {
    return dayjs.tz(date).format('YYYY-MM-DD HH:mm');
}

export function formatEpochToDate(epoch) {
    return dayjs.tz(epoch).format('YYYY-MM-DD');
}

export function formatDateToDate(date) {
    return dayjs.tz(date).format('YYYY-MM-DD');
}

export function isNew(object) {
    return object.createdAt + 60000 > new Date().getTime();
}

export function isNewerThan(object, seconds) {
    return object.createdAt + seconds * 1000 > new Date().getTime();
}

export function changeFavIcon(iconUrl) {
    let $favicon = document.querySelector('link[rel="icon"]');
    if ($favicon !== null) {
        $favicon.href = iconUrl;
    } else {
        $favicon = document.createElement("link");
        $favicon.rel = "icon";
        $favicon.href = iconUrl;
        document.head.appendChild($favicon);
    }
}

export function displayErrorMessage(code, message) {
    eventBus.$emit("showError", {code: code, message: message})
}

export function displayAddress(address) {
    if (!address) {
        return null;
    }

    let province = address.province || "";
    let city = address.city || "";
    if (city === province) {//直辖市和香港的province和city是相同的
        city = '';
    }
    let district = address.district || "";
    let addressDetail = address.address || "";

    return province + city + district + addressDetail;
}

export function distance(point1, point2) {
    let radLat1 = point1.latitude * Math.PI / 180.0;
    let radLat2 = point2.latitude * Math.PI / 180.0;

    let a = radLat1 - radLat2;
    let b = point1.longitude * Math.PI / 180.0 - point2.longitude * Math.PI / 180.0;

    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6371000.0;
    s = Math.round(s * 10000) / 10000.0;
    return s;
}

export function fontStyles(fontStyle) {
    if (!fontStyle) {
        return {};
    }

    return {
        fontFamily: fonts.find(e => e.key === fontStyle.fontFamily).value,
        fontSize: fontStyle.fontSize + 'px',
        fontWeight: fontStyle.bold ? '600' : 'normal',
        fontStyle: fontStyle.italic ? 'italic' : 'normal',
        color: fontStyle.color,
    }
}

export function borderStyles(border) {
    if (!border) {
        return {};
    }

    let borderWidth = `${border.width}px`;
    let borderType = border.type;
    let borderColor = border.color ? border.color : 'transparent';

    return {
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderLeftStyle: border.sides.includes("LEFT") ? borderType : 'NONE',
        borderRightStyle: border.sides.includes("RIGHT") ? borderType : 'NONE',
        borderTopStyle: border.sides.includes("TOP") ? borderType : 'NONE',
        borderBottomStyle: border.sides.includes("BOTTOM") ? borderType : 'NONE',
    }
}

export function shadowStyles(shadow) {
    if (!shadow) {
        return {};
    }

    if (!shadow || !shadow.color || shadow === 0) {
        return {boxShadow: 'none'};
    }

    return {boxShadow: `0 ${shadow.width * 0.25}px ${shadow.width}px ${shadow.color}`};//左右不位移，向下位移是blur的一半
}

export function borderRadiusStyles(borderRadius) {
    if (!borderRadius) {
        return {};
    }

    if (!borderRadius.radius) {
        return {};
    }

    return {
        borderTopLeftRadius: borderRadius.corners.includes('TOP_LEFT') ? borderRadius.radius + 'px' : '0',
        borderTopRightRadius: borderRadius.corners.includes('TOP_RIGHT') ? borderRadius.radius + 'px' : '0',
        borderBottomLeftRadius: borderRadius.corners.includes('BOTTOM_LEFT') ? borderRadius.radius + 'px' : '0',
        borderBottomRightRadius: borderRadius.corners.includes('BOTTOM_RIGHT') ? borderRadius.radius + 'px' : '0',
    }
}

export function appearanceStyles(style) {
    return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius + 'px',
        paddingTop: style.vPadding + 'px',
        paddingBottom: style.vPadding + 'px',
        paddingLeft: style.hPadding + 'px',
        paddingRight: style.hPadding + 'px',
        ...shadowStyles(style.shadow),
        ...borderStyles(style.border)
    }
}

export function canViewFile(file) {
    return allViewableAcceptTypes.includes(file.type);
}

export function viewFile(file) {
    if (canViewFile(file)) {
        window.open(file.fileUrl, '_blank');
    }
}

export function appInstanceDesignation(appSetting) {
    if (!appSetting) {
        return null;
    }

    let instanceAlias = appSetting.config.instanceAlias;
    return instanceAlias ? instanceAlias : '实例';
}

export function appGroupDesignation(appSetting) {
    if (!appSetting) {
        return null;
    }

    let groupAlias = appSetting.config.groupAlias;
    return groupAlias ? groupAlias : '分组';
}

export function pageSubmitterDesignation(page) {
    if (!page) {
        return '提交人';
    }

    let submitterAlias = page.setting.submitterAlias;
    return submitterAlias ? submitterAlias : '提交人';
}

export function pageSubmitAtDesignation(page) {
    if (!page) {
        return '提交时间';
    }

    let submitAtAlias = page.setting.submitAtAlias;
    return submitAtAlias ? submitAtAlias : '提交时间';
}

export function qrCustomIdDesignation(appSetting) {
    if (!appSetting) {
        return null;
    }

    let customIdAlias = appSetting.config.customIdAlias;
    return customIdAlias ? customIdAlias : '自定义编号';
}

export function pageName(page) {
    if (!page) {
        return null;
    }

    return page.setting.pageName;
}

export function pageActionName(page) {
    if (!page) {
        return null;
    }

    let actionName = page.setting.actionName;
    return actionName ? actionName : pageName(page);
}

export function controlFieldName(control) {
    if (!control) {
        return null;
    }

    if (!control.fillableSetting) {
        return control.name;
    }

    let fieldName = control.fillableSetting.fieldName;
    return fieldName ? fieldName : control.name;
}

export function isControlFillable(control) {
    return controlTypes[control.type].fillable;
}

export function isControlAutoFillEligible(control) {
    return controlTypes[control.type].autoFillEligible;
}

export function isPageFillable(page) {
    return page.controls.some(aControl => {
        return isControlFillable(aControl);
    });
}

export function isControlAnswerSortable(control) {
    let answerValueType = controlTypes[control.type].answerValueType;
    return answerValueType ? valueTypes[answerValueType].sortable : false;
}

export function isControlAnswerNumerical(control) {
    let answerValueType = controlTypes[control.type].answerValueType;
    return answerValueType ? valueTypes[answerValueType].numerical : false;
}

export function isControlAnswerNumbered(control) {
    let answerValueType = controlTypes[control.type].answerValueType;
    return answerValueType ? valueTypes[answerValueType].numbered : false;
}

export function isControlAnswerCategorized(control) {
    let answerValueType = controlTypes[control.type].answerValueType;
    return answerValueType ? valueTypes[answerValueType].categorized : false;
}

export function isAttributeValueNumbered(attribute) {
    return valueTypes[attribute.valueType].numbered;
}

export function isAttributeValueCategorized(attribute) {
    return valueTypes[attribute.valueType].categorized;
}

export function isAttributeValueSortable(attribute) {
    return valueTypes[attribute.valueType].sortable;
}

let cashedAddressFilters = [];

export function addressFilters() {//只提供省和市的，不提供区域的
    if (cashedAddressFilters.length > 0) {
        return Promise.resolve(cashedAddressFilters);
    }

    return commonApi.fetchAdministratives().then(response => {
        let china = response.data;
        let _addressFilters = [];
        china.child.forEach(province => {
            _addressFilters.push({text: province.name, value: province.name});
        });

        china.child.forEach(province => {
            if (province.child) {
                province.child.forEach(city => {
                    _addressFilters.push({text: `${province.name}/${city.name}`, value: `${province.name}/${city.name}`});
                });
            }
        });
        cashedAddressFilters = _addressFilters;
        return _addressFilters;
    })
}

export function randomColors() {
    return [
        '#00bfff', '#FF8C00', '#ff4500', '#55E40D',
        '#6495ED', '#0ECBF1', '#c71585', '#C6C308',
        '#07BF9B', '#0A51C2', '#841DEB', '#20B2AA',
        '#32CD32', '#EA5110', '#00FFFF', '#DC143C',
        '#FF00FF', '#B0C4DE', '#00FA9A', '#ec9a0c',
    ];
}

export function currentSeason() {
    let currentMonth = dayjs.tz(new Date()).month() + 1;
    if (currentMonth <= 3) {
        return 1;
    }

    if (currentMonth <= 6) {
        return 2;
    }

    if (currentMonth <= 9) {
        return 3;
    }

    return 4;
}

export function recentSeasons(number) {
    let currentYear = dayjs.tz(new Date()).year();
    let pool = [];
    let current = currentSeason();
    for (let i = current; i >= 1; i--) {
        pool.push({year: currentYear, season: i})
    }

    for (let i = 1; i <= 5; i++) {
        pool.push({year: currentYear - i, season: 4});
        pool.push({year: currentYear - i, season: 3});
        pool.push({year: currentYear - i, season: 2});
        pool.push({year: currentYear - i, season: 1});
    }

    return pool.slice(0, number).reverse();
}

export function recentMonths(number) {
    let now = dayjs.tz(new Date());
    let currentMonth = now.month() + 1;
    let currentYear = now.year();

    let pool = [];
    for (let i = currentMonth; i >= 1; i--) {
        pool.push({year: currentYear, month: i})
    }

    for (let i = 1; i <= 5; i++) {
        for (let j = 12; j >= 1; j--) {
            pool.push({year: currentYear - i, month: j});
        }
    }

    return pool.slice(0, number).reverse();
}

export function recentYears(number) {
    let currentYear = dayjs.tz(new Date()).year();
    let pool = [];
    for (let i = 0; i < number; i++) {
        pool.push(currentYear - i);
    }
    return pool.reverse();
}

export function dataURItoFile(dataURI, fileName) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    let theBlob = new Blob([ia], {type: mimeString});
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export function operationMenuName(appSetting, type, pageId) {
    let menu = appSetting.operationMenuItems.find(item => item.type === type && item.pageId === pageId);
    return menu ? menu.name : null;
}

export function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

export function isApiErrorResponse(ex) {
    return ex.response && ex.response.data && ex.response.data.error && ex.response.data.error.code;
}

export function errorOfApi(ex) {
    return ex.response.data.error;
}

export function apiErrorCodeOf(ex) {
    return ex.response.data.error.code;
}

export function zoom(el, zoom) {
    let scale = `scale(${zoom},${zoom})`;

    ["webkit", "moz", "ms", "o"].forEach(prefix => {
        el.style[prefix + "Transform"] = scale;
        el.style[prefix + "TransformOrigin"] = 'center';
    })

    el.style["transform"] = scale;
    el.style["transformOrigin"] = 'center';
}

export function rgba2hex(orig) {
    if (!orig) {
        return null;
    }

    let a,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

    if (alpha !== "") {
        a = alpha;
    } else {
        a = 0o1;
    }
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;

    return hex;
}

export function justifyContentOf(alignType) {
    if (alignType === 'CENTER') {
        return 'center';
    }

    if (alignType === 'RIGHT') {
        return 'flex-end';
    }

    return 'flex-start';
}

export function textAlignOf(alignType) {
    if (alignType === 'CENTER') {
        return 'center';
    }

    if (alignType === 'RIGHT') {
        return 'right';
    }

    return 'left';
}

export function alignSelfOf(alignType) {
    if (alignType === 'TOP') {
        return 'flex-start';
    }

    if (alignType === 'MIDDLE') {
        return 'center';
    }

    if (alignType === 'BOTTOM') {
        return 'flex-end';
    }

    return 'flex-start';
}

export function plateDisplayTextFor(textValue, qr) {
    switch (textValue.type) {
        case "FIXED_TEXT": {
            return textValue.text ? textValue.text : '';
        }

        case "QR_PROPERTY": {
            switch (textValue.propertyType) {
                case 'APP_NAME': {
                    return qr.appName;
                }
                case 'TENANT_NAME': {
                    return qr.tenantName;
                }
                case 'QR_ID': {
                    return qr.id;
                }
                case 'QR_NAME': {
                    return qr.name;
                }
                case 'QR_GROUP_NAME': {
                    return qr.groupName;
                }
                case 'QR_CUSTOM_ID': {
                    return qr.customId;
                }
                case 'QR_PLATE_ID': {
                    return qr.plateId;
                }
                default: {
                    return '';
                }
            }
        }

        case "QR_ATTRIBUTE": {
            return qr.attributes[textValue.attributeId];
        }
    }
}

export function plateFakeQrUrl() {
    return `https://m.mryqr.com/r/MRY393579780680323072`;
}

export function qrUrl(plateId) {
    let protocol = location.protocol;
    let reportHost = location.host.replace(/^[^.]*/, 'm');
    return `${protocol}//${reportHost}/r/${plateId}`;
}

export function qrUrlWithPage(plateId, pageId) {
    let protocol = location.protocol;
    let reportHost = location.host.replace(/^[^.]*/, 'm');
    return `${protocol}//${reportHost}/r/${plateId}/pages/${pageId}`;
}

export function qrUrlWithSubmission(plateId, pageId, submissionId) {
    let protocol = location.protocol;
    let reportHost = location.host.replace(/^[^.]*/, 'm');
    return `${protocol}//${reportHost}/r/${plateId}/pages/${pageId}/${submissionId}`;
}

export function canPlanCover(planType1, planType2) {
    return playTypes[planType1].level >= playTypes[planType2].level;
}

export function randomHtmlElementId() {
    return 'e' + uuid.generate();
}

export function conciseNumberDisplay(num) {
    if (num < 10000) {
        return num;
    }

    if (num % 10000 !== 0) {
        return num;
    }

    return num / 10000 + '万';
}

export const HTML2CANVAS_SCALE = 2;
export const PLATE_IMAGE_SCALE = 8;

