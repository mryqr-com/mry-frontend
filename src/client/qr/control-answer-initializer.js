import controlTypes from '@/common/utils/control-types';
import {formatDateToDate} from "@/common/utils/common-utils";

export default {
    [controlTypes.RADIO.type](control, originalAnswer) {
        let initOptionId;

        if (originalAnswer) {
            if (control.options.map(o => o.id).includes(originalAnswer.optionId)) {
                initOptionId = originalAnswer.optionId;
            }
        }

        return {
            controlId: control.id,
            controlType: controlTypes.RADIO.type,
            optionId: initOptionId
        }
    },

    [controlTypes.CHECKBOX.type](control, originalAnswer) {
        let initOptionIds = [];

        if (originalAnswer) {
            let availableOptionIds = control.options.map(o => o.id);
            initOptionIds = originalAnswer.optionIds.filter(id => availableOptionIds.includes(id));
        }

        return {
            controlId: control.id,
            controlType: controlTypes.CHECKBOX.type,
            optionIds: initOptionIds
        }
    },

    [controlTypes.SINGLE_LINE_TEXT.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.SINGLE_LINE_TEXT.type,
            content: null
        }
    },

    [controlTypes.PERSON_NAME.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.PERSON_NAME.type,
            name: null
        }
    },

    [controlTypes.IDENTIFIER.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.IDENTIFIER.type,
            content: null
        }
    },

    [controlTypes.MULTI_LINE_TEXT.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.MULTI_LINE_TEXT.type,
            content: null
        }
    },

    [controlTypes.RICH_TEXT_INPUT.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.RICH_TEXT_INPUT.type,
            content: null
        }
    },

    [controlTypes.DROPDOWN.type](control, originalAnswer) {
        let initOptionIds = [];

        if (originalAnswer) {
            let availableOptionIds = control.options.map(o => o.id);
            initOptionIds = originalAnswer.optionIds.filter(id => availableOptionIds.includes(id));
        }

        return {
            controlId: control.id,
            controlType: controlTypes.DROPDOWN.type,
            optionIds: initOptionIds
        }
    },

    [controlTypes.MEMBER_SELECT.type](control, originalAnswer) {
        let memberIds = [];

        if (originalAnswer) {
            memberIds = originalAnswer.memberIds;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.MEMBER_SELECT.type,
            memberIds: memberIds
        }
    },

    [controlTypes.FILE_UPLOAD.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.FILE_UPLOAD.type,
            files: []
        }
    },

    [controlTypes.IMAGE_UPLOAD.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.IMAGE_UPLOAD.type,
            images: []
        }
    },

    [controlTypes.SIGNATURE.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.SIGNATURE.type,
            signature: null,
        }
    },

    [controlTypes.NUMBER_INPUT.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.NUMBER_INPUT.type,
            number: null
        }
    },

    [controlTypes.NUMBER_RANKING.type](control, originalAnswer) {
        let rank = 0;
        if (originalAnswer) {
            rank = originalAnswer.rank;
        }

        if (rank > control.max) {
            rank = control.max;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.NUMBER_RANKING.type,
            rank: rank
        }
    },

    [controlTypes.MOBILE.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.MOBILE.type,
            mobileNumber: null
        }
    },

    [controlTypes.EMAIL.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.EMAIL.type,
            email: null
        }
    },

    [controlTypes.DATE.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.DATE.type,
            date: control.defaultToToday ? formatDateToDate(new Date()) : null,
        }
    },

    [controlTypes.TIME.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        let now = new Date();
        let minutes = now.getMinutes();
        let hours = now.getHours();

        return {
            controlId: control.id,
            controlType: controlTypes.TIME.type,
            time: control.defaultToNow ? `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}` : null,
        }
    },

    [controlTypes.ITEM_STATUS.type](control, originalAnswer) {
        let init;

        if (originalAnswer) {
            if (control.options.map(o => o.id).includes(originalAnswer.optionId)) {
                init = originalAnswer.optionId;
            }
        }

        return {
            controlId: control.id,
            controlType: controlTypes.ITEM_STATUS.type,
            optionId: init
        }
    },

    [controlTypes.ITEM_COUNT.type](control, originalAnswer) {
        let initItems = [];

        if (originalAnswer) {
            let availableOptionIds = control.options.map(o => o.id);
            initItems = originalAnswer.items.filter(o => availableOptionIds.includes(o.optionId));
        }

        return {
            controlId: control.id,
            controlType: controlTypes.ITEM_COUNT.type,
            items: initItems,
        }
    },

    [controlTypes.POINT_CHECK.type](control, originalAnswer) {
        let checks = {};
        control.options.forEach(o => {
            checks[o.id] = 'NONE'
        });

        if (originalAnswer) {
            Object.keys(checks).forEach(key => {
                if (originalAnswer.checks[key]) {
                    checks[key] = originalAnswer.checks[key];
                }
            })
        }

        return {
            controlId: control.id,
            controlType: controlTypes.POINT_CHECK.type,
            checks: checks
        }
    },


    [controlTypes.GEOLOCATION.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.GEOLOCATION.type,
            geolocation: {
                point: {
                    longitude: null,
                    latitude: null
                },
                address: {
                    province: null,
                    city: null,
                    district: null,
                    address: null
                },
                note: null
            },
        }
    },

    [controlTypes.ADDRESS.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.ADDRESS.type,
            address: {
                province: null,
                city: null,
                district: null,
                address: null
            }
        }
    },

    [controlTypes.MULTI_LEVEL_SELECTION.type](control, originalAnswer) {
        if (originalAnswer) {
            return originalAnswer;
        }

        return {
            controlId: control.id,
            controlType: controlTypes.MULTI_LEVEL_SELECTION.type,
            selection: {
                level1: null,
                level2: null,
                level3: null,
            }
        }
    },
}