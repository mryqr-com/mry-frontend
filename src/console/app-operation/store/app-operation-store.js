import appApi from '@/common/api/app-api';
import ACTIONS from '@/console/app-operation/store/app-operation-actions';
import controlTypes from '@/common/utils/control-types';
import {cloneDeep} from 'lodash-es';
import {
    appGroupDesignation,
    appInstanceDesignation,
    controlFieldName,
    isAttributeValueCategorized,
    isAttributeValueNumbered,
    isControlAnswerCategorized,
    isControlAnswerNumbered,
    operationMenuName,
    pageName,
    pageSubmitAtDesignation,
    pageSubmitterDesignation,
    qrCustomIdDesignation,
    qrUrl
} from "@/common/utils/common-utils";
import Vue from "vue";

function pageHiddenFieldsKey(appId) {
    return "pageHiddenFields_" + appId;
}

function appHiddenAttributesKey(appId) {
    return "qrHiddenAttributes_" + appId;
}

const state = {
    currentApp: null,//当前运营的app
    groupDirty: false,//group已经乱了，意味着currentApp需要重新获取
    groupNamesMap: new Map(),//groupId -> groupName,用于显示提交的group名称
    allPageReferences: null,//用于显示页面选择列表
    groupReferences: [],//所有所返回的分组引用
    pagesMap: new Map(),//用于快速查询一个page，pageId -> page
    controlsMap: new Map(),//用于快速查询一个control，controlId -> control, controlId在应用下全局唯一，因此无需考虑pageId
    attributesMap: new Map(),
    pageHiddenFieldIdsMap: new Map(),
    appHiddenAttributeIds: [],//数组，包含隐藏的属性项ID
    currentQrSrc: null,//进入单个qr页面时，保存下来以便打开
    currentQrName: null,
};

