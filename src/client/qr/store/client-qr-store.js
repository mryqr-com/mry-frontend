import ACTIONS from '@/client/qr/store/client-qr-actions'
import qrApi from '@/common/api/qr-api';
import controlTypes from '@/common/utils/control-types';
import {cloneDeep} from 'lodash-es';
import {
    appInstanceDesignation,
    isControlAnswerSortable,
    operationMenuName,
    pageActionName,
    pageName,
    pageSubmitAtDesignation,
    pageSubmitterDesignation,
    qrCustomIdDesignation,
} from "@/common/utils/common-utils";

const state = {
    qr: null,
    app: null,
    permissions: null,
    canViewFillablePageIds: [],
    canManageFillablePageIds: [],
    canApproveFillablePageIds: [],
    canOperateApp: false,
    homePageId: null,
    currentPageId: null,
    pagesMap: new Map(),
    controlsMap: new Map(),
    attributesMap: new Map(),

    //profile信息
    memberId: null,
    memberTenantId: null,
    memberName: null,
    memberAvatar: null,
    tenantId: null,
    tenantName: null,
    tenantLogo: null,
    subdomainPrefix: null,
    subdomainReady: false,
    shouldHideBottomMryLogo: false,
    videoAudioAllowed: false,

    mode: null,
    submission: null,
    hideTopBar: false,//主要用于console端的QR运营也打开QR的情况
    referenceData: null,
};

