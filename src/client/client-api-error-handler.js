import {Message} from 'element-ui';
import router from '@/client/client-router';
import {displayErrorMessage} from '@/common/utils/common-utils';

function isInitialRenderError(info) {
    if (!info) {
        return false;
    }

    return info.includes('created hook') || info.includes('mounted hook');
}

export function handleApiError(error, info) {
    console.error('API error:', error);

    let status = error.status;
    switch (status) {
        case 400: {
            Message.error({
                message: "请求数据验证失败！",
                center: true
            });
            return;
        }

        case 401: {
            router.replace({name: 'login', query: {from: location.href}});
            return;
        }

        case 403: {
            if (isInitialRenderError(info)) {
                displayErrorMessage(403, '权限不足，无法访问');
            } else {
                Message.error({
                    message: "权限不足！",
                    center: true
                });
            }
            return;
        }

        case 404: {
            if (isInitialRenderError(info)) {
                displayErrorMessage(404, '未找到相应资源');
            } else {
                Message.error({
                    message: "未找到相应资源！",
                    center: true
                });
            }
            return;
        }

        case 409: {
            const userMessage = error.userMessage ? error.userMessage : '出错了';
            if (isInitialRenderError(info)) {
                displayErrorMessage(null, userMessage);
            } else {
                Message.error({
                    message: userMessage,
                    center: true
                });
            }
            return;
        }

        //426表示套餐检查失败
        case 426: {
            Message.warning({
                message: error.userMessage,
                center: true
            });
            return;
        }

        //429流量过大
        case 429: {
            if (isInitialRenderError(info)) {
                displayErrorMessage(null, '当前请求量过大，请稍后重试。');
            } else {
                Message.error({
                    message: '当前请求量过大，请稍后重试。',
                    center: true
                });
            }
            return;
        }

        default: {
            if (isInitialRenderError(info)) {
                displayErrorMessage(null, '抱歉，系统出现错误！');
            } else {
                Message.error({
                    message: "抱歉，系统出现错误！",
                    center: true
                });
            }
            return;
        }
    }

}
