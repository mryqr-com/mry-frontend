import uuid from 'short-uuid';
import {cloneDeep} from 'lodash-es';
import {
    controlForegroundColor,
    defaultAppearanceStyle,
    defaultSolidBorder,
    fontStyle,
    noBorder,
    noBorderRadius,
    noShadow,
    primaryTextColor,
    regularTextColor,
    secondaryTextColor,
} from '@/console/app-edit/store/app-ui-defaults';
import {randomColors} from "@/common/utils/common-utils";

function newId() {
    return 'c_' + uuid.generate();
}

function defaultNameSetting() {
    return {
        hidden: false,
        position: 'TOP',
        textStyle: {
            fontStyle: fontStyle(15, true, primaryTextColor),
            alignType: "JUSTIFY",
            backgroundColor: null,
            lineHeight: 1.6,
            fullWidth: true,
            border: noBorder(),
            shadow: noShadow(),
            vPadding: 0,
            hPadding: 0,
            topMargin: 0,
            bottomMargin: 5,
            borderRadius: 0,
        }
    };
}

function defaultDescriptionStyle() {
    return {
        fontStyle: fontStyle(14, false, secondaryTextColor),
        alignType: "JUSTIFY",
        backgroundColor: null,
        lineHeight: 1.6,
        fullWidth: true,
        border: noBorder(),
        shadow: noShadow(),
        vPadding: 0,
        hPadding: 0,
        topMargin: 0,
        bottomMargin: 5,
        borderRadius: 0,
    };
}

function defaultFillableSetting(submissionSummaryEligible) {
    return {
        mandatory: false,
        autoFill: false,
        errorTips: null,
        submissionSummaryEligible: submissionSummaryEligible,
        fieldName: null,
    };
}

function defaultControlStyleSetting() {
    return {
        topMargin: 25,
        bottomMargin: 25,
        backgroundColor: null,
        borderRadius: noBorderRadius(),
        shadow: {
            width: 0,
            color: 'rgba(0, 0, 0, 0.15)'
        },
        border: noBorder(),
        vPadding: 0,
        hPadding: 0,
    };
}

function defaultControlButtonStyle() {
    return {
        fontStyle: fontStyle(14, false, primaryTextColor),
        backgroundColor: "#edf1f8",
        border: defaultSolidBorder(),
        shadow: noShadow(),
        vPadding: 10,
        borderRadius: 0,
    };
}

