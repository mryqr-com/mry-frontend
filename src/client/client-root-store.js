import Vue from 'vue';
import Vuex from 'vuex';
import CLIENT_QR_STORE from '@/client/qr/store/client-qr-store';
import CLIENT_APP_OPERATION_STORE from '@/client/operations/app/store/client-app-operation-store';
import CLIENT_SUBMISSION_LIST_STORE from '@/client/operations/app/submissions/store/client-submission-list-store';
import CLIENT_QR_LIST_STORE from '@/client/operations/app/qrs/store/client-qr-list-store';
import CLIENT_QR_SUBMISSION_LIST_STORE from '@/client/qr/submissions/store/qr-submission-list-store';
import CLIENT_ASSIGNMENT_LIST_STORE from '@/client/operations/app/assignment/list/store/client-assignment-list-store';
import CLIENT_MY_ASSIGNMENT_LIST_STORE from '@/client/operations/app/assignment/mine/store/client-my-assignment-list-store';
import CLIENT_ASSIGNMENT_QR_LIST_STORE from '@/client/operations/app/assignment/qrs/store/client-assignment-qr-list-store';

import ACTIONS from '@/client/client-root-action';
import memberApi from "@/common/api/member-api";
import uuid from "short-uuid";

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        memberId: null,
        memberName: null,
        avatar: null,
        tenantId: null,
        tenantName: null,
        tenantLogo: null,
        subdomainPrefix: null,
        subdomainReady: false,
        shouldHideBottomMryLogo: false,
        reportingAllowed: false,
        kanbanAllowed: false,
        assignmentAllowed: false,
        wholeClientRefreshKey: 0,//重新加载整个client，包括用户profile
        clientHomePageRefreshKey: 0,//重新加载client端中除了用户profile之外的所有
        clientAppOperationPageRefreshKey: 0,//刷新App运营的当前页面，但是不会重新加载当前AppSetting
        topAppIds: [],
        cachedMyApps: null,//默认值必须为null，否则无效
    },

    getters: {
        memberId(state) {
            return state.memberId;
        },

        tenantId(state) {
            return state.tenantId;
        },

        isLoggedIn(state) {
            return !!state.memberId;
        },

        memberName(state) {
            return state.memberName;
        },

        memberAvatar(state) {
            return state.avatar;
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

        isReportingAllowed(state) {
            return state.reportingAllowed;
        },

        isKanbanAllowed(state) {
            return state.kanbanAllowed;
        },

        isAssignmentAllowed(state) {
            return state.assignmentAllowed;
        },

        //账户subdomain
        subdomainPrefix(state) {
            return state.subdomainPrefix;
        },

        //账户的subdomain是否已经生效了
        isSubdomainEffective(state, getters) {
            return getters.subdomainPrefix && state.subdomainReady;
        },

        topAppIds(state) {
            return state.topAppIds;
        },

        memberInfoOssRequest(state, getters) {
            return {
                type: 'MEMBER_INFO',
                tenantId: getters.tenantId,
                memberId: getters.memberId,
            }
        },

        cachedMyApps(state) {
            return state.cachedMyApps;
        },
    },

    actions: {
        [ACTIONS.FETCH_MY_CLIENT_PROFILE]({commit}) {
            return memberApi.fetchMyClientProfile().then((response) => {
                commit("setClientMemberProfile", response.data);
            });
        },
    },

    mutations: {
        setClientMemberProfile(state, profile) {
            state.memberId = profile.memberId;
            state.memberName = profile.memberName;
            state.avatar = profile.avatar;
            state.tenantId = profile.tenantId;
            state.tenantName = profile.tenantName;
            state.tenantLogo = profile.tenantLogo;
            state.subdomainPrefix = profile.subdomainPrefix;
            state.subdomainReady = profile.subdomainReady;
            state.shouldHideBottomMryLogo = profile.hideBottomMryLogo;
            state.reportingAllowed = profile.reportingAllowed;
            state.kanbanAllowed = profile.kanbanAllowed;
            state.assignmentAllowed = profile.assignmentAllowed;
            state.topAppIds = profile.topAppIds;
        },

        refreshWholeClient(state) {
            state.wholeClientRefreshKey = uuid.generate();
        },

        refreshClientHomePage(state) {
            state.clientHomePageRefreshKey = uuid.generate();
        },

        refreshClientAppOperationPage(state) {
            state.clientAppOperationPageRefreshKey = uuid.generate();
        },

        addToppedApp(state, appId) {
            state.topAppIds.unshift(appId);
        },

        deleteToppedApp(state, tobeDeletedAppId) {
            state.topAppIds = state.topAppIds.filter(appId => appId !== tobeDeletedAppId);
        },

        updateMemberAvatar(state, avatar) {
            state.avatar = avatar;
        },

        updateMemberName(state, name) {
            state.memberName = name;
        },

        loadMyAppsCache(state, myApps) {
            state.cachedMyApps = myApps;
        },

        clearMyAppsCache(state) {
            state.cachedMyApps = null;
        }
    },

    modules: {
        CLIENT_QR_STORE,
        CLIENT_APP_OPERATION_STORE,
        CLIENT_QR_LIST_STORE,
        CLIENT_SUBMISSION_LIST_STORE,
        CLIENT_QR_SUBMISSION_LIST_STORE,
        CLIENT_ASSIGNMENT_LIST_STORE,
        CLIENT_MY_ASSIGNMENT_LIST_STORE,
        CLIENT_ASSIGNMENT_QR_LIST_STORE,
    }
});