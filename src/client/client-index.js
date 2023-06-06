import '@/common/styles/global.scss';
import '@/client/client-global.scss';
import Vue from 'vue';
import ClientRootApp from '@/client/ClientRootApp'
import router from '@/client/client-router';
import store from '@/client/client-root-store';
import {handleApiError} from '@/client/client-api-error-handler';
import {errorOfApi, isApiErrorResponse} from '@/common/utils/common-utils';

import Vuelidate from 'vuelidate';
import ErrorMessage from '@/common/components/ErrorMessage';
import PlainButton from '@/common/components/PlainButton';
import OverlayCloseButton from '@/common/components/OverlayCloseButton';
import StyledButton from '@/common/components/StyledButton';
import Avatar from '@/common/components/Avatar';
import RoundButton from '@/common/components/RoundButton';
import BoxedTextViewer from '@/common/components/BoxedTextViewer';
import MobileDropdown from '@/common/components/MobileDropdown';
import ErrorMessageTransition from '@/common/components/ErrorMessageTransition';
import ClientDropdown from '@/common/components/ClientDropdown';
import ThreeBarIcon from '@/common/components/ThreeBarIcon';
import Logo from '@/common/components/Logo';
import ImageListViewer from '@/common/components/ImageListViewer';
import ControlWrapper from '@/client/qr/control/ControlWrapper';
import EmailLinkViewer from '@/common/components/EmailLinkViewer';
import MobileLinkViewer from '@/common/components/MobileLinkViewer';
import MemberWithEmailLinkViewer from '@/common/components/MemberWithEmailLinkViewer';
import MemberWithMobileLinkViewer from '@/common/components/MemberWithMobileLinkViewer';
import GeolocationLinkViewer from '@/common/components/geolocation/GeolocationLinkViewer';
import FileLinkViewer from '@/common/components/FileLinkViewer';
import FileListLinkViewer from '@/common/components/FileListLinkViewer';
import ImageListThumbnailViewer from '@/common/components/ImageListThumbnailViewer';
import SignatureThumbnailViewer from '@/common/components/SignatureThumbnailViewer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
    Alert,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Col,
    Collapse,
    CollapseItem,
    ColorPicker,
    DatePicker,
    Dialog,
    Drawer,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Form,
    FormItem,
    Input,
    InputNumber,
    Loading,
    Message,
    MessageBox,
    Notification,
    Option,
    OptionGroup,
    Popover,
    Radio,
    RadioButton,
    RadioGroup,
    Rate,
    Row,
    Select,
    Timeline,
    TimelineItem,
    TimePicker,
    TimeSelect,
    Tooltip,
} from 'element-ui';
import eventBus from "@/common/utils/event-bus";

//在手机中调试
// import VConsole from 'vconsole';
//
// const vConsole = new VConsole();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Alert);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Rate);
Vue.use(ColorPicker);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Drawer);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.use(Vuelidate);
Vue.component('ErrorMessage', ErrorMessage);
Vue.component('PlainButton', PlainButton);
Vue.component('OverlayCloseButton', OverlayCloseButton);
Vue.component('StyledButton', StyledButton);
Vue.component('Avatar', Avatar);
Vue.component('RoundButton', RoundButton);
Vue.component('BoxedTextViewer', BoxedTextViewer);
Vue.component('MobileDropdown', MobileDropdown);
Vue.component('ErrorMessageTransition', ErrorMessageTransition);
Vue.component('ClientDropdown', ClientDropdown);
Vue.component('ThreeBarIcon', ThreeBarIcon);
Vue.component('Logo', Logo);
Vue.component('ImageListViewer', ImageListViewer);
Vue.component('ControlWrapper', ControlWrapper);
Vue.component('EmailLinkViewer', EmailLinkViewer);
Vue.component('MobileLinkViewer', MobileLinkViewer);
Vue.component('MemberWithEmailLinkViewer', MemberWithEmailLinkViewer);
Vue.component('MemberWithMobileLinkViewer', MemberWithMobileLinkViewer);
Vue.component('GeolocationLinkViewer', GeolocationLinkViewer);
Vue.component('FileLinkViewer', FileLinkViewer);
Vue.component('FileListLinkViewer', FileListLinkViewer);
Vue.component('ImageListThumbnailViewer', ImageListThumbnailViewer);
Vue.component('SignatureThumbnailViewer', SignatureThumbnailViewer);

Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
    eventBus.$emit('hideError');//每次进入一个页面时先清空error页面，主要用于：如果已显示error页面，刷新时先清空该页面
    next();
});

new Vue({
    router,
    store,
    render: h => h(ClientRootApp),
    components: {ClientRootApp}
}).$mount('#mry-client-app');

//统一处理后端API错误
Vue.config.errorHandler = (ex, vm, info) => {
    if (isApiErrorResponse(ex)) {
        handleApiError(errorOfApi(ex), info);
    } else {
        console.error(ex);
    }
};

//解决IOS微信浏览器中[收起软键盘后显示空白]的问题
document.body.addEventListener('focusout', () => {
        let ua = navigator.userAgent;
        if (/(iPhone|iPad|iPod|iOS)/i.test(ua) && /MicroMessenger/i.test(ua)) {
            let currentPosition;
            currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
            currentPosition -= 1;
            window.scrollTo(0, currentPosition); //页面向上滚动
            currentPosition += 1;
            window.scrollTo(0, currentPosition); //页面向下滚动
        }
    }
);