const getters = {
    //当前appId
    currentAppId(state) {
        return state.currentApp.id;
    },

    //当前app名称
    currentAppName(state) {
        return state.currentApp.name;
    },

    //当前app图标
    currentAppIcon(state) {
        return state.currentApp.icon;
    },

    isCurrentAppLocked(state) {
        return state.currentApp.locked;
    },

    instanceDesignation(state) {
        return appInstanceDesignation(state.currentApp.setting);
    },

    groupDesignation(state) {
        return appGroupDesignation(state.currentApp.setting);
    },

    customIdDesignation(state) {
        return qrCustomIdDesignation(state.currentApp.setting);
    },

    submitterDesignationOf: (state) => (pageId) => {
        let page = state.pagesMap.get(pageId);
        return pageSubmitterDesignation(page);
    },

    submitAtDesignationOf: (state) => (pageId) => {
        let page = state.pagesMap.get(pageId);
        return pageSubmitAtDesignation(page);
    },

    //当前app homePageId
    currentAppHomePageId(state) {
        return state.currentApp.setting.config.homePageId;
    },

    appSetting(state) {
        return state.currentApp.setting;
    },

    reportSetting(state) {
        return state.currentApp.reportSetting;
    },

    currentAppNumberReportSetting(state) {
        return state.currentApp.reportSetting.numberReportSetting;
    },

    currentAppChartReportSetting(state) {
        return state.currentApp.reportSetting.chartReportSetting;
    },

    hasReports(state, getters) {
        return getters.currentAppNumberReportSetting.reports.length > 0 || getters.currentAppChartReportSetting.reports.length > 0;
    },

    //当前用户是否可以管理当前app
    canManageCurrentApp(state) {
        return state.currentApp.canManageApp;
    },

    //当前app是否启用了定位
    currentAppGeolocationEnabled(state) {
        return state.currentApp.setting.config.geolocationEnabled;
    },

    //当前app是否启用了批量码牌功能
    currentAppPlateBatchEnabled(state) {
        return state.currentApp.setting.config.plateBatchEnabled;
    },

    //当前app是否启用了用户手册功能
    currentAppManualEnabled(state) {
        return state.currentApp.setting.config.appManualEnabled;
    },

    //当前app是否启用了任务管理功能
    currentAppAssignmentEnabled() {
        return state.currentApp.setting.config.assignmentEnabled;
    },

    //当前app的着陆页类型
    currentAppLandingPageType() {
        return state.currentApp.setting.config.landingPageType;
    },

    //提示首页的所有页面
    homePageExplicitAllPageReferences(state, getters) {
        return state.allPageReferences.map(page => {
            let name = page.name;
            if (page.id === getters.currentAppHomePageId) {
                name = `${name}（首页）`
            }
            return {
                id: page.id,
                name: name,
            };
        });
    },

    //所有出现的group的引用
    groupReferences(state) {
        return state.groupReferences;
    },

    //所有页面的引用
    allPageReferences(state) {
        return state.allPageReferences;
    },

    //当前app下，所有我能看到的group ID
    viewableGroupIds(state) {
        return state.currentApp.viewableGroupIds;
    },

    //当前app下，所有我能看到的group
    viewableGroups(state, getters) {
        return getters.groupReferences.filter(group => {
            return getters.viewableGroupIds.includes(group.id);
        });
    },

    //当前app下，所有我能选择的group，包含"全部"选项
    allableViewableGroups(state, getters) {
        if (getters.viewableGroups.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.viewableGroups]
    },

    //当前app下，所有我能查看页面ID
    viewablePageIds(state) {
        return state.currentApp.viewablePageIds;
    },

    //当前app下，所有我能看到的可填页面
    viewablePages(state, getters) {
        return state.allPageReferences.filter(page => {
            return getters.viewablePageIds.includes(page.id);
        });
    },

    //当前app下，所有我能看到的可填页面（包含"全部"选项）
    allableViewablePages(state, getters) {
        if (getters.viewablePages.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.viewablePages]
    },

    //当前app下，所有我能管理的group ID
    managableGroupIds(state) {
        return state.currentApp.managableGroupIds;
    },

    //当前app下，所有我能管理的group
    managableGroups(state, getters) {
        return getters.groupReferences.filter(group => {
            return getters.managableGroupIds.includes(group.id);
        });
    },

    //当前app下，所有我能管理的group，包含"全部"选项
    allableManagableGroups(state, getters) {
        if (getters.managableGroups.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.managableGroups]
    },

    //检查当前用户是否存在可管理的组
    hasManagableGroups(state, getters) {
        return getters.managableGroupIds.length > 0;
    },

    //当前app下，所有我能管理的可填页面ID
    managablePageIds(state) {
        return state.currentApp.managablePageIds;
    },

    //当前app下，所有我能管理的可填页面
    managablePages(state, getters) {
        return state.allPageReferences.filter(page => {
            return getters.managablePageIds.includes(page.id);
        });
    },

    //当前app下，所有我能管理的可填页面（包含"全部"选项）
    allableManagablePages(state, getters) {
        if (getters.managablePageIds.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.managablePages]
    },

    //当前app下，所有我能审批的group ID
    approvableGroupIds(state) {
        return state.currentApp.approvableGroupIds;
    },

    //当前app下，所有我能审批的group
    approvableGroups(state, getters) {
        return getters.groupReferences.filter(group => {
            return getters.approvableGroupIds.includes(group.id);
        });
    },

    //当前app下，所有我能审批的group，包含"全部"选项
    allableApprovableGroups(state, getters) {
        if (getters.approvableGroups.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.approvableGroups]
    },

    //当前app下，所有我能审批的页面ID
    approvablePageIds(state) {
        return state.currentApp.approvablePageIds;
    },

    //当前app下，所有我能审批的页面
    approvablePages(state, getters) {
        return state.allPageReferences.filter(page => {
            return getters.approvablePageIds.includes(page.id);
        });
    },

    //当前app下，所有我能审批的页面(包含"全部"选项)
    allableApprovablePages(state, getters) {
        if (getters.approvablePages.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.approvablePages]
    },

    //page是否启用审批
    isPageApproveEnabled: (state) => (pageId) => {
        if (pageId === 'ALL') {
            return false;
        }
        return state.pagesMap.get(pageId).setting.approvalSetting.approvalEnabled;
    },

    //当前用户是否可以管理某个qr
    canManageQr: (state, getters) => (qr) => {
        return getters.canManageGroup(qr.groupId);
    },

    //当前用户是否可以管理某个group
    canManageGroup: (state, getters) => (groupId) => {
        return getters.managableGroupIds.includes(groupId);
    },

    //所有当前可见的运营菜单
    allViewableAppOperationMenuItems(state, getters) {
        const menuItems = state.currentApp.setting.operationMenuItems;
        let validMenuItems = menuItems.filter(item => {
            switch (item.type) {
                case 'ALL_SUBMIT_HISTORY': {
                    return getters.managableGroupIds.length > 0 &&
                        getters.managablePageIds.length > 0 &&
                        (item.pageId === 'ALL' || getters.managablePageIds.includes(item.pageId));
                }
                case 'SUBMITTER_SUBMISSION': {
                    return getters.viewableGroupIds.length > 0 &&
                        getters.viewablePageIds.length > 0 &&
                        (item.pageId === 'ALL' || getters.viewablePageIds.includes(item.pageId));
                }
                case 'TO_BE_APPROVED': {
                    return getters.approvableGroupIds.length > 0 &&
                        getters.approvablePageIds.length > 0 &&
                        (item.pageId === 'ALL' || getters.approvablePageIds.includes(item.pageId));
                }
            }
        });
        validMenuItems.forEach(item => {
            switch (item.type) {
                case 'ALL_SUBMIT_HISTORY': {
                    item.icon = 'history';
                    break;
                }
                case 'SUBMITTER_SUBMISSION': {
                    item.icon = 'user-check';
                    break;
                }
                case 'TO_BE_APPROVED': {
                    item.icon = 'check-square';
                    break;
                }
            }
        });
        return validMenuItems;
    },

    //根据type和pageId反查菜单名称
    operationMenuNameOf: (state) => (type, pageId) => {
        return operationMenuName(state.currentApp.setting, type, pageId);
    },

    //根据pageId查page名称
    pageNameOf: (state) => (pageId) => {
        let page = state.pagesMap.get(pageId);
        return pageName(page);
    },

    //根据groupId查group名称
    groupNameOf: (state) => (groupId) => {
        return state.groupNamesMap.get(groupId);
    },

    //审批页面的过滤条件
    approvalFiltersForPage: (state, getters) => (pageId) => {
        if (!getters.isPageApproveEnabled(pageId)) {
            return null;
        }
        let page = state.pagesMap.get(pageId);
        let passText = page.setting.approvalSetting.passText;
        let notPassText = page.setting.approvalSetting.notPassText;
        return [{text: passText, value: 'YES'}, {text: notPassText, value: 'NO'}, {text: '未审批', value: 'NONE'}];
    },

    //审批通过显示文本
    approvalPassedText: (state) => (pageId) => {
        return state.pagesMap.get(pageId).setting.approvalSetting.passText;
    },

    //审批不通过显示文本
    approvalNotPassedText: (state) => (pageId) => {
        return state.pagesMap.get(pageId).setting.approvalSetting.notPassText;
    },

    //某个page上的所有可填控件
    allFillableControlsOnPage: (state) => (pageId) => {
        return state.pagesMap.get(pageId).controls.filter(control => {
            return controlTypes[control.type].fillable;
        });
    },

    //某个页面可显示的字段，包括控件以及若干固定字段
    allSelectableFieldOptionsOnPage: (state, getters) => (pageId, type) => {
        let options;

        if (pageId === 'ALL') {
            options = [];
        } else {
            options = getters.allFillableControlsOnPage(pageId)
                .filter(control => {
                    if (getters.canManageCurrentApp) {
                        return true;
                    }

                    if (type === 'ALL_SUBMIT_HISTORY' || type === 'TO_BE_APPROVED') {
                        return true;
                    }

                    if (control.permissionEnabled) {
                        return control.submitterViewable;
                    }

                    return true;
                })
                .map(control => {
                    return {id: control.id, name: controlFieldName(control)};
                });
        }

        options.push({id: 'createdAt', name: getters.submitAtDesignationOf(pageId)});
        options.push({id: 'createdBy', name: getters.submitterDesignationOf(pageId)});
        options.push({id: 'group', name: getters.groupDesignation});
        options.push({id: 'page', name: '表单'});

        if (getters.isPageApproveEnabled(pageId)) {
            options.push({id: 'approval', name: '审批状态'});
        }

        return options;
    },

    //根据controlId查control
    controlOf: (state) => (controlId) => {
        return state.controlsMap.get(controlId);
    },

    attributeOf: (state) => (attributeId) => {
        return state.attributesMap.get(attributeId);
    },

    //某个page中被隐藏的字段
    hiddenFieldIdsOfPage: (state) => (pageId) => {
        let result = state.pageHiddenFieldIdsMap.get(pageId);
        return result ? result : [];
    },

    //当前app所有摘要属性
    allEligibleAttributes(state) {
        return state.currentApp.setting.attributes.filter(attr => {
            return attr.pcListEligible;
        });
    },

    //当前app所有摘要属性ID
    allEligibleAttributeIds(state, getters) {
        return getters.allEligibleAttributes.map(attr => attr.id);
    },

    allAnswerNumberedControlsOfPage: (state) => (pageId) => {
        if (!pageId) {
            return [];
        }

        let thePage = state.pagesMap.get(pageId);
        return thePage.controls.filter((control) => isControlAnswerNumbered(control));
    },

    allAnswerCategorizedControlsOfPage: (state) => (pageId) => {
        if (!pageId) {
            return [];
        }

        let thePage = state.pagesMap.get(pageId);
        return thePage.controls.filter((control) => isControlAnswerCategorized(control));
    },

    allDateControlsOfPage: (state) => (pageId) => {
        if (!pageId) {
            return [];
        }

        let thePage = state.pagesMap.get(pageId);
        return thePage.controls.filter((control) => control.type === 'DATE');
    },

    allNumberedAttributes(state) {
        return state.currentApp.setting.attributes.filter(attr => isAttributeValueNumbered(attr));
    },

    allCategorizedAttributes(state) {
        return state.currentApp.setting.attributes.filter(attr => isAttributeValueCategorized(attr));
    },

    allDateableAttributes(state) {
        return state.currentApp.setting.attributes.filter(attr => {
            return attr.valueType === 'LOCAL_DATE_VALUE' || attr.valueType === 'TIMESTAMP_VALUE';
        });
    },

    plateSetting(state) {
        return state.currentApp.setting.plateSetting;
    },

    hasCirculationStatuses(state) {
        return state.currentApp.setting.circulationStatusSetting.options.length > 0;
    },

    allCirculationStatuses(state) {
        return state.currentApp.setting.circulationStatusSetting.options;
    },
};

