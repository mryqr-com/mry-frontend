import pageFactory from '@/console/app-edit/store/page-factory';
import controlFactory from '@/console/app-edit/store/control-factory';
import plateControlFactory from '@/console/app-edit/store/plate-control-factory';
import appApi from '@/common/api/app-api';

import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import Vue from 'vue';
import controlTypes from '@/common/utils/control-types';
import {cloneDeep} from 'lodash-es';
import uuid from 'short-uuid';
import {
    appGroupDesignation,
    appInstanceDesignation,
    controlFieldName,
    isControlAnswerCategorized,
    isControlAnswerNumbered,
    isControlAnswerNumerical,
    isControlFillable,
    isPageFillable,
    pageName,
    pageSubmitAtDesignation,
    pageSubmitterDesignation,
    qrCustomIdDesignation,
} from '@/common/utils/common-utils';

const state = {
    app: {},
    pageStatus: {},
    loaded: false,
    saved: true,
    tabletView: 'true' === localStorage.tabletView,
    panelKey: uuid.generate(),
    currentPageId: null,

    plateSettingEditPanelKey: uuid.generate(),
    currentPlateControlId: null,
    currentPlateControlEditType: null,
    plateTemplates: [],
};

const getters = {
    appSetting(state) {
        return state.app.setting;
    },

    isCurrentPageControlFull(state, getters) {
        return getters.currentPage.controls.length >= 20;
    },

    isPageFull(state) {
        return state.app.setting.pages.length >= 20;
    },

    menu(state) {
        return state.app.setting.menu;
    },

    appEditOssRequest(state, getters) {
        return {
            type: 'APP_EDIT',
            appId: getters.appId,
            tenantId: getters.appTenantId
        };
    },

    appId(state) {
        return state.app.id;
    },

    appTenantId(state) {
        return state.app.tenantId;
    },

    appConfig(state) {
        return state.app.setting.config;
    },

    appCirculationStatusSetting() {
        return state.app.setting.circulationStatusSetting;
    },

    appTopBar(state) {
        return state.app.setting.appTopBar;
    },

    isGeolocationEnabled(state, getters) {
        return getters.appConfig.geolocationEnabled;
    },

    instanceDesignation(state) {
        return appInstanceDesignation(state.app.setting);
    },

    groupDesignation(state) {
        return appGroupDesignation(state.app.setting);
    },

    customIdDesignation(state) {
        return qrCustomIdDesignation(state.app.setting);
    },

    submitterDesignationOf: (state, getters) => (pageId) => {
        let page = getters.pageOf(pageId);
        return pageSubmitterDesignation(page);
    },

    submitAtDesignationOf: (state, getters) => (pageId) => {
        let page = getters.pageOf(pageId);
        return pageSubmitAtDesignation(page);
    },

    isCurrentPageFillable(state, getters) {
        return isPageFillable(getters.currentPage);
    },

    allFillablePages(state, getters) {
        return getters.allPages.filter(page => {
            return isPageFillable(page);
        })
    },

    appName(state) {
        return state.app.name;
    },

    pageOf: (state) => (pageId) => {
        return state.app.setting.pages.find(page => page.id === pageId);
    },

    pageNameOf: (state, getters) => (pageId) => {
        let page = getters.pageOf(pageId);
        return pageName(page);
    },

    allAttributeReferencableControls: (state, getters) => (pageId, attributeType) => {
        if (!pageId) {
            return [];
        }

        let thePage = getters.pageOf(pageId);
        return thePage.controls.filter((control) => {
            if (['CONTROL_SUM', 'CONTROL_AVERAGE', 'CONTROL_MAX', 'CONTROL_MIN'].includes(attributeType)) {
                return isControlAnswerNumbered(control);
            }
            return isControlFillable(control);
        });
    },

    allAnswerNumberedControlsOfPage: (state, getters) => (pageId) => {
        if (!pageId) {
            return [];
        }

        let thePage = getters.pageOf(pageId);
        return thePage.controls.filter((control) => isControlAnswerNumbered(control));
    },

    allAnswerCategorizedControlsOfPage: (state, getters) => (pageId) => {
        if (!pageId) {
            return [];
        }

        let thePage = getters.pageOf(pageId);
        return thePage.controls.filter((control) => isControlAnswerCategorized(control));
    },

    allDateControlsOfPage: (state, getters) => (pageId) => {
        if (!pageId) {
            return [];
        }

        let thePage = getters.pageOf(pageId);
        return thePage.controls.filter((control) => control.type === 'DATE');
    },

    homePage(state) {
        return state.app.setting.pages
            .find(p => p.id === state.app.setting.config.homePageId);
    },

    isHomePage: (state, getters) => (page) => {
        return page.id === getters.homePage.id;
    },

    isHomePageById: (state, getters) => (id) => {
        return getters.homePage.id === id;
    },

    isCurrentHomePage(state, getters) {
        return getters.currentPage.id === getters.homePage.id;
    },

    shouldCurrentPageShowTopBar(state, getters) {
        return !getters.currentPage.setting.hideTopBar;
    },

    shouldCurrentPageShowTopBottomBlank(state, getters) {
        return !getters.currentPage.setting.hideTopBottomBlank;
    },

    shouldCurrentPageShowHeader(state, getters) {
        return !getters.currentPage.setting.hideHeader;
    },

    shouldCurrentPageShowTitle(state, getters) {
        return !getters.currentPage.setting.hideTitle;
    },

    shouldCurrentPageShowMenu(state, getters) {
        return !getters.currentPage.setting.hideMenu;
    },

    shouldCurrentPageShowProfileButton(state, getters) {
        return !getters.currentPage.setting.hideProfileButton;
    },

    currentPageMaxWidth(state, getters) {
        return getters.currentPage.setting.pageMaxWidth;
    },

    currentPageContentMaxWidth(state, getters) {
        return getters.currentPage.setting.contentMaxWidth;
    },

    currentPageBackgroundColor(state, getters) {
        return getters.currentPage.setting.pageBackgroundColor;
    },

    currentPageShadow(state, getters) {
        return getters.currentPage.setting.shadow;
    },

    currentPageBorder(state, getters) {
        return getters.currentPage.setting.border;
    },

    currentPageViewPortBackgroundColor(state, getters) {
        return getters.currentPage.setting.viewPortBackgroundColor;
    },

    currentPageViewPortBackgroundImage(state, getters) {
        return getters.currentPage.setting.viewPortBackgroundImage;
    },

    isCurrentPageRequireLogin(state, getters) {
        return getters.currentPage.setting.permission !== 'PUBLIC';
    },

    isCurrentPageNewSubmit(state, getters) {
        return getters.currentPage.setting.submitType === 'NEW';
    },

    currentPageName(state, getters) {
        return pageName(getters.currentPage);
    },

    toPageSummary: (state, getters) => (page) => {
        let name = pageName(page);
        if (getters.isHomePageById(page.id)) {
            name = `${name}（首页）`;
        }
        return {id: page.id, name: name};
    },

    currentPage(state, getters) {
        return getters.pageOf(state.currentPageId);
    },

    allPageSummaries(state, getters) {
        return getters.allPages.map(t => getters.toPageSummary(t));
    },

    allFillablePageSummaries(state, getters) {
        let pages = getters.allPages.filter((e) => {
            return e.controls.some((c) => {
                return controlTypes[c.type].fillable;
            });
        });

        return pages.map((t) => getters.toPageSummary(t));
    },

    allFillableControls: (state, getters) => (pageId) => {
        if (!pageId) {
            return [];
        }

        let thePage = getters.pageOf(pageId);
        return thePage.controls.filter((e) => {
            return controlTypes[e.type].fillable;
        });
    },

    currentPageAllAnswerNumericalControls(state, getters) {
        return getters.currentPage.controls.filter((control) => isControlAnswerNumerical(control));
    },

    allControls(state, getters) {
        const pageControls = getters.allPages.map((p) => {
            return p.controls;
        });

        return [].concat.apply([], pageControls);
    },

    controlOf: (state, getters) => (controlId) => {
        return getters.allControls.find(c => c.id === controlId);
    },

    controlTypeOf: (state, getters) => (controlId) => {
        return getters.controlOf(controlId).type;
    },

    controlNameOf: (state, getters) => (controlId) => {
        let control = getters.controlOf(controlId);
        return control ? control.name : '';
    },

    controlFieldNameOf: (state, getters) => (controlId) => {
        let control = getters.controlOf(controlId);
        return control ? controlFieldName(control) : '';
    },

    allPages(state) {
        return state.app.setting.pages;
    },

    allAttributes(state) {
        return state.app.setting.attributes;
    },

    isAttributeFull(state, getters) {
        return getters.allAttributes.length >= 20;
    },

    hasControlLastAnswerRefedAttribute: (state, getters) => (controlId) => {
        return getters.allAttributes.some(it => {
            return it.controlId === controlId && it.type === 'CONTROL_LAST';
        });
    },

    attributeNameFor: (state, getters) => (attributeId) => {
        return getters.allAttributes.find(a => a.id === attributeId).name;
    },

    allOperationMenuItems(state) {
        return state.app.setting.operationMenuItems;
    },

    isOperationMenuFull(state, getters) {
        return getters.allOperationMenuItems.length >= 20;
    },

    currentEditType(state) {
        let current = state.pageStatus[state.currentPageId];
        return current ? current.currentEditType : null;
    },

    currentControlId(state) {
        let current = state.pageStatus[state.currentPageId];
        return current ? current.currentControlId : null;
    },

    currentControl(state, getters) {
        let controlId = getters.currentControlId;
        return getters.currentPage.controls
            .find(e => e.id === controlId);
    },

    isFirstControl: (state, getters) => (controlId) => {
        let controls = getters.currentPage.controls;
        return controlId === controls[0].id;
    },

    isLastControl: (state, getters) => (controlId) => {
        let controls = getters.currentPage.controls;
        return controlId === controls[controls.length - 1].id;
    },

    checkAttributeRefOnPageDeletion: (state, getters) => (pageId) => {
        let names = getters.allAttributes.filter(a => a.pageId === pageId).map(a => a.name);
        if (names.length > 0) {
            throw Error(`删除失败，有${names.length}个自定义属性项【${names}】对该页面存在引用。`);
        }
    },

    checkOperationMenuRefOnPageDeletion: (state, getters) => (pageId) => {
        let names = getters.allOperationMenuItems.filter(a => a.pageId === pageId).map(a => a.name);
        if (names.length > 0) {
            throw Error(`删除失败，有${names.length}个运营菜单项【${names}】对该页面存在引用。`);
        }
    },

    checkMenuRefOnPageDeletion: (state) => (pageId) => {
        let names = state.app.setting.menu.links.filter(link => link.pageId === pageId).map(link => link.name);
        if (names.length > 0) {
            throw Error(`删除失败，有${names.length}个菜单项【${names}】对该页面存在引用。`);
        }
    },

    checkPageAfterSubmitRefOnPageDeletion: (state, getters) => (pageId) => {
        let names = getters.allPages.filter(page => page.setting.afterSubmitBehaviour.internalPageId === pageId).map(page => pageName(page));

        if (names.length > 0) {
            throw Error(`删除失败，有${names.length}个页面【${names}】的提交后行为被设置成了导向该页面。`);
        }
    },

    checkCirculationRefOnPageDeletion: (state, getters) => (pageId) => {
        let setting = getters.appCirculationStatusSetting;
        if (setting.statusAfterSubmissions.some(it => it.pageId === pageId) ||
            setting.statusPermissions.some(it => it.notAllowedPageIds.includes(pageId))) {
            throw Error('删除失败，状态流转设置对该页面存在引用。');
        }
    },

    checkControlRefOnPageDeletion: (state, getters) => (pageId) => {
        getters.allPages.filter(page => page.id !== pageId).forEach((page) => {
            let allControls = page.controls;
            allControls.forEach(control => {
                switch (control.type) {
                    case 'IMAGE_CARD_LINK':
                    case 'ICON_PAGE_LINK':
                    case 'BUTTON_PAGE_LINK': {
                        if (control.links.some(c => c.pageId === pageId)) {
                            throw Error(`删除失败，页面【${pageName(page)}】中的控件【${control.name}】对该页面存在引用。`);
                        }
                        break;
                    }

                    case 'SUBMIT_HISTORY': {
                        if (control.pageIds.includes(pageId)) {
                            throw Error(`删除失败，页面【${pageName(page)}】中的控件【${control.name}】对该页面存在引用。`);
                        }
                        break;
                    }

                    case 'TIME_SEGMENT': {
                        if (control.segmentSettings.some(setting => setting.pageId === pageId)) {
                            throw Error(`删除失败，页面【${pageName(page)}】中的控件【${control.name}】对该页面存在引用。`);
                        }
                        break;
                    }

                    case 'ANSWER_REFERENCE':
                    case 'SUBMISSION_REFERENCE':
                    case 'NUMBER_RANGE_SEGMENT':
                    case 'BAR':
                    case 'DOUGHNUT':
                    case 'PIE': {
                        if (control.pageId === pageId) {
                            throw Error(`删除失败，页面【${pageName(page)}】中的控件【${control.name}】对该页面存在引用。`);
                        }
                        break;
                    }

                    case 'TREND': {
                        if (control.trendItems.some(a => a.pageId === pageId)) {
                            throw Error(`删除失败，页面【${pageName(page)}】中的控件【${control.name}】对该页面存在引用。`);
                        }
                        break;
                    }
                }
            })
        });
    },

    checkAttributeRefOnControlDeletion: (state, getters) => (controlId) => {
        let names = getters.allAttributes.filter(a => a.controlId === controlId).map(a => a.name);
        if (names.length > 0) {
            throw Error(`删除失败，有${names.length}个自定义属性项【${names}】对该控件存在引用。`);
        }
    },

    checkControlRefOnControlDeletion: (state, getters) => (controlId) => {
        getters.allPages.forEach((page) => {
            let allControls = page.controls;
            allControls.forEach(control => {
                switch (control.type) {
                    case 'ITEM_STATUS':
                    case 'NUMBER_INPUT': {
                        if (control.id === controlId) {//排除自身
                            break;
                        }

                        if (!control.autoCalculateEnabled) {//排除非自动计算控件
                            break;
                        }

                        let dependentControlIds = control.autoCalculateSetting.aliasContext.controlAliases.map(alias => alias.controlId);
                        if (dependentControlIds.includes(controlId)) {
                            throw Error(`删除失败，页面【${pageName(page)}】中的控件【${control.name}】的自动计算别名对该控件存在引用。`);
                        }

                        break;
                    }
                    case 'ANSWER_REFERENCE': {
                        if (control.controlId === controlId) {
                            throw Error(`删除失败，页面【${pageName(page)}】中的控件【${control.name}】对该控件存在引用。`);
                        }
                        break;
                    }

                    case 'BAR': {
                        if (control.basedControlId === controlId || control.targetControlIds.includes(controlId)) {
                            throw Error(`删除失败，页面【${pageName(page)}】中控件【${control.name}】对该控件存在引用。`);
                        }
                        break;
                    }

                    case 'TIME_SEGMENT': {
                        if (control.segmentSettings.some(setting => setting.basedControlId === controlId || setting.targetControlId === controlId)) {
                            throw Error(`删除失败，页面【${pageName(page)}】中控件【${control.name}】对该控件存在引用。`);
                        }
                        break;
                    }

                    case 'NUMBER_RANGE_SEGMENT':
                    case 'DOUGHNUT':
                    case 'PIE': {
                        if (control.basedControlId === controlId || control.targetControlId === controlId) {
                            throw Error(`删除失败，页面【${pageName(page)}】中控件【${control.name}】对该控件存在引用。`);
                        }
                        break;
                    }

                    case 'TREND': {
                        if (control.trendItems.some(a => a.basedControlId === controlId || a.targetControlId === controlId)) {
                            throw Error(`删除失败，页面【${pageName(page)}】中的控件【${control.name}】对该控件存在引用。`);
                        }
                        break;
                    }
                }
            })
        });
    },

    checkControlRefOnAttributeDeletion: (state, getters) => (attributeId) => {
        getters.allPages.forEach((page) => {
            let allControls = page.controls;
            allControls.forEach(control => {
                switch (control.type) {
                    case 'ATTRIBUTE_TABLE':
                    case 'ATTRIBUTE_DASHBOARD': {
                        if (control.attributeIds.includes(attributeId)) {
                            throw Error(`删除失败，页面【${pageName(page)}】中的控件【${control.name}】对该属性存在引用。`);
                        }
                        break;
                    }
                }
            })
        });
    },

    checkPlateControlRefOnAttributeDeletion: (state, getters) => (attributeId) => {
        getters.plateSetting.controls.forEach((control) => {
            switch (control.type) {
                case 'SINGLE_ROW_TEXT': {
                    if (control.textValue.attributeId === attributeId) {
                        throw Error(`删除失败，码牌设置中有控件对该属性存在引用。`);
                    }
                    break;
                }

                case 'TABLE': {
                    if (control.headerTextValue.attributeId === attributeId) {
                        throw Error(`删除失败，码牌设置中有控件对该属性存在引用。`);
                    }

                    let existsReference = control.contentTextValues.some(namedTextValue => {
                        return namedTextValue.value.attributeId === attributeId;
                    });
                    if (existsReference) {
                        throw Error(`删除失败，码牌设置中有控件对该属性存在引用。`);
                    }
                    break;
                }

                case 'KEY_VALUE': {
                    let existsReference = control.textValues.some(namedTextValue => {
                        return namedTextValue.value.attributeId === attributeId;
                    });
                    if (existsReference) {
                        throw Error(`删除失败，码牌设置中有控件对该属性存在引用。`);
                    }
                    break;
                }
            }
        });
    },

    attributeTypesMetadataCatalog(state, getters) {
        return [
            {
                label: '填入值',
                options: [
                    {
                        type: 'FIXED',
                        text: '固定值',
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'DIRECT_INPUT',
                        text: `直接填入值`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    }]
            },
            {
                label: `${getters.instanceDesignation}引用`,
                options: [
                    {
                        type: 'INSTANCE_NAME',
                        text: `名称`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_ACTIVE_STATUS',
                        text: `是否启用`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_CIRCULATION_STATUS',
                        text: `流转状态`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_TEMPLATE_STATUS',
                        text: `是否为模板`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_PLATE_ID',
                        text: `码牌编号`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_CUSTOM_ID',
                        text: `${getters.customIdDesignation}`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_GEOLOCATION',
                        text: `定位`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_CREATE_TIME',
                        text: `添加时间`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_CREATE_DATE',
                        text: `添加日期`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_CREATOR',
                        text: `创建人`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_CREATOR_AND_MOBILE',
                        text: `创建人 + 手机号`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_CREATOR_AND_EMAIL',
                        text: `创建人 + 邮箱`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_SUBMIT_COUNT',
                        text: `提交次数总计`,
                        rangeAware: true,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_ACCESS_COUNT',
                        text: `访问次数总计`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_GROUP',
                        text: `所在${getters.groupDesignation}`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_GROUP_MANAGERS',
                        text: `所在${getters.groupDesignation}管理员`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_GROUP_MANAGERS_AND_MOBILE',
                        text: `所在${getters.groupDesignation}管理员 + 手机号`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                    {
                        type: 'INSTANCE_GROUP_MANAGERS_AND_EMAIL',
                        text: `所在${getters.groupDesignation}管理员 + 邮箱`,
                        rangeAware: false,
                        pageAware: false,
                        controlAware: false
                    },
                ]
            },
            {
                label: '页面引用',
                options: [
                    {
                        type: 'PAGE_SUBMIT_COUNT',
                        text: `页面提交次数总计`,
                        rangeAware: true,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_SUBMISSION_EXISTS',
                        text: `页面是否存在表单提交`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_FIRST_SUBMITTED_TIME',
                        text: `页面首次提交时间`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_FIRST_SUBMITTED_DATE',
                        text: `页面首次提交日期`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_FIRST_SUBMITTER',
                        text: `页面首次提交人`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_FIRST_SUBMITTER_AND_MOBILE',
                        text: `页面首次提交人 + 手机号`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_FIRST_SUBMITTER_AND_EMAIL',
                        text: `页面首次提交人 + 邮箱`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_LAST_SUBMITTED_TIME',
                        text: `页面最近一次提交时间`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_LAST_SUBMITTED_DATE',
                        text: `页面最近一次提交日期`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_LAST_SUBMISSION_UPDATED_TIME',
                        text: `页面最近一次提交的更新时间`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_LAST_SUBMISSION_UPDATE_DATE',
                        text: `页面最近一次提交的更新日期`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_LAST_SUBMISSION_UPDATER',
                        text: `页面最近一次提交的更新者`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_LAST_SUBMITTER',
                        text: `页面最近一次提交人`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_LAST_SUBMITTER_AND_MOBILE',
                        text: `页面最近一次提交人 + 手机号`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                    {
                        type: 'PAGE_LAST_SUBMITTER_AND_EMAIL',
                        text: `页面最近一次提交人 + 邮箱`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: false
                    },
                ]
            },
            {
                label: '控件引用',
                options: [
                    {
                        type: 'CONTROL_SUM',
                        text: `控件提交值总和`,
                        rangeAware: true,
                        pageAware: true,
                        controlAware: true
                    },
                    {
                        type: 'CONTROL_AVERAGE',
                        text: `控件提交平均值`,
                        rangeAware: true,
                        pageAware: true,
                        controlAware: true
                    },
                    {
                        type: 'CONTROL_MAX',
                        text: `控件提交最大值`,
                        rangeAware: true,
                        pageAware: true,
                        controlAware: true
                    },
                    {
                        type: 'CONTROL_MIN',
                        text: `控件提交最小值`,
                        rangeAware: true,
                        pageAware: true,
                        controlAware: true
                    },
                    {
                        type: 'CONTROL_FIRST',
                        text: `控件首次提交值`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: true
                    },
                    {
                        type: 'CONTROL_LAST',
                        text: `控件最近一次提交值`,
                        rangeAware: false,
                        pageAware: true,
                        controlAware: true
                    },
                ]
            },
        ]
    },

    pagePermissions(state, getters) {
        return [
            {
                type: 'PUBLIC',
                text: '公开'
            },
            {
                type: 'AS_TENANT_MEMBER',
                text: '所有成员'
            },
            {
                type: 'AS_GROUP_MEMBER',
                text: `${getters.groupDesignation}成员及以上`
            },
            {
                type: 'CAN_MANAGE_GROUP',
                text: `${getters.groupDesignation}管理员及以上`
            },
            {
                type: 'CAN_MANAGE_APP',
                text: '应用管理员及以上'
            },
        ]
    },

    operationPermissions(state, getters) {
        return [
            {
                type: 'AS_TENANT_MEMBER',
                text: '所有成员'
            },
            {
                type: 'AS_GROUP_MEMBER',
                text: `${getters.groupDesignation}成员及以上`
            },
            {
                type: 'CAN_MANAGE_GROUP',
                text: `${getters.groupDesignation}管理员及以上`
            },
            {
                type: 'CAN_MANAGE_APP',
                text: '应用管理员及以上'
            },
        ];
    },

    landingPageTypes(state, getters) {
        return [
            {
                type: 'DEFAULT',
                text: '系统默认'
            },
            {
                type: 'QR_LIST',
                text: `${getters.instanceDesignation}列表`
            },
            {
                type: 'GROUP_LIST',
                text: `${getters.groupDesignation}列表`
            },
            {
                type: 'FIRST_QR',
                text: `唯一${getters.instanceDesignation}`
            },
        ];
    },

    modifyPermissions(state, getters) {
        return [
            {
                type: 'CAN_MANAGE_GROUP',
                text: `${getters.groupDesignation}管理员及以上`
            },
            {
                type: 'CAN_MANAGE_APP',
                text: '应用管理员及以上'
            },
        ];
    },

    approvalPermissions(state, getters) {
        return [
            {
                type: 'CAN_MANAGE_GROUP',
                text: `${getters.groupDesignation}管理员及以上`
            },
            {
                type: 'CAN_MANAGE_APP',
                text: '应用管理员及以上'
            },
        ];
    },

    controlPermissions(state, getters) {
        return [
            {
                type: 'CAN_MANAGE_GROUP',
                text: `${getters.groupDesignation}管理员及以上`
            },
            {
                type: 'CAN_MANAGE_APP',
                text: '应用管理员及以上'
            },
        ];
    },

    qrPropertyTypes(state, getters) {
        return [
            {
                name: `${getters.instanceDesignation}ID`,
                value: "QR_ID"
            },

            {
                name: `${getters.instanceDesignation}名称`,
                value: "QR_NAME"
            },

            {
                name: `所在${getters.groupDesignation}`,
                value: "QR_GROUP_NAME"
            },

            {
                name: `${getters.customIdDesignation}`,
                value: "QR_CUSTOM_ID"
            },

            {
                name: `码牌编号`,
                value: "QR_PLATE_ID"
            },
            {
                name: '应用名称',
                value: "APP_NAME"
            },
            {
                name: '账户名称',
                value: "TENANT_NAME"
            },
        ]
    },

    allAttributeTypesMetadata(state, getters) {
        const attributes = getters.attributeTypesMetadataCatalog.map((p) => {
            return p.options;
        });

        return [].concat.apply([], attributes);
    },

    attributeTypeNameOf: (state, getters) => (type) => {
        return getters.allAttributeTypesMetadata.find(e => e.type === type).text;
    },

    plateSetting(state) {
        return state.app.setting.plateSetting;
    },

    plateConfig(state) {
        return state.app.setting.plateSetting.config;
    },

    isPlateControlFull(state, getters) {
        return getters.plateSetting.controls.length >= 10;
    },

    currentPlateControlId(state) {
        return state.currentPlateControlId;
    },

    currentPlateControlEditType(state) {
        return state.currentPlateControlEditType;
    },

    plateSettingEditPanelKey(state) {
        return state.plateSettingEditPanelKey;
    },

    currentPlateControl(state, getters) {
        let controlId = getters.currentPlateControlId;
        return getters.plateSetting.controls
            .find(e => e.id === controlId);
    },

    placeholderForPlateTextValue: (state, getters, rootState, rootGetters) => (textValue) => {
        switch (textValue.type) {
            case "FIXED_TEXT": {
                return textValue.text ? textValue.text : '';
            }

            case "QR_PROPERTY": {
                if (textValue.propertyType === 'APP_NAME') {
                    return getters.appName;
                }

                if (textValue.propertyType === 'TENANT_NAME') {
                    return rootGetters.tenantName;
                }

                return textValue.propertyType ? `{${(getters.qrPropertyTypes.find(type => {
                    return type.value === textValue.propertyType;
                }).name)}}` : '';
            }

            case "QR_ATTRIBUTE": {
                return textValue.attributeId ? `{${getters.attributeNameFor(textValue.attributeId)}}` : '';
            }
        }
    },

    plateTemplates(state) {
        return state.plateTemplates;
    },

    webhookEnabled(state) {
        return state.app.webhookEnabled;
    },

};

const actions = {
    [ACTIONS.UPDATE_MENU]({commit}, menu) {
        commit('updateMenu', menu);
    },

    [ACTIONS.UPDATE_APP_CONFIG]({commit}, config) {
        commit('updateAppConfig', config);
    },

    [ACTIONS.UPDATE_APP_CIRCULATION_SETTING]({commit}, setting) {
        commit('updateAppCirculationSetting', setting);
    },

    [ACTIONS.UPDATE_APP_TOP_BAR]({commit}, bar) {
        commit('updateAppTopBar', bar);
    },

    [ACTIONS.DELETE_CURRENT_PAGE]({commit, getters}) {
        if (getters.isCurrentHomePage) {
            return Promise.reject(new Error('不允许删除首页。'));
        }

        let thePageId = getters.currentPage.id;
        try {
            getters.checkAttributeRefOnPageDeletion(thePageId);
            getters.checkOperationMenuRefOnPageDeletion(thePageId);
            getters.checkMenuRefOnPageDeletion(thePageId);
            getters.checkPageAfterSubmitRefOnPageDeletion(thePageId);
            getters.checkCirculationRefOnPageDeletion(thePageId);
            getters.checkControlRefOnPageDeletion(thePageId);
        } catch (e) {
            return Promise.reject(e);
        }

        commit('deleteCurrentPage', {getters});
    },

    [ACTIONS.UPDATE_PAGE_SETTING]({commit, getters}, setting) {
        commit('updateAppSetting', {setting, getters});
    },

    [ACTIONS.UPDATE_SUBMIT_BUTTON]({commit, getters}, submitButton) {
        commit('updateSubmitButton', {submitButton, getters});
    },

    [ACTIONS.UPDATE_PAGE_HEADER]({commit, getters}, header) {
        commit('updatePageHeader', {header, getters});
    },

    [ACTIONS.UPDATE_CONTROL]({commit, getters}, control) {
        commit('updateControl', {control, getters});
    },

    [ACTIONS.UPDATE_PAGE_TITLE]({commit, getters}, title) {
        commit('updatePageTitle', {title: title, getters});
    },

    [ACTIONS.CLONE_CONTROL]({commit, getters}, control) {
        let cloneControl = controlFactory.cloneControl(control);
        commit('addControl', {control: cloneControl, getters});

        let payload = {currentEditType: 'CONTROL', currentControlId: cloneControl.id};
        commit('setCurrentControl', {payload, getters});
    },

    [ACTIONS.TOGGLE_TABLET_VIEW]({commit}, isTabletView) {
        commit('toggleTabletView', isTabletView);
    },

    [ACTIONS.ACTIVATE_PAGE_CONFIG]({commit, getters}) {
        commit('activatePageConfig', getters);
    },

    [ACTIONS.DELETE_CONTROL]({commit, getters}, controlId) {
        try {
            getters.checkAttributeRefOnControlDeletion(controlId);
            getters.checkControlRefOnControlDeletion(controlId);
        } catch (e) {
            return Promise.reject(e);
        }

        commit('deleteControl', {controlId, getters});

        if (getters.currentControlId === controlId) {
            commit('activatePageConfig', getters);
        }
    },

    [ACTIONS.MOVE_CONTROL_UP]({commit, getters}, controlId) {
        commit('moveControlUp', {controlId, getters});
    },

    [ACTIONS.MOVE_CONTROL_DOWN]({commit, getters}, controlId) {
        commit('moveControlDown', {controlId, getters});
    },

    [ACTIONS.SET_CURRENT_CONTROL]({commit, getters}, payload) {
        commit('setCurrentControl', {payload, getters});
    },

    [ACTIONS.SET_CURRENT_PAGE]({commit, state, getters}, pageId) {
        return new Promise((resolve, reject) => {
                let current = state.app.setting.pages
                    .find(e => e.id === pageId);

                if (current) {
                    commit('setCurrentPage', current);

                    if (!(current.id in state.pageStatus)) {
                        commit('activatePageConfig', getters);
                    }

                    resolve();
                } else {
                    reject();
                }
            }
        );
    },

    [ACTIONS.DRAG_CONTROLS]({commit, getters}, controls) {
        commit('dragControls', {controls, getters});
    },

    [ACTIONS.FETCH_UPDATABLE_APP]({commit}, appId) {
        commit("init");
        return appApi.fetchUpdatableApp(appId).then((response) => {
            commit("loadApp", response.data);
            return response.data;
        });
    },

    [ACTIONS.UPDATE_PAGES]({commit}, pages) {
        commit('updatePages', pages);
    },

    [ACTIONS.CREATE_PAGE]({commit, state}, name) {
        let page = pageFactory.createPage(name);
        commit('addPage', page);
        return page.id;
    },

    [ACTIONS.SAVE]({commit, state}) {
        return appApi.updateAppSetting(state.app.id, {
            setting: state.app.setting,
            version: state.app.version
        }).then((response) => {
            commit('markSave', response.data.updatedVersion);
        });
    },

    [ACTIONS.MARK_UN_SAVE]({commit}) {
        commit('markUnSave');
    },

    [ACTIONS.ADD_CONTROL]({commit, state, getters}, type) {
        let control = controlFactory[type]();
        commit('addControl', {control, getters});

        let payload = {currentEditType: 'CONTROL', currentControlId: control.id};
        commit('setCurrentControl', {payload, getters});
    },

    [ACTIONS.UPDATE_ATTRIBUTES]({commit}, attributes) {
        commit('updateAttributes', attributes);
    },

    [ACTIONS.ADD_ATTRIBUTE]({commit, getters}, attribute) {
        commit('addAttribute', attribute);
    },

    [ACTIONS.UPDATE_ATTRIBUTE]({commit, getters}, attribute) {
        commit('updateAttribute', {attribute, getters});
    },

    [ACTIONS.DELETE_ATTRIBUTE]({commit, getters}, attribute) {
        try {
            getters.checkControlRefOnAttributeDeletion(attribute.id);
            getters.checkPlateControlRefOnAttributeDeletion(attribute.id);
        } catch (e) {
            return Promise.reject(e);
        }

        commit('deleteAttribute', {attribute, getters});
    },

    [ACTIONS.UPDATE_OPERATION_MENUS]({commit}, menuItems) {
        commit('updateOperationMenus', menuItems);
    },

    [ACTIONS.ADD_OPERATION_MENU_ITEM]({commit, getters}, menuItem) {
        commit('addOperationMenuItem', menuItem);
    },

    [ACTIONS.UPDATE_OPERATION_MENU_ITEM]({commit, getters}, menuItem) {
        commit('updateOperationMenuItem', {menuItem, getters});
    },

    [ACTIONS.DELETE_OPERATION_MENU_ITEM]({commit, getters}, menuItem) {
        commit('deleteOperationMenuItem', {menuItem, getters});
    },

    [ACTIONS.APPLY_CONTROL_NAME_SETTING_TO]({commit, getters}, {sourceControl, isAllControls, isAllPages}) {
        commit('applyControlNameSettingTo', {sourceControl, isAllControls, isAllPages, getters});
    },

    [ACTIONS.APPLY_CONTROL_DESCRIPTION_STYLE_TO]({commit, getters}, {sourceControl, isAllControls, isAllPages}) {
        commit('applyControlDescriptionStyleTo', {sourceControl, isAllControls, isAllPages, getters});
    },

    [ACTIONS.APPLY_CONTROL_STYLE_TO]({commit, getters}, {sourceControl, isAllControls, isAllPages}) {
        commit('applyControlStyleTo', {sourceControl, isAllControls, isAllPages, getters});
    },

    [ACTIONS.APPLY_SUBMIT_BUTTON_STYLE_TO_ALL]({commit}, buttonStyle) {
        commit('applySubmitButtonStyleToAll', buttonStyle);
    },

    [ACTIONS.ADD_PLATE_CONTROL]({commit, state, getters}, type) {
        let control = plateControlFactory[type]();
        commit('addPlateControl', {control, getters});

        let payload = {currentEditType: 'PLATE_CONTROL', currentControlId: control.id};
        commit('setCurrentPlateControl', payload);
    },

    [ACTIONS.DRAG_PLATE_CONTROLS]({commit, getters}, controls) {
        commit('dragPlateControls', {controls, getters});
    },

    [ACTIONS.SET_CURRENT_PLATE_CONTROL]({commit, getters}, payload) {
        commit('setCurrentPlateControl', payload);
    },

    [ACTIONS.ACTIVATE_PLATE_CONFIG]({commit}) {
        commit('activatePlateConfig');
    },

    [ACTIONS.UPDATE_PLATE_CONFIG]({commit}, config) {
        commit('updatePlateConfig', config);
    },

    [ACTIONS.UPDATE_PLATE_CONTROL]({commit, getters}, control) {
        commit('updatePlateControl', {control, getters});
    },

    [ACTIONS.DELETE_PLATE_CONTROL]({commit, getters}, controlId) {
        commit('deletePlateControl', {controlId, getters});

        if (getters.currentPlateControlId === controlId) {
            commit('activatePlateConfig');
        }
    },

};

const mutations = {
    updateMenu(state, menu) {
        state.app.setting.menu = menu;
    },

    updateAppConfig(state, config) {
        state.app.setting.config = config;
    },

    updateAppCirculationSetting(state, setting) {
        state.app.setting.circulationStatusSetting = setting;
    },

    updateAppTopBar(state, bar) {
        state.app.setting.appTopBar = bar;
    },

    deleteCurrentPage(state, {getters}) {
        let toBeDeletedId = getters.currentPage.id;
        let pages = state.app.setting.pages;
        pages.splice(pages.findIndex(p => p.id === toBeDeletedId), 1);
        state.currentPageId = getters.homePage.id;
    },

    updateAppSetting(state, {setting, getters}) {
        getters.currentPage.setting = setting;
    },

    updateSubmitButton(state, {submitButton, getters}) {
        getters.currentPage.submitButton = submitButton;
    },

    updatePageHeader(state, {header, getters}) {
        getters.currentPage.header = header;
    },

    updateControl(state, {control, getters}) {
        let controls = getters.currentPage.controls;
        Vue.set(controls, controls.findIndex(e => e.id === control.id), control)
    },

    updatePageTitle(state, {title, getters}) {
        getters.currentPage.title = title;
    },

    toggleTabletView(state, isTabletView) {
        state.tabletView = isTabletView;
        localStorage.tabletView = isTabletView;
    },

    addControl(state, {control, getters}) {
        let currentPage = getters.currentPage;

        let pageId = currentPage.id;

        let currentControlId = state.pageStatus[pageId].currentControlId;

        let index = currentPage.controls.findIndex(i => i.id === currentControlId);

        if (index === -1) {
            currentPage.controls.push(control);

        } else {
            currentPage.controls.splice(index + 1, 0, control);
        }
    },

    updateAttributes(state, attributes) {
        state.app.setting.attributes = attributes;
    },

    addAttribute(state, attribute) {
        state.app.setting.attributes.push(attribute);
    },

    updateAttribute(state, {attribute, getters}) {
        let allAttributes = getters.allAttributes;
        Vue.set(allAttributes, allAttributes.findIndex(e => e.id === attribute.id), attribute)
    },

    deleteAttribute(state, {attribute, getters}) {
        let allAttributes = getters.allAttributes;
        allAttributes.splice(allAttributes.findIndex(i => i.id === attribute.id), 1);
    },

    updateOperationMenus(state, menuItems) {
        state.app.setting.operationMenuItems = menuItems;
    },

    addOperationMenuItem(state, menuItem) {
        state.app.setting.operationMenuItems.push(menuItem);
    },

    updateOperationMenuItem(state, {menuItem, getters}) {
        let allItems = getters.allOperationMenuItems;
        Vue.set(allItems, allItems.findIndex(e => e.id === menuItem.id), menuItem)
    },

    deleteOperationMenuItem(state, {menuItem, getters}) {
        let allItems = getters.allOperationMenuItems;
        allItems.splice(allItems.findIndex(i => i.id === menuItem.id), 1);
    },

    activatePageConfig(state, getters) {
        state.pageStatus = {
            ...state.pageStatus,
            [getters.currentPage.id]: {
                currentEditType: 'PAGE_SETTING',
                currentControlId: 'PAGE_SETTING'
            }
        }
    },

    moveControlUp(state, {controlId, getters}) {
        let controls = getters.currentPage.controls;
        let index = controls.findIndex(i => i.id === controlId);

        let rows = [controls[index - 1], controls[index]];
        controls.splice(index - 1, 2, rows[1], rows[0]);
    },

    moveControlDown(state, {controlId, getters}) {
        let controls = getters.currentPage.controls;
        let index = controls.findIndex(i => i.id === controlId);

        let rows = [controls[index], controls[index + 1]];
        controls.splice(index, 2, rows[1], rows[0]);
    },

    deleteControl(state, {controlId, getters}) {
        let controls = getters.currentPage.controls;
        controls.splice(controls.findIndex(i => i.id === controlId), 1);
    },

    setCurrentControl(state, {payload, getters}) {
        state.panelKey = uuid.generate();
        state.pageStatus = {
            ...state.pageStatus,
            [getters.currentPage.id]: payload
        }
    },

    dragControls(state, {controls, getters}) {
        getters.currentPage.controls = controls;
    },

    loadApp(state, value) {
        state.app = value;
        state.loaded = true;
        state.saved = true;
    },

    init(state) {
        state.loaded = false;
        state.currentPageId = null;
    },

    addPage(state, page) {
        state.app.setting.pages.push(page);
    },

    updatePages(state, pages) {
        state.app.setting.pages = pages;
    },

    markSave(state, updatedVersion) {
        state.app.version = updatedVersion;
        state.saved = true;
    },

    markUnSave(state) {
        state.saved = false;
    },

    setCurrentPage(state, page) {
        state.currentPageId = page.id;
    },

    applyControlNameSettingTo(state, {sourceControl, isAllControls, isAllPages, getters}) {
        if (isAllPages) {
            if (isAllControls) {
                getters.allPages.forEach(aPage => {
                    aPage.controls.filter(aControl => {
                        return aControl.id !== sourceControl.id
                            && aControl.type !== 'SECTION_TITLE';
                    }).forEach(aControl => {
                        aControl.nameSetting = cloneDeep(sourceControl.nameSetting);
                    });
                });
            } else {
                let isFillable = isControlFillable(sourceControl);
                getters.allPages.forEach(aPage => {
                    aPage.controls.filter(aControl => {
                        return aControl.id !== sourceControl.id
                            && aControl.type !== 'SECTION_TITLE'
                            && isControlFillable(aControl) === isFillable;
                    }).forEach(aControl => {
                        aControl.nameSetting = cloneDeep(sourceControl.nameSetting);
                    });
                });
            }
        } else {
            if (isAllControls) {
                getters.currentPage.controls.filter(aControl => {
                    return aControl.id !== sourceControl.id
                        && aControl.type !== 'SECTION_TITLE';
                }).forEach(aControl => {
                    aControl.nameSetting = cloneDeep(sourceControl.nameSetting);
                });
            } else {
                let isFillable = isControlFillable(sourceControl);
                getters.currentPage.controls.filter(aControl => {
                    return aControl.id !== sourceControl.id
                        && aControl.type !== 'SECTION_TITLE'
                        && isControlFillable(aControl) === isFillable;
                }).forEach(aControl => {
                    aControl.nameSetting = cloneDeep(sourceControl.nameSetting);
                });
            }
        }
    },

    applyControlDescriptionStyleTo(state, {sourceControl, isAllControls, isAllPages, getters}) {
        if (isAllPages) {
            if (isAllControls) {
                getters.allPages.forEach(aPage => {
                    aPage.controls.filter(aControl => {
                        return aControl.id !== sourceControl.id
                            && aControl.type !== 'SECTION_TITLE';
                    }).forEach(aControl => {
                        aControl.descriptionStyle = cloneDeep(sourceControl.descriptionStyle);
                    });
                });
            } else {
                let isFillable = isControlFillable(sourceControl);
                getters.allPages.forEach(aPage => {
                    aPage.controls.filter(aControl => {
                        return aControl.id !== sourceControl.id
                            && aControl.type !== 'SECTION_TITLE'
                            && isControlFillable(aControl) === isFillable;
                    }).forEach(aControl => {
                        aControl.descriptionStyle = cloneDeep(sourceControl.descriptionStyle);
                    });
                });
            }
        } else {
            if (isAllControls) {
                getters.currentPage.controls.filter(aControl => {
                    return aControl.id !== sourceControl.id
                        && aControl.type !== 'SECTION_TITLE';
                }).forEach(aControl => {
                    aControl.descriptionStyle = cloneDeep(sourceControl.descriptionStyle);
                });
            } else {
                let isFillable = isControlFillable(sourceControl);
                getters.currentPage.controls.filter(aControl => {
                    return aControl.id !== sourceControl.id
                        && aControl.type !== 'SECTION_TITLE'
                        && isControlFillable(aControl) === isFillable;
                }).forEach(aControl => {
                    aControl.descriptionStyle = cloneDeep(sourceControl.descriptionStyle);
                });
            }
        }
    },

    applyControlStyleTo(state, {sourceControl, isAllControls, isAllPages, getters}) {
        if (isAllPages) {
            if (isAllControls) {
                getters.allPages.forEach(aPage => {
                    aPage.controls.filter(aControl => {
                        return aControl.id !== sourceControl.id
                            && aControl.type !== 'SECTION_TITLE';
                    }).forEach(aControl => {
                        aControl.styleSetting = cloneDeep(sourceControl.styleSetting);
                    });
                });
            } else {
                let isFillable = isControlFillable(sourceControl);
                getters.allPages.forEach(aPage => {
                    aPage.controls.filter(aControl => {
                        return aControl.id !== sourceControl.id
                            && aControl.type !== 'SECTION_TITLE'
                            && isControlFillable(aControl) === isFillable;
                    }).forEach(aControl => {
                        aControl.styleSetting = cloneDeep(sourceControl.styleSetting);
                    });
                });
            }
        } else {
            if (isAllControls) {
                getters.currentPage.controls.filter(aControl => {
                    return aControl.id !== sourceControl.id
                        && aControl.type !== 'SECTION_TITLE';
                }).forEach(aControl => {
                    aControl.styleSetting = cloneDeep(sourceControl.styleSetting);
                });
            } else {
                let isFillable = isControlFillable(sourceControl);
                getters.currentPage.controls.filter(aControl => {
                    return aControl.id !== sourceControl.id
                        && aControl.type !== 'SECTION_TITLE'
                        && isControlFillable(aControl) === isFillable;
                }).forEach(aControl => {
                    aControl.styleSetting = cloneDeep(sourceControl.styleSetting);
                });
            }
        }
    },

    applySubmitButtonStyleToAll(state, buttonStyle) {
        state.app.setting.pages.forEach(page => {
            page.submitButton.buttonStyle = cloneDeep(buttonStyle);
        });
    },

    setCurrentPlateControl(state, payload) {
        state.plateSettingEditPanelKey = uuid.generate();
        state.currentPlateControlEditType = payload.currentEditType;
        state.currentPlateControlId = payload.currentControlId;
    },

    addPlateControl(state, {control, getters}) {
        let plateSetting = getters.plateSetting;
        let index = plateSetting.controls.findIndex(i => i.id === state.currentPlateControlId);

        if (index === -1) {
            plateSetting.controls.push(control);

        } else {
            plateSetting.controls.splice(index + 1, 0, control);
        }
    },

    dragPlateControls(state, {controls, getters}) {
        getters.plateSetting.controls = controls;
    },

    activatePlateConfig(state) {
        state.currentPlateControlId = 'PLATE_CONFIG';
        state.currentPlateControlEditType = 'PLATE_CONFIG';
    },

    updatePlateConfig(state, config) {
        state.app.setting.plateSetting.config = config;
    },

    updatePlateControl(state, {control, getters}) {
        let controls = getters.plateSetting.controls;
        Vue.set(controls, controls.findIndex(e => e.id === control.id), control)
    },

    deletePlateControl(state, {controlId, getters}) {
        let controls = getters.plateSetting.controls;
        controls.splice(controls.findIndex(i => i.id === controlId), 1);
    },

    applyPlateTemplate(state, template) {
        state.app.setting.plateSetting = template.plateSetting;
    },

    setPlateTemplates(state, templates) {
        state.plateTemplates = templates;
    },

    deletePlateTemplate(state, template) {
        state.plateTemplates.splice(state.plateTemplates.findIndex(i => i.id === template.id), 1);
    }

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}