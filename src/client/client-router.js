import Vue from 'vue';
import Router from 'vue-router';

import LoginPage from '@/common/components/login/LoginPage';
import QrHomePage from '@/client/qr/QrHomePage';
import FormPage from '@/client/qr/FormPage';
import QrOperationBasePage from '@/client/qr/QrOperationBasePage';
import QrFormBasePage from '@/client/qr/QrFormBasePage';
import ClientOperationHomePage from '@/client/operations/ClientOperationHomePage';
import ClientAppOperationBasePage from '@/client/operations/app/ClientAppOperationBasePage';
import ClientMyAppsPage from '@/client/operations/my-apps/ClientMyAppsPage';
import ClientAppQrListPage from '@/client/operations/app/ClientAppQrListPage';
import ClientAppHomePage from '@/client/operations/app/ClientAppHomePage';
import ClientGroupOperationBasePage from '@/client/operations/app/group/ClientGroupOperationBasePage';
import ClientGroupOperationHomePage from '@/client/operations/app/group/ClientGroupOperationHomePage';
import ClientGroupQrListPage from '@/client/operations/app/group/ClientGroupQrListPage';
import BindPlatePage from '@/client/operations/plate/BindPlatePage';

const NotFoundPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/common/pages/NotFoundPage");

const QrBaseSettingPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/qr/QrBaseSettingPage");

const QrSubmitterSubmissionListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/qr/QrSubmitterSubmissionListPage");

const QrSubmissionHistoryListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/qr/QrSubmissionHistoryListPage");

const QrToBeApprovedSubmissionListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/qr/QrToBeApprovedSubmissionListPage");

const ClientMeBasePage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/profile/ClientMeBasePage");

const ClientMyProfilePage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/profile/ClientMyProfilePage");

const ClientUpdateMyBaseSettingPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/profile/ClientUpdateMyBaseSettingPage");

const ClientResetMyPasswordPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/profile/ClientResetMyPasswordPage");

const ClientChangeMyMobilePage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/profile/ClientChangeMyMobilePage");

const ClientAppGroupListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/groups/ClientAppGroupListPage");

const ClientAppManualPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/manual/ClientAppManualPage");

const ClientAppReportPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/ClientAppReportPage");

const ClientAppAssignmentListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/ClientAppAssignmentListPage");

const ClientAppMyAssignmentListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/ClientAppMyAssignmentListPage");

const ClientAppAssignmentQrListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/ClientAppAssignmentQrListPage");

const ClientAppMyAssignmentQrListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/ClientAppMyAssignmentQrListPage");

const ClientAppSubmitterSubmissionPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/ClientAppSubmitterSubmissionPage");

const ClientAppSubmissionHistoryPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/ClientAppSubmissionHistoryPage");

const ClientAppToBeApprovedSubmissionPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/ClientAppToBeApprovedSubmissionPage");

const ClientGroupReportPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/group/ClientGroupReportPage");

const ClientGroupSubmissionHistoryPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/group/ClientGroupSubmissionHistoryPage");

const ClientGroupSubmitterSubmissionPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/group/ClientGroupSubmitterSubmissionPage");

const ClientGroupToBeApprovedSubmissionPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/group/ClientGroupToBeApprovedSubmissionPage");

const ClientGroupAssignmentListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/group/ClientGroupAssignmentListPage");

const ClientGroupMyAssignmentListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/group/ClientGroupMyAssignmentListPage");

const ClientGroupAssignmentQrListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/group/ClientGroupAssignmentQrListPage");

const ClientGroupMyAssignmentQrListPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/operations/app/group/ClientGroupMyAssignmentQrListPage");

const SubmittedPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/client/qr/SubmittedPage");

const FindBackPasswordPage = () => import(/* webpackChunkName: "client-prefetch", webpackPrefetch: true */
    "@/common/components/login/FindBackPasswordPage");

Vue.use(Router);

