import Vue from 'vue';
import Router from 'vue-router';
import ConsoleHomePage from '@/console/ConsoleHomePage';
import AppOperationWrapper from '@/console/app-operation/AppOperationWrapper';
import AppOperationBasePage from '@/console/app-operation/AppOperationBasePage';
import QrOperationBasePage from '@/console/app-operation/qr-operation/QrOperationBasePage';
import ManagementBasePage from '@/console/management/ManagementBasePage';
import MyAppsPage from '@/console/management/app/mine/MyAppsPage';
import AppOperationQrListPage from '@/console/app-operation/AppOperationQrListPage';
import LoginPage from '@/common/components/login/LoginPage';
import NotFoundPage from '@/console/common/NotFoundPage';
import PublicBasePage from '@/console/public/PublicBasePage';

const AppListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/app/list/AppListPage");

const MemberListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/member/list/MemberListPage");

const GroupListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group/GroupListPage");

const GroupManagePage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-manage/GroupManagePage");

const AppManualPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/manual/AppManualPage");

const PlateBatchListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/platebatch/PlateBatchListPage");

const AppSubmissionHistoryListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/AppSubmissionHistoryListPage");

const AppToBeApprovedSubmissionListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/AppToBeApprovedSubmissionListPage");

const AppSubmitterSubmissionListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/AppSubmitterSubmissionListPage");

const AppReportingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/AppReportingPage");

const AppOperationAssignmentPlanListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/AppOperationAssignmentPlanListPage");

const AppOperationAssignmentListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/AppOperationAssignmentListPage");

const AppOperationAssignmentQrListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/AppOperationAssignmentQrListPage");

const AppOperationMyAssignmentQrListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/AppOperationMyAssignmentQrListPage");

const AppOperationMyAssignmentListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/AppOperationMyAssignmentListPage");

const QrOperationWorkbenchPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/qr-operation/QrOperationWorkbenchPage");

const QrOperationSubmitterSubmissionListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/qr-operation/QrOperationSubmitterSubmissionListPage");

const QrOperationSubmissionHistoryListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/qr-operation/QrOperationSubmissionHistoryListPage");

const QrOperationToBeApprovedSubmissionListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/qr-operation/QrOperationToBeApprovedSubmissionListPage");

const GroupOperationBasePage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationBasePage");

const GroupOperationQrListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationQrListPage");

const GroupOperationReportingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationReportingPage");

const GroupOperationAssignmentPlanListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationAssignmentPlanListPage");

const GroupOperationAssignmentListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationAssignmentListPage");

const GroupOperationMyAssignmentListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationMyAssignmentListPage");

const GroupOperationAssignmentQrListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationAssignmentQrListPage");

const GroupOperationMyAssignmentQrListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationMyAssignmentQrListPage");

const GroupOperationSubmissionHistoryListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationSubmissionHistoryListPage");

const GroupOperationSubmitterSubmissionListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationSubmitterSubmissionListPage");

const GroupOperationToBeApprovedSubmissionListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-operation/group-operation/GroupOperationToBeApprovedSubmissionListPage");

const OrderListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/order/OrderListPage");

const TenantInfoPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/tenant/setting/TenantInfoPage");

const TenantBaseSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/tenant/setting/TenantBaseSettingPage");

const TenantLogoSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/tenant/setting/TenantLogoSettingPage");

const TenantSubdomainSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/tenant/setting/TenantSubdomainSettingPage");

const TenantApiSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/tenant/setting/TenantApiSettingPage");

const TenantInvoiceSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/tenant/setting/TenantInvoiceSettingPage");

const TenantConsigneeSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/tenant/setting/TenantConsigneeSettingPage");

const TenantSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/tenant/setting/TenantSettingPage");

const MemberSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/profile/MemberSettingPage");

const MemberInfoPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/profile/MemberInfoPage");

const MyBaseSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/profile/MyBaseSettingPage");

const ChangeMyPasswordPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/profile/ChangeMyPasswordPage");

const ChangeMyMobilePage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/profile/ChangeMyMobilePage");

const RegisterPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/register/RegisterPage");

const AppEditPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-edit/AppEditPage");

const AppSettingsPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-edit/settings/AppSettingsPage");

const CirculationStatusSettingPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-edit/circulation/CirculationStatusSettingPage");

const PageEditPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-edit/PageEditPage");

const AttributeListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-edit/attribute/AttributeListPage");

const OperationMenuItemListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-edit/operation-menu/OperationMenuItemListPage");

const PlateSettingEditPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/app-edit/plate/PlateSettingEditPage");

const FindBackPasswordPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/common/components/login/FindBackPasswordPage");

const CheckoutPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/management/checkout/CheckoutPage");

const AppTemplateListPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/public/apptemplate/AppTemplateListPage");

const AppTemplateDetailPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/public/apptemplate/AppTemplateDetailPage");

const PackagesSelectPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/public/packages/PackagesSelectPage");

const FreePackagesPage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/public/packages/FreePackagesPage.vue");

const PrintingServicePage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/public/printingservice/PrintingServicePage");

const FreePrintingServicePage = () => import(/* webpackChunkName: "console-prefetch", webpackPrefetch: true */
    "@/console/public/printingservice/FreePrintingServicePage.vue");

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
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
            path: '/register',
            name: 'register',
            component: RegisterPage,
        },
        {
            path: '/public',
            component: PublicBasePage,
            children: [
                {
                    path: 'app-templates',
                    name: 'app-templates',
                    component: AppTemplateListPage,
                },
                {
                    path: 'app-templates/:templateId',
                    name: 'app-template-detail',
                    props: true,
                    component: AppTemplateDetailPage,
                },
                {
                    path: 'packages',
                    name: 'purchase-packages',
                    component: FreePackagesPage,
                }, {
                    path: 'printing-service',
                    name: 'printing-service',
                    component: FreePrintingServicePage,
                },
            ]
        },
        {
            path: '/checkout',
            name: 'checkout-counter',
            props: true,
            component: CheckoutPage,
        },
        {
            path: '',
            component: ConsoleHomePage,
            children: [
                {
                    path: '',
                    name: 'default-home',
                    redirect: '/management/my-apps'
                },

                {
                    path: '/management',
                    component: ManagementBasePage,
                    children: [
                        {
                            path: 'my-apps',
                            name: 'my-app-list',
                            component: MyAppsPage,
                            meta: {name: '我的应用'}
                        },

                        {
                            path: 'members',
                            name: 'member-list',
                            component: MemberListPage,
                            meta: {
                                name: '成员管理',
                                helpUrl: `//docs.mryqr.com/member-management/operations`,
                            }
                        },

                        {
                            path: 'apps',
                            name: 'app-list',
                            component: AppListPage,
                            meta: {
                                name: '应用管理',
                                helpUrl: `//docs.mryqr.com/app-management/operations`,
                            }
                        },
                        {
                            path: 'orders',
                            name: 'tenant-order-list',
                            meta: {name: '订单管理'},
                            component: OrderListPage,
                        },
                        {
                            path: 'tenant-settings',
                            component: TenantSettingPage,
                            children: [
                                {
                                    path: '',
                                    name: 'tenant-settings',
                                    redirect: '/management/tenant-settings/info'
                                },
                                {
                                    path: 'info',
                                    name: 'tenant-info',
                                    meta: {
                                        name: '账户设置',
                                        helpUrl: `//docs.mryqr.com/settings/tenant-setting/`
                                    },
                                    component: TenantInfoPage,
                                },
                                {
                                    path: 'base',
                                    name: 'tenant-base-setting',
                                    meta: {
                                        name: '账户设置',
                                        helpUrl: `//docs.mryqr.com/settings/tenant-setting/`
                                    },
                                    component: TenantBaseSettingPage,
                                },
                                {
                                    path: 'logo',
                                    name: 'tenant-logo-setting',
                                    meta: {
                                        name: '账户设置',
                                        helpUrl: `//docs.mryqr.com/settings/tenant-setting/`
                                    },
                                    component: TenantLogoSettingPage,
                                },
                                {
                                    path: 'subdomain',
                                    name: 'tenant-subdomain-setting',
                                    meta: {
                                        name: '账户设置',
                                        helpUrl: `//docs.mryqr.com/settings/tenant-setting/`
                                    },
                                    component: TenantSubdomainSettingPage,
                                },
                                {
                                    path: 'api',
                                    name: 'api-setting',
                                    meta: {
                                        name: '账户设置',
                                        helpUrl: `//docs.mryqr.com/settings/tenant-setting/`
                                    },
                                    component: TenantApiSettingPage,
                                },
                                {
                                    path: 'invoice',
                                    name: 'tenant-invoice-setting',
                                    meta: {
                                        name: '账户设置',
                                        helpUrl: `//docs.mryqr.com/settings/tenant-setting/`
                                    },
                                    component: TenantInvoiceSettingPage,
                                },
                                {
                                    path: 'consignee',
                                    name: 'tenant-consignee-setting',
                                    meta: {
                                        name: '账户设置',
                                        helpUrl: `//docs.mryqr.com/settings/tenant-setting/`
                                    },
                                    component: TenantConsigneeSettingPage,
                                },
                            ]
                        },
                        {
                            path: 'personal-settings',
                            component: MemberSettingPage,
                            children: [
                                {
                                    path: '',
                                    name: 'personal-settings',
                                    redirect: '/management/personal-settings/info'
                                },
                                {
                                    path: 'info',
                                    name: 'my-info',
                                    meta: {name: '个人设置'},
                                    component: MemberInfoPage,
                                },
                                {
                                    path: 'base',
                                    name: 'my-base-setting',
                                    meta: {name: '个人设置'},
                                    component: MyBaseSettingPage,
                                },
                                {
                                    path: 'change-my-mobile',
                                    name: 'change-my-mobile',
                                    meta: {name: '个人设置'},
                                    component: ChangeMyMobilePage,
                                },
                                {
                                    path: 'change-my-password',
                                    name: 'change-my-password',
                                    meta: {name: '个人设置'},
                                    component: ChangeMyPasswordPage,
                                },
                            ]
                        }
                    ]
                },
                {
                    path: '/apps/:appId',
                    component: AppOperationWrapper,
                    props: true,
                    children: [
                        {
                            path: 'operations',
                            name: 'app-ops',
                            component: AppOperationBasePage,
                            children: [
                                {
                                    path: 'qrs',
                                    name: 'qr-list',
                                    props: true,
                                    component: AppOperationQrListPage,
                                },
                                {
                                    path: 'my-submissions/:pageId',
                                    name: 'my-submission-list',
                                    props: true,
                                    component: AppSubmitterSubmissionListPage,
                                },
                                {
                                    path: 'submission-history/:pageId',
                                    name: 'submission-history-list',
                                    props: true,
                                    component: AppSubmissionHistoryListPage,
                                },
                                {
                                    path: 'approvals/:pageId',
                                    name: 'approve-list',
                                    props: true,
                                    component: AppToBeApprovedSubmissionListPage,
                                },
                                {
                                    path: 'reports',
                                    name: 'app-reports',
                                    props: true,
                                    component: AppReportingPage,
                                },
                                {
                                    path: 'groups',
                                    name: 'group-list',
                                    props: true,
                                    component: GroupListPage,
                                },
                                {
                                    path: 'groups-manage',
                                    name: 'group-manage',
                                    props: true,
                                    component: GroupManagePage,
                                },
                                {
                                    path: 'user-manual',
                                    name: 'app-manual',
                                    props: true,
                                    component: AppManualPage,
                                },
                                {
                                    path: 'platebatches',
                                    name: 'platebatch-list',
                                    props: true,
                                    component: PlateBatchListPage,
                                },
                                {
                                    path: 'assignment-plans',
                                    name: 'assignment-plan-list',
                                    props: true,
                                    component: AppOperationAssignmentPlanListPage,
                                },
                                {
                                    path: 'assignments',
                                    name: 'assignment-list',
                                    props: true,
                                    component: AppOperationAssignmentListPage,
                                },
                                {
                                    path: 'assignments/:assignmentId/qrs',
                                    name: 'assignment-qr-list',
                                    props: true,
                                    component: AppOperationAssignmentQrListPage,
                                },
                                {
                                    path: 'my-assignments',
                                    name: 'my-assignment-list',
                                    props: true,
                                    component: AppOperationMyAssignmentListPage,
                                },
                                {
                                    path: 'my-assignments/:assignmentId/qrs',
                                    name: 'my-assignment-qr-list',
                                    props: true,
                                    component: AppOperationMyAssignmentQrListPage,
                                },
                            ]
                        },
                        {
                            path: 'groups/:groupId',
                            props: true,
                            component: GroupOperationBasePage,
                            children: [
                                {
                                    path: 'qrs',
                                    name: 'group-operation-qr-list',
                                    props: true,
                                    component: GroupOperationQrListPage,
                                },
                                {
                                    path: 'my-submissions/:pageId',
                                    name: 'group-operation-submitter-submission-list',
                                    props: true,
                                    component: GroupOperationSubmitterSubmissionListPage,
                                },
                                {
                                    path: 'submission-history/:pageId',
                                    name: 'group-operation-submission-history-list',
                                    props: true,
                                    component: GroupOperationSubmissionHistoryListPage,
                                },
                                {
                                    path: 'approvals/:pageId',
                                    name: 'group-operation-approve-list',
                                    props: true,
                                    component: GroupOperationToBeApprovedSubmissionListPage,
                                },
                                {
                                    path: 'reports',
                                    name: 'group-operation-reports',
                                    props: true,
                                    component: GroupOperationReportingPage,
                                },
                                {
                                    path: 'assignment-plans',
                                    name: 'group-assignment-plan-list',
                                    props: true,
                                    component: GroupOperationAssignmentPlanListPage,
                                },
                                {
                                    path: 'assignments',
                                    name: 'group-assignment-list',
                                    props: true,
                                    component: GroupOperationAssignmentListPage,
                                },
                                {
                                    path: 'assignments/:assignmentId/qrs',
                                    name: 'group-assignment-qr-list',
                                    props: true,
                                    component: GroupOperationAssignmentQrListPage,
                                },
                                {
                                    path: 'my-assignments',
                                    name: 'group-my-assignment-list',
                                    props: true,
                                    component: GroupOperationMyAssignmentListPage,
                                },
                                {
                                    path: 'my-assignments/:assignmentId/qrs',
                                    name: 'group-my-assignment-qr-list',
                                    props: true,
                                    component: GroupOperationMyAssignmentQrListPage,
                                },
                            ]
                        },
                        {
                            path: 'qrs/:qrId',
                            props: true,
                            component: QrOperationBasePage,
                            children: [
                                {
                                    path: 'workbench',
                                    name: 'qr-operation-workbench',
                                    props: true,
                                    component: QrOperationWorkbenchPage,
                                },
                                {
                                    path: 'my-submissions/:pageId',
                                    name: 'qr-operation-submitter-submission-list',
                                    props: true,
                                    component: QrOperationSubmitterSubmissionListPage,
                                },
                                {
                                    path: 'submission-history/:pageId',
                                    name: 'qr-operation-submission-history-list',
                                    props: true,
                                    component: QrOperationSubmissionHistoryListPage,
                                },
                                {
                                    path: 'approvals/:pageId',
                                    name: 'qr-operation-approve-list',
                                    props: true,
                                    component: QrOperationToBeApprovedSubmissionListPage,
                                },
                            ]
                        },

                    ]
                },

                {
                    path: '/apps/:appId/edit',
                    component: AppEditPage,
                    props: true,
                    children: [
                        {
                            path: '',
                            props: true,
                            name: 'app-edit-home',
                            component: PageEditPage,
                        },
                        {
                            path: 'settings',
                            name: 'app-edit-config',
                            component: AppSettingsPage,
                            meta: {name: '应用设置'}
                        },
                        {
                            path: 'circulations',
                            name: 'app-edit-circulation-settings',
                            component: CirculationStatusSettingPage,
                            meta: {name: '状态流转'}
                        },
                        {
                            path: 'attributes',
                            name: 'app-edit-attributes',
                            component: AttributeListPage,
                            meta: {name: '自定义属性'}
                        },
                        {
                            path: 'operation-menus',
                            name: 'app-edit-operation-menus',
                            component: OperationMenuItemListPage,
                            meta: {name: '运营菜单'}
                        },
                        {
                            path: 'plates',
                            name: 'app-edit-plates',
                            props: true,
                            component: PlateSettingEditPage,
                            meta: {name: '码牌设置'}
                        },
                        {
                            path: ':pageId',
                            name: 'app-edit-page',
                            props: true,
                            component: PageEditPage,
                        },
                    ]
                },
            ]
        },

        {
            path: '*',
            component: NotFoundPage
        }

    ]
})