const actions = {
    [ACTIONS.FETCH_OPERATION_APP]({commit, getters}, appId) {
        return appApi.fetchOperationApp(appId, {showLoading: false}).then((response) => {
            commit("loadCurrentApp", response.data);
        });
    },
};

const mutations = {
    markGroupAsDirty(state) {
        state.groupDirty = true;
    },

    loadCurrentApp(state, value) {
        state.currentApp = value;
        state.groupDirty = false;
        state.groupNamesMap = new Map(Object.entries(value.groupFullNames));
        let groupReferences = Array.from(state.groupNamesMap, ([name, value]) => ({id: name, name: value}));
        groupReferences.sort((o1, o2) => o1.name.localeCompare(o2.name, 'zh-CN'));
        state.groupReferences = groupReferences;
        value.setting.attributes.forEach(attribute => {
            state.attributesMap.set(attribute.id, attribute);
        });

        state.allPageReferences = value.setting.pages.map(page => {
            return {
                id: page.id,
                name: pageName(page),
            };
        });
        state.pagesMap = new Map(state.currentApp.setting.pages.map(it => [it.id, it]));
        let controlsMap = new Map();
        state.currentApp.setting.pages.forEach(page => {
            page.controls.forEach(control => {
                controlsMap.set(control.id, control);
            });
        });
        state.controlsMap = controlsMap;

        let hiddenFieldIds = sessionStorage.getItem(pageHiddenFieldsKey(state.currentApp.id));
        if (hiddenFieldIds) {
            state.pageHiddenFieldIdsMap = new Map(JSON.parse(hiddenFieldIds));
        }

        let hiddenAttributeIds = sessionStorage.getItem(appHiddenAttributesKey(state.currentApp.id));
        if (hiddenAttributeIds) {
            state.appHiddenAttributeIds = JSON.parse(hiddenAttributeIds);
        }
    },

    updateHiddenFieldIdsForPage(state, payload) {
        state.pageHiddenFieldIdsMap.set(payload.pageId, payload.filedIds);
        state.pageHiddenFieldIdsMap = cloneDeep(state.pageHiddenFieldIdsMap);//只有赋值才能使vue具有reactivity
        sessionStorage.setItem(pageHiddenFieldsKey(state.currentApp.id), JSON.stringify(Array.from(state.pageHiddenFieldIdsMap.entries())));
    },

    updateHiddenAttributeIds(state, ids) {
        state.appHiddenAttributeIds = ids;
        sessionStorage.setItem(appHiddenAttributesKey(state.currentApp.id), JSON.stringify(ids));
    },

    updateCurrentQr(state, qrSummary) {
        state.currentQrSrc = qrUrl(qrSummary.plateId) + '?hideTopBar=true';
        state.currentQrName = qrSummary.name;
    },

    addNumberReport(state, report) {
        state.currentApp.reportSetting.numberReportSetting.reports.unshift(report);
    },

    updateNumberReport(state, report) {
        let reports = state.currentApp.reportSetting.numberReportSetting.reports;
        Vue.set(reports, reports.findIndex(e => e.id === report.id), report);
    },

    deleteNumberReport(state, reportId) {
        let reports = state.currentApp.reportSetting.numberReportSetting.reports;
        reports.splice(reports.findIndex(i => i.id === reportId), 1);
    },

    moveNumberReportForward(state, reportId) {
        let reports = state.currentApp.reportSetting.numberReportSetting.reports;
        let index = reports.findIndex(i => i.id === reportId);
        let rows = [reports[index - 1], reports[index]];
        reports.splice(index - 1, 2, rows[1], rows[0]);
    },

    moveNumberReportBackward(state, reportId) {
        let reports = state.currentApp.reportSetting.numberReportSetting.reports;
        let index = reports.findIndex(i => i.id === reportId);
        let rows = [reports[index], reports[index + 1]];
        reports.splice(index, 2, rows[1], rows[0]);
    },

    updateNumberReportConfiguration(state, configuration) {
        state.currentApp.reportSetting.numberReportSetting.configuration = configuration;
    },

    addChartReport(state, report) {
        state.currentApp.reportSetting.chartReportSetting.reports.unshift(report);
    },

    updateChartReport(state, report) {
        let reports = state.currentApp.reportSetting.chartReportSetting.reports;
        Vue.set(reports, reports.findIndex(e => e.id === report.id), report);
    },

    deleteChartReport(state, reportId) {
        let reports = state.currentApp.reportSetting.chartReportSetting.reports;
        reports.splice(reports.findIndex(i => i.id === reportId), 1);
    },

    moveChartReportForward(state, reportId) {
        let reports = state.currentApp.reportSetting.chartReportSetting.reports;
        let index = reports.findIndex(i => i.id === reportId);
        let rows = [reports[index - 1], reports[index]];
        reports.splice(index - 1, 2, rows[1], rows[0]);
    },

    moveChartReportBackward(state, reportId) {
        let reports = state.currentApp.reportSetting.chartReportSetting.reports;
        let index = reports.findIndex(i => i.id === reportId);
        let rows = [reports[index], reports[index + 1]];
        reports.splice(index, 2, rows[1], rows[0]);
    },

    updateChartReportConfiguration(state, configuration) {
        state.currentApp.reportSetting.chartReportSetting.configuration = configuration;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}