export default new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        let element = document.getElementById('pageScrollToTopHelper');
        if (element) {
            element.scrollIntoView();//每次导航到新页面时均定位到顶部
        }
        if (savedPosition) {
            return savedPosition;
        }
    },

    routes: [
        {
            path: '',
            redirect: '/operations/my-apps'
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
        },
        {
            path: '/findback-password',
            name: 'findback-password',
            component: FindBackPasswordPage
        },
        {
            path: '/operations',
            component: ClientOperationHomePage,
            children: [
                {
                    path: '',
                    redirect: '/operations/my-apps'
                },
                {
                    path: 'me',
                    props: true,
                    component: ClientMeBasePage,
                    children: [
                        {
                            path: '',
                            name: 'client-me',
                            props: true,
                            component: ClientMyProfilePage
                        },
                        {
                            path: 'base-setting',
                            name: 'client-me-base-setting',
                            props: true,
                            component: ClientUpdateMyBaseSettingPage
                        },
                        {
                            path: 'change-mobile',
                            name: 'client-me-change-mobile',
                            props: true,
                            component: ClientChangeMyMobilePage
                        },
                        {
                            path: 'reset-password',
                            name: 'client-me-reset-password',
                            props: true,
                            component: ClientResetMyPasswordPage
                        },
                    ]
                },
                {
                    path: 'my-apps',
                    name: 'default-home',
                    component: ClientMyAppsPage
                },
                {
                    path: 'bind-plate/:plateId',
                    props: true,
                    name: 'bind-plate',
                    component: BindPlatePage
                },
                {
                    path: ':appId',
                    props: true,
                    component: ClientAppOperationBasePage,
                    name: 'app-ops',
                    children: [
                        {
                            path: 'home',
                            name: 'app-home',
                            props: true,
                            component: ClientAppHomePage
                        },
                        {
                            path: 'qrs',
                            name: 'app-qrs',
                            props: true,
                            component: ClientAppQrListPage
                        },
                        {
                            path: 'groups',
                            name: 'app-groups',
                            props: true,
                            component: ClientAppGroupListPage
                        },
                        {
                            path: 'reports',
                            name: 'app-reports',
                            props: true,
                            component: ClientAppReportPage
                        },
                        {
                            path: 'assignments',
                            name: 'client-assignment-list',
                            props: true,
                            component: ClientAppAssignmentListPage
                        },
                        {
                            path: 'assignments/:assignmentId/qrs',
                            name: 'client-assignment-qr-list',
                            props: true,
                            component: ClientAppAssignmentQrListPage,
                        },
                        {
                            path: 'my-assignments',
                            name: 'client-my-assignment-list',
                            props: true,
                            component: ClientAppMyAssignmentListPage
                        },
                        {
                            path: 'my-assignments/:assignmentId/qrs',
                            name: 'client-my-assignment-qr-list',
                            props: true,
                            component: ClientAppMyAssignmentQrListPage
                        },
                        {
                            path: 'user-manual',
                            name: 'app-manual',
                            props: true,
                            component: ClientAppManualPage
                        },
                        {
                            path: 'my-submissions/:pageId',
                            name: 'client-my-submission-list',
                            props: true,
                            component: ClientAppSubmitterSubmissionPage,
                        },
                        {
                            path: 'submission-history/:pageId',
                            name: 'client-submission-history-list',
                            props: true,
                            component: ClientAppSubmissionHistoryPage,
                        },
                        {
                            path: 'approvals/:pageId',
                            name: 'client-approve-list',
                            props: true,
                            component: ClientAppToBeApprovedSubmissionPage,
                        },
                        {
                            path: 'groups/:groupId',
                            props: true,
                            component: ClientGroupOperationBasePage,
                            children: [
                                {
                                    path: '',
                                    name: 'client-group-operation-home',
                                    props: true,
                                    component: ClientGroupOperationHomePage,
                                },
                                {
                                    path: 'qrs',
                                    name: 'client-group-operation-qr-list',
                                    props: true,
                                    component: ClientGroupQrListPage,
                                },
                                {
                                    path: 'my-submissions/:pageId',
                                    name: 'client-group-operation-submitter-submission-list',
                                    props: true,
                                    component: ClientGroupSubmitterSubmissionPage,
                                },
                                {
                                    path: 'submission-history/:pageId',
                                    name: 'client-group-operation-submission-history-list',
                                    props: true,
                                    component: ClientGroupSubmissionHistoryPage,
                                },
                                {
                                    path: 'approvals/:pageId',
                                    name: 'group-operation-approve-list',
                                    props: true,
                                    component: ClientGroupToBeApprovedSubmissionPage,
                                },
                                {
                                    path: 'reports',
                                    name: 'client-group-operation-reports',
                                    props: true,
                                    component: ClientGroupReportPage,
                                },
                                {
                                    path: 'assignments',
                                    name: 'client-group-assignment-list',
                                    props: true,
                                    component: ClientGroupAssignmentListPage,
                                },
                                {
                                    path: 'assignments/:assignmentId/qrs',
                                    name: 'client-group-assignment-qr-list',
                                    props: true,
                                    component: ClientGroupAssignmentQrListPage,
                                },
                                {
                                    path: 'my-assignments',
                                    name: 'client-group-my-assignment-list',
                                    props: true,
                                    component: ClientGroupMyAssignmentListPage,
                                },
                                {
                                    path: 'my-assignments/:assignmentId/qrs',
                                    name: 'client-group-my-assignment-qr-list',
                                    props: true,
                                    component: ClientGroupMyAssignmentQrListPage,
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        {
            path: '/r/:plateId',
            props: true,
            name: 'qr-home',
            component: QrHomePage,
            children: [
                {
                    path: 'operations',
                    name: 'qr-operations',
                    component: QrOperationBasePage,
                    children: [
                        {
                            path: 'setting',
                            name: 'qr-setting',
                            props: true,
                            component: QrBaseSettingPage,
                        },
                        {
                            path: 'my-submissions/:pageId',
                            name: 'qr-my-submission-list',
                            props: true,
                            component: QrSubmitterSubmissionListPage,
                        },
                        {
                            path: 'submission-history/:pageId',
                            name: 'qr-submission-history-list',
                            props: true,
                            component: QrSubmissionHistoryListPage,
                        },
                        {
                            path: 'approvals/:pageId',
                            name: 'qr-approve-list',
                            props: true,
                            component: QrToBeApprovedSubmissionListPage,
                        },
                    ]
                },
                {
                    path: 'pages/:pageId',
                    props: true,
                    component: QrFormBasePage,
                    children: [
                        {
                            path: 'submitted',
                            name: 'submitted',
                            component: SubmittedPage,
                        },
                        {
                            path: '',
                            props: true,
                            name: 'new-submission',
                            component: FormPage,
                        },
                        {
                            path: ':submissionId',
                            props: true,
                            name: 'edit-submission',
                            component: FormPage,
                        },
                    ],
                }
            ],
        },

        {
            path: '*',
            component: NotFoundPage
        }

    ]
})
