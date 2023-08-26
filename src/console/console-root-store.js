import Vue from 'vue';
import Vuex from 'vuex';
import APP_EDIT_STORE from '@/console/app-edit/store/app-edit-store';
import APP_OPERATION_STORE from '@/console/app-operation/store/app-operation-store';
import QR_LIST_STORE from '@/console/app-operation/qrs/store/qr-list-store';
import APP_LIST_STORE from '@/console/management/app/list/store/app-list-store';
import ORDER_LIST_STORE from '@/console/management/order/store/order-list-store';
import MEMBER_LIST_STORE from '@/console/management/member/list/store/member-list-store';
import PLATE_BATCH_LIST_STORE from '@/console/app-operation/platebatch/store/platebatch-list-store';
import SUBMISSION_LIST_STORE from '@/console/app-operation/submissions/store/submission-list-store';
import REPORTING_STORE from '@/console/app-operation/report/store/reporting-store';
import ASSIGNMENT_PLAN_STORE from '@/console/app-operation/assignment/plans/store/assignment-plan-list-store';
import ASSIGNMENT_LIST_STORE from '@/console/app-operation/assignment/assignments/store/assignment-list-store';
import ASSIGNMENT_QR_LIST_STORE from '@/console/app-operation/assignment/qrs/store/assignment-qr-list-store';
import MY_ASSIGNMENT_LIST_STORE from '@/console/app-operation/assignment/my-assignments/store/my-assignment-list-store';
import GROUP_MANAGE_STORE from '@/console/app-operation/group-manage/group-manage-store';