export default {
    cloneControl(control) {
        let clone = cloneDeep(control);
        clone.name = `(复制)${clone.name}`;
        clone.id = newId();
        return clone;
    },

    SECTION_TITLE() {
        return {
            id: newId(),
            type: "SECTION_TITLE",
            name: "分段标题",
            nameSetting: {
                hidden: false,
                position: 'TOP',
                textStyle: {
                    fontStyle: fontStyle(24, true, primaryTextColor),
                    alignType: "CENTER",
                    lineHeight: 1,
                    fullWidth: false,
                    backgroundColor: null,
                    border: noBorder(),
                    shadow: noShadow(),
                    vPadding: 0,
                    hPadding: 0,
                    topMargin: 0,
                    bottomMargin: 0,
                    borderRadius: 0,
                }
            },
            description: null,
            descriptionStyle: {
                fontStyle: fontStyle(14, false, secondaryTextColor),
                alignType: "CENTER",
                backgroundColor: null,
                lineHeight: 1.6,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 0,
                topMargin: 10,
                bottomMargin: 0,
                borderRadius: 0,
            },
            styleSetting: defaultControlStyleSetting(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
        };
    },

    SEPARATOR() {
        return {
            id: newId(),
            type: "SEPARATOR",
            name: "分隔符",
            nameSetting: {
                hidden: true,
                position: 'TOP',
                textStyle: {
                    fontStyle: fontStyle(24, true, primaryTextColor),
                    alignType: "CENTER",
                    lineHeight: 1,
                    fullWidth: false,
                    backgroundColor: null,
                    border: noBorder(),
                    shadow: noShadow(),
                    vPadding: 0,
                    hPadding: 0,
                    topMargin: 0,
                    bottomMargin: 0,
                    borderRadius: 0,
                }
            },
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            styleSetting: {
                topMargin: 50,
                bottomMargin: 50,
                backgroundColor: null,
                borderRadius: noBorderRadius(),
                shadow: {
                    width: 0,
                    color: 'rgba(0, 0, 0, 0.15)'
                },
                border: noBorder(),
                vPadding: 0,
                hPadding: 0,
            },
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,

            //control specific settings:
            separatorType: 'DASHED',
            text: '分隔符',
            fontStyle: fontStyle(14, false, regularTextColor),
            widthRatio: 100,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
        }
    },

    PARAGRAPH() {
        return {
            id: newId(),
            type: "PARAGRAPH",
            name: "段落文本",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            styleSetting: defaultControlStyleSetting(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,

            //control specific settings:
            content: null,
            markdownStyle: {
                fontStyle: fontStyle(14, false, regularTextColor),
                lineHeight: 1.8,
            }
        }
    },

    RICH_TEXT() {
        return {
            id: newId(),
            type: "RICH_TEXT",
            name: "富文本",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            styleSetting: defaultControlStyleSetting(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,

            //control specific settings:
            content: null,
        }
    },

    IMAGE_VIEW() {
        return {
            id: newId(),
            type: "IMAGE_VIEW",
            name: "图片展示",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            styleSetting: defaultControlStyleSetting(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,

            //control specific settings:
            images: [],
            widthRatio: 100,
            showImageName: true,
            verticalMargin: 25,
            border: noBorder(),
            shadow: noShadow(),
            borderRadius: 0,
        }
    },

    VIDEO_VIEW() {
        return {
            id: newId(),
            type: "VIDEO_VIEW",
            name: "视频展示",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            videos: [],
            poster: null,
            borderRadius: 0,
        }
    },

    IMAGE_CARD_LINK() {
        return {
            id: newId(),
            type: "IMAGE_CARD_LINK",
            name: "图卡链接",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            showBasedOnPermission: true,
            textOverImage: false,
            links: [],
            imageAspectRatio: 150,
            gutter: 25,
            countPerRow: 1,
            linkNameTextStyle: {
                fontStyle: fontStyle(14, true, primaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1.6,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 10,
                topMargin: 15,
                bottomMargin: 5,
                borderRadius: 0,
            },
            linkDescriptionTextStyle: {
                fontStyle: fontStyle(13, false, secondaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1.6,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 15,
                topMargin: 0,
                bottomMargin: 15,
                borderRadius: 0,
            },
            appearanceStyle: defaultAppearanceStyle(0, 0),
        }
    },

    BUTTON_PAGE_LINK() {
        return {
            id: newId(),
            type: "BUTTON_PAGE_LINK",
            name: "按钮链接",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            styleType: 'PURE_BUTTON',
            links: [],
            nameTextStyle: {
                fontStyle: fontStyle(15, true, primaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 0,
                topMargin: 0,
                bottomMargin: 0,
                borderRadius: 0,
            },
            descriptionTextStyle: {
                fontStyle: fontStyle(13, false, secondaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1.6,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 0,
                topMargin: 10,
                bottomMargin: 0,
                borderRadius: 0,
            },
            buttonTextStyle: defaultControlButtonStyle(),
            cardButtonTextStyle: {
                fontStyle: fontStyle(14, false, primaryTextColor),
                backgroundColor: "#edf1f8",
                border: defaultSolidBorder(),
                shadow: noShadow(),
                vPadding: 6,
                borderRadius: 0,
            },
            linkPerLine: 1,
            gutter: 15,
            linkImageSize: 30,
            showBasedOnPermission: false,
            appearanceStyle: defaultAppearanceStyle(),
        }
    },

    ICON_PAGE_LINK() {
        return {
            id: newId(),
            type: "ICON_PAGE_LINK",
            name: "图标链接",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            links: [],
            iconWidth: 60,
            numberPerRow: 4,
            textIconSpace: 5,
            rowGutter: 25,
            fontStyle: fontStyle(14, false, primaryTextColor),
            showBasedOnPermission: false,
            appearanceStyle: {
                backgroundColor: null,
                borderRadius: 0,
                shadow: {
                    width: 0,
                    color: 'rgba(0, 0, 0, 0.15)'
                },
                border: noBorder(),
                vPadding: 0,
                hPadding: 0,
            },
        }
    },

    ATTACHMENT_VIEW() {
        return {
            id: newId(),
            type: "ATTACHMENT_VIEW",
            name: "附件查看",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            attachments: [],
            fileNameStyle: {
                fontStyle: fontStyle(15, false, primaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1.6,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 0,
                topMargin: 0,
                bottomMargin: 0,
                borderRadius: 0,
            },
            appearanceStyle: defaultAppearanceStyle(),
        }
    },

    INSTANCE_LIST() {
        return {
            id: newId(),
            type: "INSTANCE_LIST",
            name: "实例列表",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            max: 20,
            showCreatedAt: true,
            showCreator: false,
            showSeparator: true,
            rowGutter: 20,
        }
    },

    SUBMIT_HISTORY() {
        return {
            id: newId(),
            type: "SUBMIT_HISTORY",
            name: "提交历史",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            pageIds: [],
            appearanceStyle: defaultAppearanceStyle(10, 15),
            max: 10,
            showSubmitter: true,
            showPageName: true,
            hideControlIfNoData: false,
            orderByAsc: false
        }
    },

    ANSWER_REFERENCE() {
        return {
            id: newId(),
            type: "ANSWER_REFERENCE",
            name: "答案引用",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),


            //control specific settings:
            hideControlIfNoData: false,
            textAnswerStyle: {
                textStyle: {
                    fontStyle: fontStyle(15, false, primaryTextColor),
                    alignType: "CENTER",
                    backgroundColor: controlForegroundColor,
                    lineHeight: 1.6,
                    fullWidth: true,
                    border: noBorder(),
                    shadow: {
                        width: 8,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    vPadding: 40,
                    hPadding: 15,
                    topMargin: 0,
                    bottomMargin: 0,
                    borderRadius: 0,
                }
            },

            markdownAnswerStyle: {
                markdownStyle: {
                    fontStyle: fontStyle(14, false, regularTextColor),
                    lineHeight: 1.6,
                }
            },

            imageAnswerStyle: {
                widthRatio: 100,
                showImageName: true,
                verticalMargin: 15,
                border: noBorder(),
                shadow: noShadow(),
                borderRadius: 0,
            },

            fileAnswerStyle: {
                fileNameStyle: {
                    fontStyle: fontStyle(15, false, primaryTextColor),
                    alignType: "CENTER",
                    backgroundColor: null,
                    lineHeight: 1.6,
                    fullWidth: true,
                    border: noBorder(),
                    shadow: noShadow(),
                    vPadding: 0,
                    hPadding: 0,
                    topMargin: 0,
                    bottomMargin: 0,
                    borderRadius: 0,
                },
                appearanceStyle: defaultAppearanceStyle(),
            },

            videoAnswerStyle: {
                showFileName: false,
                borderRadius: 0,
            },

            audioAnswerStyle: {
                showFileName: false,
                borderRadius: 0,
            },
        }
    },

    SUBMISSION_REFERENCE() {
        return {
            id: newId(),
            type: "SUBMISSION_REFERENCE",
            name: "表单引用",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            pageId: null,
            stripped: false,
            hideControlIfNoData: false,
            styleType: 'HORIZONTAL_TABLE',
            keyFontStyle: fontStyle(14, false, regularTextColor),
            valueFontStyle: fontStyle(14, false, primaryTextColor),
            showHeader: false,
            headerText: '未命名表头',
            headerFontStyle: fontStyle(15, true, primaryTextColor),
            verticalKeyStyle: {
                fontStyle: fontStyle(14, false, secondaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 0,
                topMargin: 0,
                bottomMargin: 5,
                borderRadius: 0,
            },
            verticalValueStyle: {
                fontStyle: fontStyle(16, false, primaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1.6,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 0,
                topMargin: 0,
                bottomMargin: 0,
                borderRadius: 0,
            },
            appearanceStyle: defaultAppearanceStyle(),
        }
    },

    ATTRIBUTE_TABLE() {
        return {
            id: newId(),
            type: "ATTRIBUTE_TABLE",
            name: "属性表格",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            attributeIds: [],
            styleType: 'HORIZONTAL_TABLE',
            hideControlIfNoData: false,
            keyFontStyle: fontStyle(14, false, regularTextColor),
            valueFontStyle: fontStyle(14, false, primaryTextColor),
            showHeader: false,
            headerText: '未命名表头',
            headerFontStyle: fontStyle(15, true, primaryTextColor),
            stripped: false,
            verticalKeyStyle: {
                fontStyle: fontStyle(14, false, secondaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 0,
                topMargin: 0,
                bottomMargin: 5,
                borderRadius: 0,
            },
            verticalValueStyle: {
                fontStyle: fontStyle(16, false, primaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1.6,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 0,
                hPadding: 0,
                topMargin: 0,
                bottomMargin: 0,
                borderRadius: 0,
            },
            appearanceStyle: defaultAppearanceStyle(),
        }
    },

    ATTRIBUTE_DASHBOARD() {
        return {
            id: newId(),
            type: "ATTRIBUTE_DASHBOARD",
            name: "属性表盘",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            attributeIds: [],
            hideControlIfNoData: false,
            itemsPerLine: 2,
            gutter: 15,
            itemTitlePosition: 'TOP',
            appearanceStyle: defaultAppearanceStyle(),
            titleStyle: {
                fontStyle: fontStyle(13, false, secondaryTextColor),
                alignType: "JUSTIFY",
                backgroundColor: null,
                lineHeight: 1,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 10,
                hPadding: 0,
                topMargin: 0,
                bottomMargin: 0,
                borderRadius: 0,
            },
            contentStyle: {
                fontStyle: fontStyle(15, false, primaryTextColor),
                alignType: "CENTER",
                backgroundColor: null,
                lineHeight: 1.6,
                fullWidth: true,
                border: noBorder(),
                shadow: noShadow(),
                vPadding: 5,
                hPadding: 0,
                topMargin: 0,
                bottomMargin: 15,
                borderRadius: 0,
            },
        }
    },

    TREND() {
        return {
            id: newId(),
            type: "TREND",
            name: "趋势图",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            trendItems: [],
            range: 'NO_LIMIT',
            xTitle: null,
            yTitle: null,
            bezier: true,
            hideGrid: false,
            sizeRatio: 100,
            showNumber: false,
            maxPoints: 100,
            colors: ['#FF8C00', '#00bfff'],
            hideControlIfNoData: false
        }
    },

    BAR() {
        return {
            id: newId(),
            type: "BAR",
            name: "条形图",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            segmentType: 'SUBMIT_COUNT_SUM',
            pageId: null,
            basedControlId: null,
            targetControlIds: [],
            range: 'NO_LIMIT',
            max: 10,
            xTitle: null,
            yTitle: null,
            horizontal: false,
            colors: ['#FF8C00', '#00bfff'],
            sizeRatio: 100,
            addressPrecisionType: 'CITY',
            hideGrid: false,
            hideControlIfNoData: false,
            showNumber: true,
            multiLevelSelectionPrecisionType: 'LEVEL1',
        }
    },

    PIE() {
        return {
            id: newId(),
            type: "PIE",
            name: "饼状图",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            segmentType: 'SUBMIT_COUNT_SUM',
            pageId: null,
            basedControlId: null,
            targetControlId: null,
            range: 'NO_LIMIT',
            max: 8,
            sizeRatio: 80,
            addressPrecisionType: 'CITY',
            hideControlIfNoData: false,
            showPercentage: true,
            showValue: false,
            showLabels: true,
            multiLevelSelectionPrecisionType: 'LEVEL1',
            colors: randomColors(),
        }
    },

    DOUGHNUT() {
        return {
            id: newId(),
            type: "DOUGHNUT",
            name: "圆环图",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            segmentType: 'SUBMIT_COUNT_SUM',
            pageId: null,
            basedControlId: null,
            targetControlId: null,
            range: 'NO_LIMIT',
            max: 8,
            sizeRatio: 80,
            addressPrecisionType: 'CITY',
            hideControlIfNoData: false,
            showPercentage: true,
            showValue: false,
            showCenterTotal: false,
            showLabels: true,
            multiLevelSelectionPrecisionType: 'LEVEL1',
            colors: randomColors(),
        }
    },

    TIME_SEGMENT() {
        return {
            id: newId(),
            type: "TIME_SEGMENT",
            name: "分时统计",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            segmentSettings: [],
            interval: 'PER_MONTH',
            xTitle: null,
            yTitle: null,
            horizontal: false,
            hideGrid: false,
            colors: ['#FF8C00', '#00bfff'],
            max: 6,
            sizeRatio: 100,
            hideControlIfNoData: false,
            showNumber: true,
        }
    },

    NUMBER_RANGE_SEGMENT() {
        return {
            id: newId(),
            type: "NUMBER_RANGE_SEGMENT",
            name: "值域分布",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: null,
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            segmentType: 'SUBMIT_COUNT_SUM',
            pageId: null,
            basedControlId: null,
            targetControlId: null,
            range: 'NO_LIMIT',
            xTitle: null,
            yTitle: null,
            sizeRatio: 100,
            hideControlIfNoData: false,
            hideGrid: false,
            color: '#FF8C00',
            showNumber: true,
            numberRangesString: null,
        }
    },


    RADIO() {
        return {
            id: newId(),
            type: "RADIO",
            name: "单选框",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            options: [
                {
                    id: uuid.generate(),
                    name: "选项一"
                },
                {
                    id: uuid.generate(),
                    name: "选项二"
                }
            ]
        }
    },

    CHECKBOX() {
        return {
            id: newId(),
            type: "CHECKBOX",
            name: "多选框",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            options: [
                {
                    id: uuid.generate(),
                    name: "选项一"
                },
                {
                    id: uuid.generate(),
                    name: "选项二"
                }
            ],

            minMaxSetting: {
                min: 0,
                max: 20,
            },
        }
    },

    SINGLE_LINE_TEXT() {
        return {
            id: newId(),
            type: "SINGLE_LINE_TEXT",
            name: "单行文本",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            minMaxSetting: {
                min: 0,
                max: 50,
            },
        };
    },

    PERSON_NAME() {
        return {
            id: newId(),
            type: "PERSON_NAME",
            name: "姓名",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
        }
    },

    MULTI_LINE_TEXT() {
        return {
            id: newId(),
            type: "MULTI_LINE_TEXT",
            name: "多行文本",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(false),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            rows: 3,
            minMaxSetting: {
                min: 0,
                max: 10000,
            },
        };
    },

    RICH_TEXT_INPUT() {
        return {
            id: newId(),
            type: "RICH_TEXT_INPUT",
            name: "富文本输入",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(false),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            minMaxSetting: {
                min: 0,
                max: 50000,
            },
        };
    },

    DROPDOWN() {
        return {
            id: newId(),
            type: "DROPDOWN",
            name: "下拉框",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            multiple: false,
            filterable: false,
            options: [
                {
                    id: uuid.generate(),
                    name: "选项一"
                },
                {
                    id: uuid.generate(),
                    name: "选项二"
                }
            ],
            minMaxSetting: {
                min: 0,
                max: 10,
            },
        }
    },

    MEMBER_SELECT() {
        return {
            id: newId(),
            type: "MEMBER_SELECT",
            name: "成员选择",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            multiple: false,
            filterable: true,
            minMaxSetting: {
                min: 0,
                max: 10,
            },
        }
    },

    FILE_UPLOAD() {
        return {
            id: newId(),
            type: "FILE_UPLOAD",
            name: "文件上传",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(false),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            nameEditable: false,
            sortable: false,
            max: 1,
            perMaxSize: 20,
            category: "IMAGE",
            buttonText: '添加文件',
            buttonStyle: defaultControlButtonStyle(),
        }
    },

    IMAGE_UPLOAD() {
        return {
            id: newId(),
            type: "IMAGE_UPLOAD",
            name: "图片上传",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(false),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            nameEditable: false,
            sortable: false,
            onlyOnSite: false,
            max: 3,
            compressType: "MEDIUM",
            buttonText: '添加图片',
            buttonStyle: defaultControlButtonStyle(),
        }
    },

    ADDRESS() {
        return {
            id: newId(),
            type: "ADDRESS",
            name: "省市地址",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            positionable: false,
            precision: 4
        }
    },

    GEOLOCATION() {
        return {
            id: newId(),
            type: "GEOLOCATION",
            name: "定位",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            allowRandomPosition: false,
            buttonStyle: defaultControlButtonStyle(),
            offsetRestrictionEnabled: false,
            offsetRestrictionRadius: 500
        }
    },

    NUMBER_INPUT() {
        return {
            id: newId(),
            type: "NUMBER_INPUT",
            name: "数字",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            precision: 0,
            minMaxSetting: {
                min: 0,
                max: 1000000,
            },
            suffix: null,
            autoCalculateEnabled: false,
            autoCalculateSetting: {
                aliasContext: {
                    controlAliases: [],
                },
                expression: null,
            }
        }
    },

    NUMBER_RANKING() {
        return {
            id: newId(),
            type: "NUMBER_RANKING",
            name: "五星打分",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            max: 10
        }
    },

    MOBILE() {
        return {
            id: newId(),
            type: "MOBILE",
            name: "手机",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            uniqueType: 'NONE',
        }
    },

    IDENTIFIER() {
        return {
            id: newId(),
            type: "IDENTIFIER",
            name: "编号标识",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            uniqueType: 'NONE',
            minMaxSetting: {
                min: 0,
                max: 50,
            },
            identifierFormatType: 'NONE',
            formatRegex: null,
        }
    },

    EMAIL() {
        return {
            id: newId(),
            type: "EMAIL",
            name: "邮箱",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            uniqueType: 'NONE',
        }
    },

    DATE() {
        return {
            id: newId(),
            type: "DATE",
            name: "日期",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            defaultToToday: false,
        }
    },

    TIME() {
        return {
            id: newId(),
            type: "TIME",
            name: "时间",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            placeholder: null,
            defaultToNow: false,
        }
    },

    ITEM_COUNT() {
        return {
            id: newId(),
            type: "ITEM_COUNT",
            name: "物品明细",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            options: [
                {
                    id: uuid.generate(),
                    name: "物品一",
                },
                {
                    id: uuid.generate(),
                    name: "物品二",
                }],
            maxItem: 10,
            maxNumberPerItem: 100,
            buttonText: '新增',
            buttonStyle: defaultControlButtonStyle(),
        }
    },

    ITEM_STATUS() {
        return {
            id: newId(),
            type: "ITEM_STATUS",
            name: "状态选择",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            options: [
                {
                    id: uuid.generate(),
                    name: "状态一",
                    color: null
                },
                {
                    id: uuid.generate(),
                    name: "状态二",
                    color: null
                }],
            placeholder: null,
            initialOptionId: null,
            autoCalculateEnabled: false,
            autoCalculateSetting: {
                aliasContext: {
                    controlAliases: [],
                },
                records: [],
            }
        }
    },

    POINT_CHECK() {
        return {
            id: newId(),
            type: "POINT_CHECK",
            name: "点检",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            options: [
                {
                    id: uuid.generate(),
                    name: "选项一"
                },
                {
                    id: uuid.generate(),
                    name: "选项二"
                }]
        }
    },


    SIGNATURE() {
        return {
            id: newId(),
            type: "SIGNATURE",
            name: "电子签名",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(false),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            buttonText: '签名',
            buttonStyle: defaultControlButtonStyle(),
        }
    },

    MULTI_LEVEL_SELECTION() {
        return {
            id: newId(),
            type: "MULTI_LEVEL_SELECTION",
            name: "多级下拉",
            nameSetting: defaultNameSetting(),
            description: null,
            descriptionStyle: defaultDescriptionStyle(),
            fillableSetting: defaultFillableSetting(true),
            permissionEnabled: false,
            permission: 'CAN_MANAGE_APP',
            submitterViewable: false,
            styleSetting: defaultControlStyleSetting(),

            //control specific settings:
            titleText: null,
            optionText: null,
            filterable: false,
        }
    },

};