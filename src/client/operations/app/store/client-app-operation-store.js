import appApi from '@/common/api/app-api';
import ACTIONS from '@/client/operations/app/store/client-app-operation-actions';
import controlTypes from '@/common/utils/control-types';
import kanbanValueTypes from '@/common/utils/kanban-value-types';
import {
    appGroupDesignation,
    appInstanceDesignation,
    isAttributeValueSortable,
    isControlAnswerSortable,
    operationMenuName,
    pageActionName,
    pageName,
    pageSubmitAtDesignation,
    pageSubmitterDesignation
} from "@/common/utils/common-utils";

const state = {
    app: null,//当前app
    allPageReferences: null,//所有分组列表
    groupReferences: [],//所有所返回的分组引用
    groupNamesMap: null,//groupId -> groupName,用于快速查询group名称
    attributesMap: null, //attributeId -> attribute
    pagesMap: null,//用于快速查询一个page，pageId -> page
    controlsMap: null,//用于快速查询一个control，controlId -> control, controlId在应用下全局唯一，因此无需考虑pageId
    kanbanDataCache: new Map(),//状态看板数据缓存
};

const getters = {
    appId(state) {
        return state.app.id;
    },

    appName(state) {
        return state.app.name;
    },

    appIcon(state) {
        return state.app.icon;
    },

    instanceDesignation(state) {
        return appInstanceDesignation(state.app.setting);
    },

    groupDesignation(state) {
        return appGroupDesignation(state.app.setting);
    },

    submitterDesignationOf: (state) => (pageId) => {
        let page = state.pagesMap.get(pageId);
        return pageSubmitterDesignation(page);
    },

    submitAtDesignationOf: (state) => (pageId) => {
        let page = state.pagesMap.get(pageId);
        return pageSubmitAtDesignation(page);
    },

    appHomePageId(state) {
        return state.app.setting.config.homePageId;
    },

    appSetting(state) {
        return state.app.setting;
    },

    canManageApp(state) {
        return state.app.canManageApp;
    },

    isAppGeolocationEnabled(state) {
        return state.app.setting.config.geolocationEnabled;
    },

    isAppManualEnabled(state) {
        return state.app.setting.config.appManualEnabled;
    },

    isAppAssignmentEnabled(state) {
        return state.app.setting.config.assignmentEnabled;
    },

    appLandingPageType(state) {
        return state.app.setting.config.landingPageType;
    },

    isAppGroupSynced(state) {
        return state.app.groupSynced;
    },

    homePageExplicitAllPageReferences(state, getters) {
        return state.allPageReferences.map(page => {
            let name = page.name;
            if (page.id === getters.appHomePageId) {
                name = `${name}（首页）`
            }
            return {
                id: page.id,
                name: name,
            };
        });
    },

    groupReferences(state) {
        return state.groupReferences;
    },

    viewableGroupIds(state) {
        return state.app.viewableGroupIds;
    },

    hasViewableGroups(state, getters) {
        return getters.viewableGroupIds.length > 0;
    },

    viewableGroups(state, getters) {
        return getters.groupReferences.filter(group => {
            return getters.viewableGroupIds.includes(group.id);
        });
    },

    allableViewableGroups(state, getters) {
        if (getters.viewableGroups.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.viewableGroups]
    },

    viewablePageIds(state) {
        return state.app.viewablePageIds;
    },

    viewablePages(state, getters) {
        return state.allPageReferences.filter(page => {
            return getters.viewablePageIds.includes(page.id);
        });
    },

    allableViewablePages(state, getters) {
        if (getters.viewablePages.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.viewablePages]
    },

    managableGroupIds(state) {
        return state.app.managableGroupIds;
    },

    managableGroups(state, getters) {
        return getters.groupReferences.filter(group => {
            return getters.managableGroupIds.includes(group.id);
        });
    },

    allableManagableGroups(state, getters) {
        if (getters.managableGroups.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.managableGroups]
    },

    hasManagableGroups(state, getters) {
        return getters.managableGroupIds.length > 0;
    },

    managablePageIds(state) {
        return state.app.managablePageIds;
    },

    managablePages(state, getters) {
        return state.allPageReferences.filter(page => {
            return getters.managablePageIds.includes(page.id);
        });
    },

    allableManagablePages(state, getters) {
        if (getters.managablePages.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.managablePages]
    },

    approvableGroupIds(state) {
        return state.app.approvableGroupIds;
    },

    approvableGroups(state, getters) {
        return getters.groupReferences.filter(group => {
            return getters.approvableGroupIds.includes(group.id);
        });
    },

    allableApprovableGroups(state, getters) {
        if (getters.approvableGroups.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.approvableGroups]
    },

    approvablePageIds(state) {
        return state.app.approvablePageIds;
    },

    approvablePages(state, getters) {
        return state.allPageReferences.filter(page => {
            return getters.approvablePageIds.includes(page.id);
        });
    },

    allableApprovablePages(state, getters) {
        if (getters.approvablePages.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.approvablePages]
    },

    isPageApproveEnabled: (state) => (pageId) => {
        if (pageId === 'ALL') {
            return false;
        }
        return state.pagesMap.get(pageId).setting.approvalSetting.approvalEnabled;
    },

    approvalFiltersForPage: (state, getters) => (pageId) => {
        if (!getters.isPageApproveEnabled(pageId)) {
            return [];
        }

        let page = state.app.setting.pages.find(page => page.id === pageId);
        let passText = page.setting.approvalSetting.passText;
        let notPassText = page.setting.approvalSetting.notPassText;
        return [{text: passText, value: 'YES'}, {text: notPassText, value: 'NO'}, {text: '未审批', value: 'NONE'}];
    },

    canManageQr: (state, getters) => (qr) => {
        return getters.canManageGroup(qr.groupId);
    },

    canManageGroup: (state, getters) => (groupId) => {
        return getters.managableGroupIds.includes(groupId);
    },

    allViewableAppOperationMenuItems(state, getters) {
        const menuItems = state.app.setting.operationMenuItems;
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
                    item.icon = 'i-time-circle';
                    break;
                }
                case 'SUBMITTER_SUBMISSION': {
                    item.icon = 'i-filedone';
                    break;
                }
                case 'TO_BE_APPROVED': {
                    item.icon = 'i-check-square';
                    break;
                }
            }
        });
        return validMenuItems;
    },

    operationMenuNameOf: (state) => (type, pageId) => {
        return operationMenuName(state.app.setting, type, pageId);
    },

    pageNameOf: (state) => (pageId) => {
        let page = state.pagesMap.get(pageId);
        return pageName(page);
    },

    pageActionNameOf: (state) => (pageId) => {
        let page = state.pagesMap.get(pageId);
        return pageActionName(page);
    },

    groupNameOf: (state) => (groupId) => {
        return state.groupNamesMap.get(groupId);
    },

    allFillableControlsOnPage: (state) => (pageId) => {
        return state.pagesMap.get(pageId).controls.filter(control => {
            return controlTypes[control.type].fillable;
        });
    },

    submissionSummaryEligibleControlsOfPage: (state, getters) => (pageId) => {
        return getters.allFillableControlsOnPage(pageId).filter(control => {
            return control.fillableSetting && control.fillableSetting.submissionSummaryEligible;
        });
    },

    canViewAnswerForControl: (state, getters) => (control, operationMenuType) => {
        if (getters.canManageApp) {
            return true;
        }

        if (operationMenuType === 'ALL_SUBMIT_HISTORY' || operationMenuType === 'TO_BE_APPROVED') {
            return true;//能到此处表示至少是group管理员，group管理员可以看到所有answer，哪怕无填写权限
        }

        if (control.permissionEnabled) {
            return control.submitterViewable;
        }

        return true;
    },

    answerViewableControlsOfPage: (state, getters) => (pageId, operationMenuType) => {
        return getters.submissionSummaryEligibleControlsOfPage(pageId).filter(control => {
            return getters.canViewAnswerForControl(control, operationMenuType);
        });
    },

    answerConfigurableControlsOfPage: (state, getters) => (pageId, operationMenuType) => {
        return getters.allFillableControlsOnPage(pageId).filter(control => {
            return getters.canViewAnswerForControl(control, operationMenuType);
        });
    },

    allAnswerSortableControlsOfPage: (state, getters) => (pageId, type) => {
        return getters.answerConfigurableControlsOfPage(pageId, type)
            .filter(control => isControlAnswerSortable(control));
    },

    allAnswerFilterableControlsOfPage: (state, getters) => (pageId, type) => {
        //采用白名单方式，之后可以考虑value-types.js中的filterable
        return getters.answerConfigurableControlsOfPage(pageId, type).filter(control => {
            return [
                'CHECKBOX',
                'RADIO',
                'DROPDOWN',
                'MEMBER_SELECT',
                'ITEM_STATUS',
                'POINT_CHECK',
            ].includes(control.type);
        });
    },

    controlOf: (state) => (controlId) => {
        return state.controlsMap.get(controlId);
    },

    allEligibleAttributes(state) {
        return state.app.setting.attributes.filter(attr => {
            return attr.mobileListEligible;
        });
    },

    allSortableAttributes(state) {
        return state.app.setting.attributes.filter(attr => isAttributeValueSortable(attr));
    },

    allFilterableAttributes(state) {
        //采用白名单方式
        return state.app.setting.attributes.filter(attr => [
            'POINT_CHECK_VALUE',
            'RADIO_VALUE',
            'CHECKBOX_VALUE',
            'BOOLEAN_VALUE',
            'DROPDOWN_VALUE',
            'ITEM_STATUS_VALUE',
            'MEMBER_VALUE',
            'MEMBER_MOBILE_VALUE',
            'MEMBER_EMAIL_VALUE',
            'MEMBERS_VALUE',
            'MEMBERS_MOBILE_VALUE',
            'MEMBERS_EMAIL_VALUE',
            'CIRCULATION_STATUS_VALUE'
        ].includes(attr.valueType));
    },

    allKanbanAttributes(state) {
        return state.app.setting.attributes.filter(attr => {
            return kanbanValueTypes.includes(attr.valueType) && attr.kanbanEligible;
        });
    },

    numberReportSetting(state) {
        return state.app.reportSetting.numberReportSetting;
    },

    chartReportSetting(state) {
        return state.app.reportSetting.chartReportSetting;
    },

    hasReports(state, getters) {
        return getters.numberReportSetting.reports.length > 0 || getters.chartReportSetting.reports.length > 0;
    },

    plateSetting(state) {
        return state.app.setting.plateSetting;
    },

    fetchCachedKanbanDataByKey: (state) => (key) => {
        return state.kanbanDataCache.get(key);
    },
};

