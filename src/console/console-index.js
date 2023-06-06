import '@/common/styles/global.scss';
import '@/console/console-global.scss';
import Vue from 'vue';
import ConsoleRootPage from '@/console/ConsoleRootPage';
import router from '@/console/console-router';
import store from '@/console/console-root-store';
import {handleApiError} from '@/console/console-api-error-handler';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCopy} from '@fortawesome/free-regular-svg-icons/faCopy';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import {faCaretSquareUp} from '@fortawesome/free-regular-svg-icons/faCaretSquareUp';
import {faCaretSquareDown as farCaretSquareDown} from '@fortawesome/free-regular-svg-icons/faCaretSquareDown';
import {faDotCircle} from '@fortawesome/free-regular-svg-icons/faDotCircle';
import {faCheckSquare as farCheckSquare} from '@fortawesome/free-regular-svg-icons/faCheckSquare';
import {faStar as farStar} from '@fortawesome/free-regular-svg-icons/faStar';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons/faEnvelope';
import {faCalendarCheck} from '@fortawesome/free-regular-svg-icons/faCalendarCheck';
import {faCalendarMinus} from '@fortawesome/free-regular-svg-icons/faCalendarMinus';
import {faCalendarAlt} from '@fortawesome/free-regular-svg-icons/faCalendarAlt';
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons/faQuestionCircle';
import {faClock} from '@fortawesome/free-regular-svg-icons/faClock';
import {faCopyright} from '@fortawesome/free-regular-svg-icons/faCopyright';
import {faFolder} from '@fortawesome/free-solid-svg-icons/faFolder';
import {faHome} from '@fortawesome/free-solid-svg-icons/faHome';
import {faStickyNote} from '@fortawesome/free-solid-svg-icons/faStickyNote';
import {faCog} from '@fortawesome/free-solid-svg-icons/faCog';
import {faIcons} from '@fortawesome/free-solid-svg-icons/faIcons';
import {faList} from '@fortawesome/free-solid-svg-icons/faList';
import {faCode} from '@fortawesome/free-solid-svg-icons/faCode';
import {faBook} from '@fortawesome/free-solid-svg-icons/faBook';
import {faFileCode} from '@fortawesome/free-solid-svg-icons/faFileCode';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {faBookOpen} from '@fortawesome/free-solid-svg-icons/faBookOpen';
import {faQrcode} from '@fortawesome/free-solid-svg-icons/faQrcode';
import {faAlignLeft} from '@fortawesome/free-solid-svg-icons/faAlignLeft';
import {faAlignCenter} from '@fortawesome/free-solid-svg-icons/faAlignCenter';
import {faAlignRight} from '@fortawesome/free-solid-svg-icons/faAlignRight';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';
import {faGripLines} from '@fortawesome/free-solid-svg-icons/faGripLines';
import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faRobot} from '@fortawesome/free-solid-svg-icons/faRobot';
import {faSquareRootAlt} from '@fortawesome/free-solid-svg-icons/faSquareRootAlt';
import {faHeading} from '@fortawesome/free-solid-svg-icons/faHeading';
import {faParking} from '@fortawesome/free-solid-svg-icons/faParking';
import {faImage} from '@fortawesome/free-solid-svg-icons/faImage';
import {faVideo} from '@fortawesome/free-solid-svg-icons/faVideo';
import {faImages} from '@fortawesome/free-solid-svg-icons/faImages';
import {faLink} from '@fortawesome/free-solid-svg-icons/faLink';
import {faRetweet} from '@fortawesome/free-solid-svg-icons/faRetweet';
import {faStream} from '@fortawesome/free-solid-svg-icons/faStream';
import {faFilePdf} from '@fortawesome/free-solid-svg-icons/faFilePdf';
import {faHistory} from '@fortawesome/free-solid-svg-icons/faHistory';
import {faAnchor} from '@fortawesome/free-solid-svg-icons/faAnchor';
import {faFileAlt} from '@fortawesome/free-solid-svg-icons/faFileAlt';
import {faTable} from '@fortawesome/free-solid-svg-icons/faTable';
import {faTasks} from '@fortawesome/free-solid-svg-icons/faTasks';
import {faListAlt} from '@fortawesome/free-regular-svg-icons/faListAlt';
import {faIdBadge} from '@fortawesome/free-regular-svg-icons/faIdBadge';
import {faBorderAll} from '@fortawesome/free-solid-svg-icons/faBorderAll';
import {faChartLine} from '@fortawesome/free-solid-svg-icons/faChartLine';
import {faSignal} from '@fortawesome/free-solid-svg-icons/faSignal';
import {faLaptop} from '@fortawesome/free-solid-svg-icons/faLaptop';
import {faChartPie} from '@fortawesome/free-solid-svg-icons/faChartPie';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import {faChartBar} from '@fortawesome/free-solid-svg-icons/faChartBar';
import {faSortAmountUp} from '@fortawesome/free-solid-svg-icons/faSortAmountUp';
import {faFont} from '@fortawesome/free-solid-svg-icons/faFont';
import {faAlignJustify} from '@fortawesome/free-solid-svg-icons/faAlignJustify';
import {faCaretSquareDown} from '@fortawesome/free-solid-svg-icons/faCaretSquareDown';
import {faAngleDoubleDown} from '@fortawesome/free-solid-svg-icons/faAngleDoubleDown';
import {faFileUpload} from '@fortawesome/free-solid-svg-icons/faFileUpload';
import {faCloudUploadAlt} from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt';
import {faMapMarkedAlt} from '@fortawesome/free-solid-svg-icons/faMapMarkedAlt';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import {faCalculator} from '@fortawesome/free-solid-svg-icons/faCalculator';
import {faTabletAlt} from '@fortawesome/free-solid-svg-icons/faTabletAlt';
import {faFingerprint} from '@fortawesome/free-solid-svg-icons/faFingerprint';
import {faListOl} from '@fortawesome/free-solid-svg-icons/faListOl';
import {faTrafficLight} from '@fortawesome/free-solid-svg-icons/faTrafficLight';
import {faHeadset} from '@fortawesome/free-solid-svg-icons/faHeadset';
import {faCheckSquare} from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import {faFileSignature} from '@fortawesome/free-solid-svg-icons/faFileSignature';
import {faUserFriends} from '@fortawesome/free-solid-svg-icons/faUserFriends';
import {faThList} from '@fortawesome/free-solid-svg-icons/faThList';
import {faTools} from '@fortawesome/free-solid-svg-icons/faTools';
import {faCrosshairs} from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faMinus} from '@fortawesome/free-solid-svg-icons/faMinus';
import {faMobileAlt} from '@fortawesome/free-solid-svg-icons/faMobileAlt';
import {faDesktop} from '@fortawesome/free-solid-svg-icons/faDesktop';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons/faArrowUp';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons/faArrowDown';
import {faSitemap} from '@fortawesome/free-solid-svg-icons/faSitemap';
import {faClone} from '@fortawesome/free-solid-svg-icons/faClone';
import {faUserCheck} from '@fortawesome/free-solid-svg-icons/faUserCheck';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {faCubes} from '@fortawesome/free-solid-svg-icons/faCubes';
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons/faShoppingCart';
import {faUserCog} from '@fortawesome/free-solid-svg-icons/faUserCog';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';
import {faEyeSlash} from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import {faEye} from '@fortawesome/free-solid-svg-icons/faEye';
import {faTag} from '@fortawesome/free-solid-svg-icons/faTag';

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import Vuelidate from 'vuelidate';
import ErrorMessage from '@/common/components/ErrorMessage';
import EditTitle from '@/console/app-edit/components/EditTitle';
import CollapseTitle from '@/console/app-edit/components/CollapseTitle';
import PanelTitle from '@/console/app-edit/components/PanelTitle';
import PanelContent from '@/console/app-edit/components/PanelContent';
import RoundButton from '@/common/components/RoundButton';
import PlainButton from '@/common/components/PlainButton';
import BoxedTextStyleInput from '@/console/app-edit/components/BoxedTextStyleInput';
import ButtonStyleInput from '@/console/app-edit/components/ButtonStyleInput';
import AppearanceStyleInput from '@/console/app-edit/components/AppearanceStyleInput';
import FontStyleInput from '@/console/app-edit/components/FontStyleInput';
import OverlayCloseButton from '@/common/components/OverlayCloseButton';
import StyledButton from '@/common/components/StyledButton';
import Avatar from '@/common/components/Avatar';
import BoxedTextViewer from '@/common/components/BoxedTextViewer';
import ErrorMessageTransition from '@/common/components/ErrorMessageTransition';
import SquareLoadingIndicator from '@/common/components/SquareLoadingIndicator';
import ThreeBarIcon from '@/common/components/ThreeBarIcon';
import Logo from '@/common/components/Logo';
import ImageListViewer from '@/common/components/ImageListViewer';
import MryColorPicker from '@/common/components/MryColorPicker';
import EmailLinkViewer from '@/common/components/EmailLinkViewer';
import MobileLinkViewer from '@/common/components/MobileLinkViewer';
import MemberWithEmailLinkViewer from '@/common/components/MemberWithEmailLinkViewer';
import MemberWithMobileLinkViewer from '@/common/components/MemberWithMobileLinkViewer';
import GeolocationLinkViewer from '@/common/components/geolocation/GeolocationLinkViewer';
import ItalicTextButton from '@/common/components/ItalicTextButton';
import ShadowInput from '@/console/app-edit/components/ShadowInput';
import BorderInput from '@/console/app-edit/components/BorderInput';
import BorderRadiusInput from '@/console/app-edit/components/BorderRadiusInput';
import AnswerUniqueSettingInput from '@/console/app-edit/components/AnswerUniqueSettingInput';
import MarkdownStyleInput from '@/console/app-edit/components/MarkdownStyleInput';
import FileLinkViewer from "@/common/components/FileLinkViewer";
import FileListLinkViewer from "@/common/components/FileListLinkViewer";
import ImageListThumbnailViewer from "@/common/components/ImageListThumbnailViewer";
import SignatureThumbnailViewer from "@/common/components/SignatureThumbnailViewer";
import MinMaxEditor from '@/console/app-edit/components/MinMaxEditor';
import ProgressBar from '@/common/components/ProgressBar';
import MryCustomerServiceEntry from '@/console/common/components/MryCustomerServiceEntry';
import MryCustomerServiceText from '@/console/common/components/MryCustomerServiceText';
import HelpDocLinker from '@/console/common/components/HelpDocLinker';
import MryDocumentationEntry from '@/console/common/components/MryDocumentationEntry';
import MryOfficialSiteEntry from '@/console/common/components/MryOfficialSiteEntry';
import MryMobileEntry from '@/console/common/components/MryMobileEntry';
import eventBus from '@/common/utils/event-bus';
import {errorOfApi, isApiErrorResponse} from '@/common/utils/common-utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
    Alert,
    Breadcrumb,
    BreadcrumbItem,
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
    Pagination,
    Popconfirm,
    Popover,
    Radio,
    RadioButton,
    RadioGroup,
    Rate,
    Row,
    Select,
    Table,
    TableColumn,
    Timeline,
    TimelineItem,
    TimePicker,
    TimeSelect,
    Tooltip,
    Tree,
} from 'element-ui';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

