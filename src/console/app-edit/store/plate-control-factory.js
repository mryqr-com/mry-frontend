import uuid from 'short-uuid';
import {noBorder, noBorderRadius} from '@/console/app-edit/store/app-ui-defaults';

export default {
    SINGLE_ROW_TEXT() {
        return {
            id: uuid.generate(),
            type: 'SINGLE_ROW_TEXT',
            backgroundColor: null,
            borderRadius: noBorderRadius(),
            border: noBorder(),
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            textValue: {
                type: 'FIXED_TEXT',
                text: '未命名',
                attributeId: null,
                propertyType: null,
            },
            fontStyle: {
                fontFamily: "黑体",
                fontSize: 18,
                bold: false,
                italic: false,
                color: "rgba(48, 49, 51, 1)",
            },
            alignType: 'JUSTIFY',
            logoImage: null,
            logoHeight: 40,
            letterSpacing: 0,
            height: 40,
            logoTextSpacing: 10,
        }
    },

    QR_IMAGE() {
        return {
            id: uuid.generate(),
            type: 'QR_IMAGE',
            backgroundColor: null,
            borderRadius: noBorderRadius(),
            border: noBorder(),
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            setting: {
                logo: null,
                width: 200,
                color: '#000000',
                margin: 2,
            },
            alignType: 'CENTER',
        }
    },

    TABLE() {
        return {
            id: uuid.generate(),
            type: 'TABLE',
            backgroundColor: null,
            borderRadius: noBorderRadius(),
            border: noBorder(),
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            headerEnabled: true,
            headerTextValue: {
                type: 'FIXED_TEXT',
                text: '未命名标题',
                attributeId: null,
                propertyType: null,
            },
            headerFontStyle: {
                fontFamily: "黑体",
                fontSize: 20,
                bold: true,
                italic: false,
                color: "#000000",
            },
            headerHeight: 50,
            headerAlignType: 'CENTER',
            contentTextValues: [
                {
                    id: uuid.generate(),
                    name: "名称",
                    value: {
                        type: 'QR_PROPERTY',
                        text: null,
                        attributeId: null,
                        propertyType: 'QR_NAME',
                    }
                },
                {
                    id: uuid.generate(),
                    name: "ID",
                    value: {
                        type: 'QR_PROPERTY',
                        text: null,
                        attributeId: null,
                        propertyType: 'QR_ID',
                    }
                },
                {
                    id: uuid.generate(),
                    name: "编号",
                    value: {
                        type: 'QR_PROPERTY',
                        text: null,
                        attributeId: null,
                        propertyType: 'QR_CUSTOM_ID',
                    }
                },
            ],
            cellHeight: 36,
            borderWidth: 1,
            borderColor: '#000000',
            contentFontStyle: {
                fontFamily: "黑体",
                fontSize: 14,
                bold: false,
                italic: false,
                color: "#000000",
            },
            qrEnabled: true,
            qrImageSetting: {
                logo: null,
                width: 100,
                color: '#000000',
                margin: 2,
            },
            qrRows: 3,
        }
    },

    KEY_VALUE() {
        return {
            id: uuid.generate(),
            type: 'KEY_VALUE',
            backgroundColor: null,
            borderRadius: noBorderRadius(),
            border: noBorder(),
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            textValues: [
                {
                    id: uuid.generate(),
                    name: "名称",
                    value: {
                        type: 'QR_PROPERTY',
                        text: null,
                        attributeId: null,
                        propertyType: 'QR_NAME',
                    }
                },

                {
                    id: uuid.generate(),
                    name: "编号",
                    value: {
                        type: 'QR_PROPERTY',
                        text: null,
                        attributeId: null,
                        propertyType: 'QR_CUSTOM_ID',
                    }
                },
            ],
            fontStyle: {
                fontFamily: "黑体",
                fontSize: 15,
                bold: false,
                italic: false,
                color: "rgba(48, 49, 51, 1)",
            },
            lineHeight: 30,
            textHorizontalAlignType: 'JUSTIFY',
            verticalAlignType: 'MIDDLE',
            horizontalPositionType: 'RIGHT',
            horizontalGutter: 0,
            qrEnabled: true,
            qrImageSetting: {
                logo: null,
                width: 100,
                color: '#000000',
                margin: 2,
            },
        }
    },

    HEADER_IMAGE() {
        return {
            id: uuid.generate(),
            type: 'HEADER_IMAGE',
            backgroundColor: null,
            borderRadius: noBorderRadius(),
            border: noBorder(),
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            width: 100,
            height: 120,
            alignType: 'JUSTIFY',
        }
    },
}