const actions = {
    [ACTIONS.FETCH_OPERATION_APP]({commit, getters}, appId) {
        return appApi.fetchOperationApp(appId).then((response) => {
            commit("loadApp", response.data);
        });
    },

};

const mutations = {
    loadApp(state, operationApp) {
        state.app = operationApp;
        state.groupNamesMap = new Map(Object.entries(operationApp.groupFullNames));
        let groupReferences = Array.from(state.groupNamesMap, ([name, value]) => ({id: name, name: value}));
        groupReferences.sort((o1, o2) => o1.name.localeCompare(o2.name, 'zh-CN'));
        state.groupReferences = groupReferences;
        state.attributesMap = new Map(operationApp.setting.attributes.map(it => [it.id, it]));

        state.allPageReferences = operationApp.setting.pages.map(page => {
            return {
                id: page.id,
                name: pageName(page),
            };
        });
        state.pagesMap = new Map(state.app.setting.pages.map(it => [it.id, it]));
        let controlsMap = new Map();
        state.app.setting.pages.forEach(page => {
            page.controls.forEach(control => {
                controlsMap.set(control.id, control);
            });
        });
        state.controlsMap = controlsMap;
    },

    renameGroup(state, {groupId, name}) {
        state.groupReferences.find(t => t.id === groupId).name = name;
        state.groupNamesMap = new Map(state.groupReferences.map(it => [it.id, it.name]));
    },

    loadKanbanDataCache(state, {key, data}) {
        state.kanbanDataCache.set(key, data);
    },

    clearKanbanDataCache(state) {
        state.kanbanDataCache = new Map();
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}