const getters = {
    memberId(state) {
        return state.memberId;
    },

    memberName(state) {
        return state.memberName;
    },

    memberAvatar(state) {
        return state.memberAvatar;
    },

    tenantId(state) {
        return state.tenantId;
    },

    isLoggedIn(state) {
        return !!state.memberId;
    },

    isMemberBelongToTenant(state, getters) {
        return getters.isLoggedIn && state.memberTenantId === state.tenantId;
    },

    tenantName(state) {
        return state.tenantName;
    },

    tenantLogo(state) {
        return state.tenantLogo;
    },

    shouldHideBottomMryLogo(state) {
        return state.shouldHideBottomMryLogo;
    },

    isVideoAudioAllowed(state) {
        return state.videoAudioAllowed;
    },

    //账户subdomain
    subdomainPrefix(state) {
        return state.subdomainPrefix;
    },

    //账户的subdomain是否已经生效了
    isSubdomainEffective(state, getters) {
        return getters.subdomainPrefix && state.subdomainReady;
    },

    //根据controlId查control
    controlOf: (state) => (controlId) => {
        return state.controlsMap.get(controlId);
    },

    isQrTemplate(state) {
        return state.qr.template;
    },

    appName(state) {
        return state.app.name;
    },

    appVersion(state) {
        return state.app.version;
    },

    qrName(state) {
        return state.qr.name;
    },

    appSetting(state) {
        return state.app.setting;
    },

    instanceDesignation(state) {
        return appInstanceDesignation(state.app.setting);
    },

    customIdDesignation(state) {
        return qrCustomIdDesignation(state.app.setting);
    },

    submitterDesignationOf: (state) => (pageId) => {
        let page = state.pagesMap.get(pageId);
        return pageSubmitterDesignation(page);
    },

    submitAtDesignationOf: (state) => (pageId) => {
        let page = state.pagesMap.get(pageId);
        return pageSubmitAtDesignation(page);
    },

    qrDescription(state) {
        return state.qr.description;
    },

    qrHeaderImage(state) {
        return state.qr.headerImage;
    },

    homePageHeaderImage(state, getters) {
        if (!getters.isHomePageHeaderImageReplaceable) {
            return null;
        }

        if (getters.qrHeaderImage) {
            return getters.qrHeaderImage;
        }

        return getters.homePage.header.image;
    },

    homePageHeader(state, getters) {
        return {...getters.homePage.header, image: getters.homePageHeaderImage}
    },

    currentPageHeader(state, getters) {
        if (getters.isCurrentHomePage) {
            return getters.homePageHeader;
        }

        if (getters.currentPage.header.type === 'INHERITED') {
            return getters.homePageHeader;
        }

        return getters.currentPage.header;
    },

    qrId(state) {
        return state.qr.id;
    },

    qrGeolocation(state) {
        return state.qr.geolocation;
    },

    qrCirculationStatus(state) {
        return state.qr.circulationOptionId;
    },

    canOperateApp(state) {
        return state.canOperateApp;
    },

    homePageId(state) {
        return state.homePageId;
    },

    currentPageId(state) {
        return state.currentPageId;
    },

    mode(state) {
        return state.mode;
    },

    currentSubmission(state) {
        return state.submission;
    },

    currentSubmissionId(state) {
        if (state.submission) {
            return state.submission.id;
        }
    },

    canUpdateCurrentSubmission(state) {
        if (!state.submission) {
            return false;
        }

        return state.submission.canUpdate;
    },

    canApproveCurrentSubmission(state) {
        if (!state.submission) {
            return false;
        }

        return state.submission.canApprove;
    },

    isCurrentSubmissionApproved(state) {
        if (!state.submission) {
            return false;
        }

        return !!state.submission.approval;
    },

    qrTenantId(state) {
        return state.qr.tenantId;
    },

    plateId(state) {
        return state.qr.plateId;
    },

    appId(state) {
        return state.app.id;
    },

    menu(state) {
        return state.app.setting.menu;
    },

    getPage: (state) => (pageId) => {
        return state.pagesMap.get(pageId);
    },

    pageActionNameOf: (state, getters) => (pageId) => {
        return pageActionName(getters.getPage(pageId));
    },

    isPageViewableByCirculation: (state, getters) => (pageId) => {
        let currentCirculationOptionId = getters.qrCirculationStatus;
        if (!currentCirculationOptionId) {
            return true;
        }

        let permission = state.app.setting.circulationStatusSetting.statusPermissions
            .find(it => it.optionId === currentCirculationOptionId);

        if (!permission) {
            return true;
        }

        return !permission.notAllowedPageIds.includes(pageId);
    },

    currentPage(state) {
        return state.pagesMap.get(state.currentPageId);
    },

    homePage(state) {
        return state.pagesMap.get(state.homePageId);
    },

    isHomePageHeaderImageReplaceable(state, getters) {
        return getters.homePage.header.showImage;
    },

    isGeolocationEnabled(state) {
        return state.app.setting.config.geolocationEnabled;
    },

    isQrIntroductionEnabled(state) {
        return state.app.setting.config.qrIntroductionEnabled;
    },

    isQrCustomIdManualEditable(state) {
        return state.app.setting.config.qrCustomIdManualEditable;
    },

    pageExists: (state) => (pageId) => {
        return state.pagesMap.has(pageId);
    },

    isCurrentHomePage(state, getters) {
        if (getters.currentPage && getters.homePage) {
            return getters.currentPage.id === getters.homePage.id;
        }
    },

    headerImageCropType(state, getters) {
        return getters.homePage.header.imageCropType;
    },

    canManageQr(state) {
        return state.permissions.includes('CAN_MANAGE_GROUP') || state.permissions.includes('CAN_MANAGE_APP');
    },

    isPageRequireLogin: (state, getters) => (pageId) => {
        let thePage = getters.getPage(pageId);
        return thePage.setting.permission !== 'PUBLIC';
    },

    isCurrentPageRequireLogin: (state, getters) => {
        return getters.currentPage.setting.permission !== 'PUBLIC';
    },

    hasAccessToPage: (state, getters) => (pageId) => {
        let thePage = getters.getPage(pageId);
        return state.permissions.includes(thePage.setting.permission);
    },

    hasAccessToCurrentPage(state, getters) {
        return state.permissions.includes(getters.currentPage.setting.permission);
    },

    isCurrentPageNewSubmit(state, getters) {
        return getters.currentPage.setting.submitType === 'NEW';
    },

    isCurrentPagePerMemberSubmit(state, getters) {
        return getters.currentPage.setting.submitType === 'ONCE_PER_MEMBER';
    },

    isCurrentPagePerInstanceSubmit(state, getters) {
        return getters.currentPage.setting.submitType === 'ONCE_PER_INSTANCE';
    },

    isCurrentPageAutoFillable(state, getters) {
        return getters.currentPage.controls.some(control => {//只要有一个control是autoFill的，则表示page也是autoFill的
            return control.fillableSetting && control.fillableSetting.autoFill;
        });
    },

    isCurrentPageApprovalEnabled: (state, getters) => {
        return getters.currentPage.setting.approvalSetting.approvalEnabled;
    },

    currentPageAfterSubmitBehaviour: (state, getters) => {
        return getters.currentPage.setting.afterSubmitBehaviour;
    },

    hasAccessToControl: (state) => (control) => {
        if (!control.permissionEnabled) {
            return true;//能够执行此表示已经拥有对页面的权限，而控件的权限默认与页面权限保持一致
        }

        return state.permissions.includes(control.permission);
    },

    allAttributes(state) {
        return state.app.setting.attributes;
    },

    allFillableControlsOnPage: (state, getters) => (pageId) => {
        return getters.getPage(pageId).controls.filter(control => {
            return controlTypes[control.type].fillable;
        });
    },

    submissionSummaryEligibleControlsOfPage: (state, getters) => (pageId) => {
        return getters.allFillableControlsOnPage(pageId).filter(control => {
            return control.fillableSetting && control.fillableSetting.submissionSummaryEligible;
        });
    },

    //对于qr的submission列表，是否能看到某个control的answer
    canViewAnswerForControl: (state, getters) => (control, operationMenuType) => {
        if (getters.canManageQr) {
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

    //对于qr的submission列表，某个页面所有可以看到的control
    answerViewableControlsOfPage: (state, getters) => (pageId, operationMenuType) => {
        return getters.submissionSummaryEligibleControlsOfPage(pageId).filter(control => {
            return getters.canViewAnswerForControl(control, operationMenuType);
        });
    },

    //对于qr的submission列表，某个页面可以排序或过滤的control
    answerConfigurableControlsOfPage: (state, getters) => (pageId, operationMenuType) => {
        return getters.allFillableControlsOnPage(pageId).filter(control => {
            return getters.canViewAnswerForControl(control, operationMenuType);
        });
    },

    //对于qr的submission列表，某个页面可以排序的control
    allAnswerSortableControlsOfPage: (state, getters) => (pageId, type) => {
        return getters.answerConfigurableControlsOfPage(pageId, type).filter(control => isControlAnswerSortable(control));
    },

    //对于qr的submission列表，某个页面可以过滤的control
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

    attributesOf: (state) => (attributeIds) => {
        return attributeIds.map(id => {
            return state.attributesMap.get(id);
        });
    },

    manualInputAttributes(state, getters) {
        return getters.allAttributes.filter(attr => {
            return attr.type === 'DIRECT_INPUT' && attr.manualInput;
        });
    },

    viewablePageLinks: (state, getters) => (links, showBasedOnPermission) => {
        return links.filter(link => {
            if (!link.complete) {
                return false;
            }

            if (link.type === 'PAGE') {
                if (!getters.isPageViewableByCirculation(link.pageId)) {
                    return false;
                }

                if (showBasedOnPermission) {
                    return getters.hasAccessToPage(link.pageId);
                }

                return true;
            }

            return true;
        });
    },

    viewableMenuLinks(state, getters) {
        return getters.viewablePageLinks(getters.menu.links, getters.menu.showBasedOnPermission);
    },

    currentPageApprovalPassedText(state, getters) {
        return getters.currentPage.setting.approvalSetting.passText;
    },

    currentPageApprovalNotPassedText(state, getters) {
        return getters.currentPage.setting.approvalSetting.notPassText;
    },

    qrManageOssRequest(state, getters) {
        return {
            type: 'QR_MANAGE',
            tenantId: getters.qrTenantId,
            appId: getters.appId,
            qrId: getters.qrId,
        }
    },

    submissionOssRequest(state, getters) {
        return {
            type: 'SUBMISSION',
            tenantId: getters.qrTenantId,
            appId: getters.appId,
            qrId: getters.qrId,
            pageId: getters.currentPageId
        }
    },

    currentPageViewPortBackgroundColor(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.setting.viewPortBackgroundColor;
        }
    },

    currentPageViewPortBackgroundImage(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.setting.viewPortBackgroundImage;
        }
    },

    currentPageMaxWidth(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.setting.pageMaxWidth;
        }
    },

    currentPageContentMaxWidth(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.setting.contentMaxWidth;
        }
    },

    currentPageBackgroundColor(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.setting.pageBackgroundColor;
        }
    },

    currentPageShadow(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.setting.shadow;
        }
    },

    currentPageBorder(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.setting.border;
        }
    },

    shouldCurrentPageShowTopBar(state, getters) {
        if (getters.currentPage) {
            return !getters.currentPage.setting.hideTopBar;
        }
    },

    currentPageSubmitButton(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.submitButton;
        }
    },

    shouldCurrentPageShowTopBottomBlank(state, getters) {
        if (getters.currentPage) {
            return !getters.currentPage.setting.hideTopBottomBlank;
        }
    },

    appTopBar(state) {
        return state.app.setting.appTopBar;
    },

    shouldCurrentPageShowProfileButton(state, getters) {
        if (getters.currentPage) {
            return !getters.currentPage.setting.hideProfileButton;
        }
    },

    shouldCurrentPageShowControlIndex(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.setting.showControlIndex;
        }
    },

    shouldCurrentPageShowControlAsterisk(state, getters) {
        if (getters.currentPage) {
            return getters.currentPage.setting.showAsterisk;
        }
    },

    shouldCurrentPageShowHeader(state, getters) {
        if (getters.currentPage) {
            return !getters.currentPage.setting.hideHeader;
        }
    },

    shouldCurrentPageShowTitle(state, getters) {
        if (getters.currentPage) {
            return !getters.currentPage.setting.hideTitle;
        }
    },

    shouldCurrentPageShowMenu(state, getters) {
        if (getters.currentPage) {
            return !getters.currentPage.setting.hideMenu;
        }
    },

    isViewOnlyMode(state) {
        return state.mode === 'READONLY' || state.mode === 'APPROVAL';
    },

    isDefaultMode(state) {
        return state.mode === 'DEFAULT';
    },

    isUpdateMode(state) {
        return state.mode === 'UPDATE';
    },

    isReadOnlyMode(state) {
        return state.mode === 'READONLY';
    },

    isApprovalMode(state) {
        return state.mode === 'APPROVAL';
    },

    allControlsOnCurrentPage(state, getters) {
        return getters.currentPage.controls;
    },

    allFillableControlsOnCurrentPage(state, getters) {
        return getters.allControlsOnCurrentPage.filter(control => {
            return controlTypes[control.type].fillable;
        });
    },

    allSubmissionControlIds(state) {
        if (state.submission) {
            return state.submission.answers.map(control => control.controlId);
        }
        return [];
    },

    allPermissionedControlIdsOnCurrentPage(state, getters) {
        return getters.allControlsOnCurrentPage.filter(control => {
            return getters.hasAccessToControl(control);
        }).map(control => control.id);
    },

    tobeSubmittedControlIdsOnCurrentPage(state, getters) {
        return getters.allFillableControlsOnCurrentPage.filter(control => {
            return getters.hasAccessToControl(control);
        }).map(control => control.id);
    },

    allViewableControlsOnCurrentPage(state, getters) {
        return getters.allControlsOnCurrentPage.filter(control => {
            if (getters.isViewOnlyMode) {
                //只要submission中有的都可以看到
                return getters.allSubmissionControlIds.includes(control.id) || getters.allPermissionedControlIdsOnCurrentPage.includes(control.id);
            }

            return getters.allPermissionedControlIdsOnCurrentPage.includes(control.id);
        });
    },

    allViewableOperationMenuItems(state) {
        const menuItems = state.app.setting.operationMenuItems;
        let validMenuItems = menuItems.filter(item => {
            switch (item.type) {
                case 'ALL_SUBMIT_HISTORY': {
                    return state.canManageFillablePageIds.length > 0 &&
                        (item.pageId === 'ALL' || state.canManageFillablePageIds.includes(item.pageId));
                }

                case 'SUBMITTER_SUBMISSION': {
                    return state.canViewFillablePageIds.length > 0 &&
                        (item.pageId === 'ALL' || state.canViewFillablePageIds.includes(item.pageId));
                }

                case 'TO_BE_APPROVED': {
                    return state.canApproveFillablePageIds.length > 0 &&
                        (item.pageId === 'ALL' || state.canApproveFillablePageIds.includes(item.pageId));
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

    //根据type和pageId反查菜单名称
    operationMenuNameOf: (state) => (type, pageId) => {
        return operationMenuName(state.app.setting, type, pageId);
    },

    allPageReferences(state) {
        return state.app.setting.pages.map(page => {
            return {
                id: page.id,
                name: pageName(page),
            };
        });
    },

    viewablePages(state, getters) {
        return getters.allPageReferences.filter(page => {
            return state.canViewFillablePageIds.includes(page.id);
        });
    },

    allableViewablePages(state, getters) {
        if (getters.viewablePages.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.viewablePages]
    },

    managablePages(state, getters) {
        return getters.allPageReferences.filter(page => {
            return state.canManageFillablePageIds.includes(page.id);
        });
    },

    allableManagablePages(state, getters) {
        if (getters.managablePages.length === 0) {
            return [];
        }

        return [...[{id: 'ALL', name: '全部'}], ...getters.managablePages]
    },

    approvablePages(state, getters) {
        return getters.allPageReferences.filter(page => {
            return state.canApproveFillablePageIds.includes(page.id);
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

    referenceData(state) {
        return state.referenceData;
    },
};

const actions = {
    [ACTIONS.FETCH_SUBMISSION_QR]({dispatch, commit}, qrId) {
        return qrApi.fetchSubmissionQr(qrId).then((response) => {
            let data = response.data;
            commit("loadQr", data);
        });
    },

};

const mutations = {
    resetPage(state) {
        state.submission = null;
        state.mode = 'DEFAULT';
    },

    setCurrentPage(state, pageId) {
        state.currentPageId = pageId;
    },

    setMode(state, mode) {
        state.mode = mode;
    },

    loadSubmission(state, submission) {
        state.submission = cloneDeep(submission);
    },

    loadQr(state, submissionQr) {
        let profile = submissionQr.submissionQrMemberProfile;
        state.memberId = profile.memberId;
        state.memberTenantId = profile.memberTenantId;
        state.memberName = profile.memberName;
        state.memberAvatar = profile.memberAvatar;
        state.tenantId = profile.tenantId;
        state.tenantName = profile.tenantName;
        state.tenantLogo = profile.tenantLogo;
        state.subdomainPrefix = profile.subdomainPrefix;
        state.subdomainReady = profile.subdomainReady;
        state.shouldHideBottomMryLogo = profile.hideBottomMryLogo;
        state.videoAudioAllowed = profile.videoAudioAllowed;

        state.qr = submissionQr.qr;
        state.permissions = submissionQr.permissions;
        state.canViewFillablePageIds = submissionQr.canViewFillablePageIds;
        state.canManageFillablePageIds = submissionQr.canManageFillablePageIds;
        state.canApproveFillablePageIds = submissionQr.canApproveFillablePageIds;
        state.canOperateApp = submissionQr.canOperateApp;
        let app = submissionQr.app;
        state.app = app;
        state.homePageId = app.setting.config.homePageId;
        app.setting.pages.forEach(page => {
            state.pagesMap.set(page.id, page);
            page.controls.forEach(control => {
                state.controlsMap.set(control.id, control);
            });
        });
        app.setting.attributes.forEach(attribute => {
            state.attributesMap.set(attribute.id, attribute);
        });
    },

    updateQrBaseSetting(state, setting) {
        state.qr.name = setting.name;
        state.qr.description = setting.description;
        state.qr.headerImage = setting.headerImage;
        state.qr.geolocation = setting.geolocation;
    },

    updateHideTopBar(state, hideTopBar) {
        state.hideTopBar = hideTopBar;
    },

    updateReferenceData(state, referenceData) {
        state.referenceData = referenceData;
    },

    updateCirculationAfterSubmission(state, pageId) {
        let setting = state.app.setting.circulationStatusSetting.statusAfterSubmissions.find(it => it.pageId === pageId);
        if (setting) {
            state.qr.circulationOptionId = setting.optionId;
        }
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}