library.add(faCopy, faTrashAlt, faCaretSquareUp, farCaretSquareDown, faDotCircle, farCheckSquare, faFolder, faHome,
    farStar, faEnvelope, faCalendarMinus, faClock, faCopyright, faGripLines, faCode, faFileCode, faBookOpen,
    faStickyNote, faCog, faList, faBars, faQrcode, faAlignLeft, faAlignCenter, faAlignRight, faStar, faLock, faRobot,
    faSquareRootAlt, faHeading, faParking, faImage, faVideo, faImages, faLink, faFilePdf, faHistory, faAnchor, faCaretSquareDown,
    faFileAlt, faTable, faBorderAll, faChartLine, faSignal, faLaptop, faChartPie, faCircleNotch, faChartBar, faSortAmountUp, faFont,
    faAlignJustify, faAngleDoubleDown, faFileUpload, faCloudUploadAlt, faMapMarkedAlt, faMapMarkerAlt, faCalculator, faTabletAlt,
    faFingerprint, faListOl, faTrafficLight, faCheckSquare, faFileSignature, faUserFriends, faThList, faTools, faCrosshairs, faPlus,
    faMinus, faMobileAlt, faDesktop, faArrowUp, faArrowDown, faSitemap, faClone, faUserCheck, faExternalLinkAlt, faCubes, faShoppingCart,
    faUserCog, faUser, faEyeSlash, faEye, faHeadset, faTasks, faListAlt, faCalendarAlt, faCalendarCheck, faTag, faBook, faStream, faRetweet,
    faIdBadge, faQuestionCircle, faIcons);

