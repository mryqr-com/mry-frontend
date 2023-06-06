import uuid from 'short-uuid';
import {fontStyle, noBorder, noShadow, primaryTextColor, primaryThemeColor, regularTextColor} from '@/console/app-edit/store/app-ui-defaults';

export default {
    createPage(name) {
        return {
            id: 'p_' + uuid.generate(),
            header: {
                type: "INHERITED",
                showImage: false,
                image: null,
                imageCropType: 'FOUR_TO_THREE',
                showText: false,
                text: "抬头文字",
                textStyle: {
                    fontStyle: fontStyle(14, false, primaryTextColor),
                    alignType: "JUSTIFY",
                    backgroundColor: null,
                    lineHeight: 1.4,
                    fullWidth: true,
                    border: noBorder(),
                    shadow: noShadow(),
                    vPadding: 10,
                    hPadding: 10,
                    topMargin: 0,
                    bottomMargin: 0,
                    borderRadius: 0,
                },
                logoImage: null,
                logoHeight: 36,
                logoAlign: 'MIDDLE'
            },
            title: {
                text: name,
                textStyle: {
                    fontStyle: fontStyle(20, true, primaryTextColor),
                    alignType: "CENTER",
                    backgroundColor: null,
                    lineHeight: 1.4,
                    fullWidth: true,
                    border: noBorder(),
                    shadow: noShadow(),
                    vPadding: 0,
                    hPadding: 0,
                    topMargin: 30,
                    bottomMargin: 20,
                    borderRadius: 0,
                },
                description: null,
                descriptionStyle: {
                    fontStyle: fontStyle(14, false, regularTextColor),
                    lineHeight: 1.8,
                },
            },
            controls: [],
            submitButton: {
                text: "提交",
                buttonStyle: {
                    fontStyle: fontStyle(14, true, "rgba(255, 255, 255, 1)"),
                    backgroundColor: primaryThemeColor,
                    border: noBorder(),
                    shadow: noShadow(),
                    vPadding: 10,
                    borderRadius: 0,
                }
            },
            setting: {
                submitType: "NEW",
                permission: "AS_TENANT_MEMBER",
                modifyPermission: "CAN_MANAGE_APP",
                submitterUpdatable: false,
                submitterUpdateRange: 'IN_1_DAY',
                approvalSetting: {
                    approvalEnabled: false,
                    permission: 'CAN_MANAGE_APP',
                    passText: '通过',
                    notPassText: '不通过',
                    notifySubmitter: false,
                },
                notificationSetting: {
                    notificationEnabled: false,
                    onCreateNotificationRoles: [],
                    onUpdateNotificationRoles: [],
                },
                submissionWebhookTypes: [],
                pageName: name,
                submitterAlias: null,
                submitAtAlias: null,
                actionName: null,
                showAsterisk: true,
                showControlIndex: false,
                hideProfileButton: false,
                hideTopBottomBlank: false,
                hideTopBar: false,
                hideHeader: false,
                hideTitle: false,
                hideMenu: false,
                pageMaxWidth: 650,
                contentMaxWidth: 650,
                pageBackgroundColor: 'rgba(255, 255, 255, 1)',
                shadow: {
                    width: 8,
                    color: 'rgba(0, 0, 0, .1)'
                },
                border: noBorder(),
                viewPortBackgroundColor: null,
                viewPortBackgroundImage: null,
                afterSubmitBehaviour: {
                    type: 'DEFAULT',
                    internalPageId: null,
                    externalUrl: null,
                    enableMessage: true,
                    message: '提交成功！',
                }
            }
        }
    },

};