import memberApi from '@/common/api/member-api';
import ACTIONS from '@/console/console-root-action';
import uuid from 'short-uuid';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        wholeConsoleRefreshKey: 0,//重新加载整个console，包括用户profile
        consoleHomePageRefreshKey: 0,//重新加载除了用户profile之外的所有
        managementPageRefreshKey: 0,//刷新管理台的当前页面
        appOperationPageRefreshKey: 0,//刷新App运营的当前页面，但是不会重新加载当前AppSetting
        myProfile: null,//用户+tenant的profile
        cachedMyApps: null,//默认值必须为null，否则无效
    },

    getters: {
        isMryAppTemplateManageTenant(state) {
            return state.myProfile.tenantId === 'TNT000000000000000002';
        },

        isLoggedIn(state) {
            return !!state.myProfile;
        },

        currentMemberId(state) {
            return state.myProfile.memberId;
        },

        currentMemberName(state) {
            return state.myProfile.name;
        },

        currentMemberAvatar(state) {
            return state.myProfile.avatar;
        },

        currentMemberTopAppIds(state) {
            return state.myProfile.topAppIds;
        },

        isTenantAdmin(state) {
            return state.myProfile.role === 'TENANT_ADMIN';
        },

        isMobileIdentified(state) {
            // return state.myProfile.mobileIdentified;
            return true;//skip mobile identification as it's not user friendly, only for 'free' version
        },

        tenantName(state, getters) {
            if (getters.isLoggedIn) {
                return state.myProfile.tenantProfile.name;
            }
        },

        tenantLogo(state, getters) {
            if (getters.isLoggedIn) {
                return state.myProfile.tenantProfile.logo;
            }
        },

        tenantProfile(state) {
            return state.myProfile.tenantProfile;
        },

        subdomainPrefix(state) {
            return state.myProfile.tenantProfile.subdomainPrefix;
        },

        baseDomainName(state) {
            return state.myProfile.tenantProfile.baseDomainName;
        },

        isSubdomainEffective(state, getters) {
            return getters.subdomainPrefix && state.myProfile.tenantProfile.subdomainReady;
        },

        tenantId(state) {
            return state.myProfile.tenantProfile.tenantId;
        },

        hasManagedApps(state, getters) {
            return state.myProfile.hasManagedApps;
        },

        isMyself: (state) => (memberId) => {
            return state.myProfile.memberId === memberId;
        },

        packagesStatus(state, getters) {
            return getters.tenantProfile.packagesStatus;
        },

        isCurrentPlanExpired(state) {
            return state.myProfile.tenantProfile.packagesStatus.expired;
        },

        isMaxAppReached(state, getters) {
            return getters.packagesStatus.maxAppReached;
        },

        isMaxMemberReached(state, getters) {
            return getters.packagesStatus.maxMemberReached;
        },

        isSubmissionNotifyAllowed(state, getters) {
            return getters.packagesStatus.submissionNotifyAllowed;
        },

        isBatchImportQrAllowed(state, getters) {
            return getters.packagesStatus.batchImportQrAllowed;
        },

        isBatchImportMemberAllowed(state, getters) {
            return getters.packagesStatus.batchImportMemberAllowed;
        },

        isSubmissionApprovalAllowed(state, getters) {
            return getters.packagesStatus.submissionApprovalAllowed;
        },

        isReportingAllowed(state, getters) {
            return getters.packagesStatus.reportingAllowed;
        },

        isCustomSubdomainAllowed(state, getters) {
            return getters.packagesStatus.customSubdomainAllowed;
        },

        isCustomLogoAllowed(state, getters) {
            return getters.packagesStatus.customLogoAllowed;
        },

        isVideoAudioAllowed(state, getters) {
            return getters.packagesStatus.videoAudioAllowed;
        },

        isDeveloperAllowed(state, getters) {
            return getters.packagesStatus.developerAllowed;
        },

        isAssignmentAllowed(state, getters) {
            return getters.packagesStatus.assignmentAllowed;
        },

        supportedControlTypes(state, getters) {
            return getters.packagesStatus.supportedControlTypes;
        },

        currentPlanExpireAt(state) {
            return state.myProfile.tenantProfile.packagesStatus.expireAt;
        },

        currentPlanType(state) {
            return state.myProfile.tenantProfile.packagesStatus.planType;
        },

        currentEffectivePlanType(state, getters) {
            return getters.packagesStatus.effectivePlanType;
        },

        currentPlanName(state) {
            return state.myProfile.tenantProfile.packagesStatus.planName;
        },

        currentPlanNameWithExpire(state, getters) {
            if (getters.isCurrentPlanExpired) {
                return state.myProfile.tenantProfile.packagesStatus.planName + '，已过期';
            }
            return state.myProfile.tenantProfile.packagesStatus.planName;
        },

        memberInfoOssRequest(state, getters) {
            return {
                type: 'MEMBER_INFO',
                tenantId: getters.tenantId,
                memberId: getters.currentMemberId,
            }
        },

        cachedMyApps(state) {
            return state.cachedMyApps;
        },
    },

    actions: {
        [ACTIONS.FETCH_MY_PROFILE]({commit}) {
            return memberApi.fetchMyProfile().then((response) => {
                commit("loadMyProfile", response.data);
            });
        },
    },

    mutations: {
        refreshWholeConsole(state) {
            state.wholeConsoleRefreshKey = uuid.generate();
        },

        refreshConsoleHomePage(state) {
            state.consoleHomePageRefreshKey = uuid.generate();
        },

        refreshConsoleManagementPage(state) {
            state.managementPageRefreshKey = uuid.generate();
        },

        refreshConsoleAppOperationPage(state) {
            state.appOperationPageRefreshKey = uuid.generate();
        },

        updateTenantName(state, name) {
            state.myProfile.tenantProfile.name = name;
        },

        updateMemberName(state, name) {
            state.myProfile.name = name;
        },

        updateMemberAvatar(state, avatar) {
            state.myProfile.avatar = avatar;
        },

        updateTenantLogo(state, logo) {
            state.myProfile.tenantProfile.logo = logo;
        },

        loadMyProfile(state, value) {
            state.myProfile = value;
        },

        addToppedApp(state, appId) {
            state.myProfile.topAppIds.unshift(appId);
        },

        deleteToppedApp(state, tobeDeletedAppId) {
            state.myProfile.topAppIds = state.myProfile.topAppIds.filter(appId => appId !== tobeDeletedAppId);
        },

        loadMyAppsCache(state, myApps) {
            state.cachedMyApps = myApps;
        },

        clearMyAppsCache(state) {
            state.cachedMyApps = null;
        },
    },

    modules: {
        APP_EDIT_STORE,
        APP_OPERATION_STORE,
        QR_LIST_STORE,
        APP_LIST_STORE,
        MEMBER_LIST_STORE,
        PLATE_BATCH_LIST_STORE,
        SUBMISSION_LIST_STORE,
        REPORTING_STORE,
        ORDER_LIST_STORE,
        ASSIGNMENT_PLAN_STORE,
        ASSIGNMENT_LIST_STORE,
        ASSIGNMENT_QR_LIST_STORE,
        MY_ASSIGNMENT_LIST_STORE,
        GROUP_MANAGE_STORE,
    }

});