Vue.use(Pagination);
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
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Popconfirm);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Alert);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Rate);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(ColorPicker);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Drawer);
Vue.use(Tree);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.use(Vuelidate);
Vue.component('EditTitle', EditTitle);
Vue.component('CollapseTitle', CollapseTitle);
Vue.component('PanelTitle', PanelTitle);
Vue.component('PanelContent', PanelContent);
Vue.component('icon', FontAwesomeIcon);
Vue.component('ErrorMessage', ErrorMessage);
Vue.component('PlainButton', PlainButton);
Vue.component('RoundButton', RoundButton);
Vue.component('BoxedTextStyleInput', BoxedTextStyleInput);
Vue.component('ButtonStyleInput', ButtonStyleInput);
Vue.component('AppearanceStyleInput', AppearanceStyleInput);
Vue.component('FontStyleInput', FontStyleInput);
Vue.component('OverlayCloseButton', OverlayCloseButton);
Vue.component('StyledButton', StyledButton);
Vue.component('Avatar', Avatar);
Vue.component('BoxedTextViewer', BoxedTextViewer);
Vue.component('ErrorMessageTransition', ErrorMessageTransition);
Vue.component('SquareLoadingIndicator', SquareLoadingIndicator);
Vue.component('ThreeBarIcon', ThreeBarIcon);
Vue.component('Logo', Logo);
Vue.component('ImageListViewer', ImageListViewer);
Vue.component('MryColorPicker', MryColorPicker);
Vue.component('ShadowInput', ShadowInput);
Vue.component('BorderInput', BorderInput);
Vue.component('BorderRadiusInput', BorderRadiusInput);
Vue.component('AnswerUniqueSettingInput', AnswerUniqueSettingInput);
Vue.component('MarkdownStyleInput', MarkdownStyleInput);
Vue.component('MinMaxEditor', MinMaxEditor);
Vue.component('ProgressBar', ProgressBar);
Vue.component('MryCustomerServiceEntry', MryCustomerServiceEntry);
Vue.component('MryCustomerServiceText', MryCustomerServiceText);
Vue.component('HelpDocLinker', HelpDocLinker);
Vue.component('MryDocumentationEntry', MryDocumentationEntry);
Vue.component('MryOfficialSiteEntry', MryOfficialSiteEntry);
Vue.component('MryMobileEntry', MryMobileEntry);
Vue.component('ItalicTextButton', ItalicTextButton);
Vue.component('GeolocationLinkViewer', GeolocationLinkViewer);
Vue.component('EmailLinkViewer', EmailLinkViewer);
Vue.component('MobileLinkViewer', MobileLinkViewer);
Vue.component('MemberWithEmailLinkViewer', MemberWithEmailLinkViewer);
Vue.component('MemberWithMobileLinkViewer', MemberWithMobileLinkViewer);
Vue.component('FileLinkViewer', FileLinkViewer);
Vue.component('FileListLinkViewer', FileListLinkViewer);
Vue.component('ImageListThumbnailViewer', ImageListThumbnailViewer);
Vue.component('SignatureThumbnailViewer', SignatureThumbnailViewer);

Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
    eventBus.$emit('hideError');
    next();
});

new Vue({
    router,
    store,
    render: h => h(ConsoleRootPage),
    components: {ConsoleRootPage}
}).$mount('#mry-console-app');

Vue.config.errorHandler = (ex, vm, info) => {
    if (isApiErrorResponse(ex)) {
        handleApiError(errorOfApi(ex), info);
    } else {
        console.error(ex);
    }
};