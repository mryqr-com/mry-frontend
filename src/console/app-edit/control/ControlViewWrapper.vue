<template>
  <div ref="wrapper" :class="[$style.wrapper, {[$style.wrapperWide]: tabletView}]">
    <div :class="$style.content" :style="contentStyle">
      <template v-if="control.nameSetting.position === 'TOP' && !control.nameSetting.hidden">
        <BoxedTextViewer :textStyle="control.nameSetting.textStyle">
          <span v-if="shouldShowControlIndex">{{ controlIndex + 1 }}.</span>
          {{ control.name }}
          <span v-if="shouldShowAsterisk" :class="$style.asterisk">*</span>
          <span v-if="filedName" :class="$style.filedName" title="字段名">（{{ filedName }}）</span>
          <icon v-if="shouldShowSummaryEligible" :class="$style.nameIcon" icon="star" title="摘要字段"/>
          <icon v-if="shouldShowLock" :class="$style.nameIcon" icon="lock" title="增强权限已启用"/>
          <icon v-if="shouldShowAutoFill" :class="$style.nameIcon" icon="robot" title="自动填充"/>
          <icon v-if="shouldAutoCalculate" :class="$style.nameIcon" icon="square-root-alt" title="自动计算"/>
          <icon v-if="hasAttribute" :class="$style.nameIcon" icon="tag" title="已将该控件的最近一次提交值设置为自定义属性值"/>
        </BoxedTextViewer>

        <BoxedTextViewer v-if="control.description"
                         :textStyle="control.descriptionStyle">
          {{ control.description }}
        </BoxedTextViewer>
      </template>

      <component :is="control.type" :control="control" :controlIndex="controlIndex" :tabletView="tabletView"/>

      <template v-if="control.nameSetting.position === 'BOTTOM' && !control.nameSetting.hidden">
        <BoxedTextViewer :textStyle="control.nameSetting.textStyle">
          <span v-if="shouldShowControlIndex">{{ controlIndex + 1 }}.</span>
          {{ control.name }}
          <span v-if="shouldShowAsterisk" :class="$style.asterisk">*</span>
          <span v-if="filedName" :class="$style.filedName" title="字段名">（{{ filedName }}）</span>
          <icon v-if="shouldShowSummaryEligible" :class="$style.nameIcon" icon="star" title="摘要字段"/>
          <icon v-if="shouldShowLock" :class="$style.nameIcon" icon="lock" title="增强权限已启用"/>
          <icon v-if="shouldShowAutoFill" :class="$style.nameIcon" icon="robot" title="自动填充"/>
          <icon v-if="shouldAutoCalculate" :class="$style.nameIcon" icon="square-root-alt" title="自动计算"/>
          <icon v-if="hasAttribute" :class="$style.nameIcon" icon="tag" title="已将该控件的最近一次提交值设置为自定义属性值"/>
        </BoxedTextViewer>

        <BoxedTextViewer v-if="control.description"
                         :textStyle="control.descriptionStyle">
          {{ control.description }}
        </BoxedTextViewer>
      </template>
    </div>

    <div :class="$style.toolbox">
      <button v-if="shouldShowAttributeTag"
              :class="$style.theButton"
              title="由该控件快捷创建自定义属性，所创建的自定义属性类型为`控件最近一次提交值`"
              @click.stop="createAttributeFromControl(control)">
        <icon icon="tag"/>
      </button>

      <button v-if="!isCurrentPageControlFull"
              :class="$style.theButton"
              title="复制"
              @click.stop="clone(control)">
        <icon :icon="['far','copy']"/>
      </button>

      <button :class="$style.theButton"
              title="删除"
              @click.stop="deleteControl(control)">
        <icon :icon="['far','trash-alt']"/>
      </button>

      <button v-if="!isFirstControl(control.id)"
              :class="$style.theButton"
              title="上移"
              @click.stop="moveUp(control.id)">
        <icon :icon="['far','caret-square-up']"/>
      </button>

      <button v-if="!isLastControl(control.id)"
              :class="$style.theButton"
              title="下移"
              @click.stop="moveDown(control.id)">
        <icon :icon="['far','caret-square-down']"/>
      </button>
    </div>

    <CreateControlLastAnswerAttributeDialog :control="createControlLastAnswerAttributeControl"
                                            :currentPage="currentPage"
                                            :show.sync="createControlLastAnswerAttributeDialogVisible">
    </CreateControlLastAnswerAttributeDialog>
  </div>
</template>

<script>
import CheckboxView from '@/console/app-edit/control/checkbox/CheckboxView'
import RadioView from '@/console/app-edit/control/radio/RadioView'
import SingleLineTextView from '@/console/app-edit/control/single-line-text/SingleLineTextView'
import PersonNameView from '@/console/app-edit/control/person-name/PersonNameView'
import MultiLineTextView from '@/console/app-edit/control/multi-line-text/MultiLineTextView';
import RichTextInputView from '@/console/app-edit/control/rich-text-input/RichTextInputView';
import DropdownView from '@/console/app-edit/control/dropdown/DropdownView';
import MemberSelectView from '@/console/app-edit/control/member-select/MemberSelectView';
import ImageUploadView from '@/console/app-edit/control/image-upload/ImageUploadView';
import FileUploadView from '@/console/app-edit/control/file-upload/FileUploadView';
import AddressView from '@/console/app-edit/control/address/AddressView';
import GeolocationView from '@/console/app-edit/control/geolocation/GeolocationView';
import NumberInputView from '@/console/app-edit/control/number-input/NumberInputView';
import AttachmentView from '@/console/app-edit/control/attachment/AttachmentView';
import VideoView from '@/console/app-edit/control/video/VideoView';
import ImageView from '@/console/app-edit/control/image-view/ImageView';
import SectionTitleView from '@/console/app-edit/control/section-title/SectionTitleView';
import RichTextView from '@/console/app-edit/control/rich-text/RichTextView';
import SeparatorView from '@/console/app-edit/control/separator/SeparatorView';
import ParagraphView from '@/console/app-edit/control/paragraph/ParagraphView';
import MobileView from '@/console/app-edit/control/mobile/MobileView';
import IdentifierView from '@/console/app-edit/control/identifier/IdentifierView';
import DateView from '@/console/app-edit/control/date/DateView';
import EmailView from '@/console/app-edit/control/email/EmailView';
import TimeView from '@/console/app-edit/control/time/TimeView';
import PointCheckView from '@/console/app-edit/control/pointcheck/PointCheckView';
import ItemStatusView from '@/console/app-edit/control/item-status/ItemStatusView';
import ItemCountView from '@/console/app-edit/control/item-count/ItemCountView';
import NumberRankingView from '@/console/app-edit/control/number-ranking/NumberRankingView';
import ButtonPageLinkView from '@/console/app-edit/control/button-page-link/ButtonPageLinkView';
import IconPageLinkView from '@/console/app-edit/control/icon-page-link/IconPageLinkView';
import AttributeTableView from '@/console/app-edit/control/attribute-table/AttributeTableView';
import AttributeDashboardView from '@/console/app-edit/control/attribute-dashboard/AttributeDashboardView';
import SubmitHistoryView from '@/console/app-edit/control/history/SubmitHistoryView';
import InstanceListView from '@/console/app-edit/control/instance-list/InstanceListView';
import AnswerReferenceView from '@/console/app-edit/control/answer-reference/AnswerReferenceView';
import SubmissionReferenceView from '@/console/app-edit/control/submission-reference/SubmissionReferenceView';
import TimeSegmentView from '@/console/app-edit/control/time-segment/TimeSegmentView';
import NumberRangeSegmentView from '@/console/app-edit/control/number-range-segment/NumberRangeSegmentView';
import BarView from '@/console/app-edit/control/bar/BarView';
import TrendView from '@/console/app-edit/control/trend/TrendView';
import PieView from '@/console/app-edit/control/pie/PieView';
import DoughnutView from '@/console/app-edit/control/doughnut/DoughnutView';
import ImageCardLinkView from '@/console/app-edit/control/image-card-link/ImageCardLinkView';
import SignatureView from '@/console/app-edit/control/signature/SignatureView';
import MultiLevelSelectionView from '@/console/app-edit/control/multi-level-selection/MultiLevelSelectionView';
import {borderRadiusStyles, borderStyles, isControlFillable, shadowStyles} from "@/common/utils/common-utils";
import CreateControlLastAnswerAttributeDialog from '@/console/app-edit/control/CreateControlLastAnswerAttributeDialog';

import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';

const {mapState, mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    CreateControlLastAnswerAttributeDialog,
    CHECKBOX: CheckboxView,
    RADIO: RadioView,
    SINGLE_LINE_TEXT: SingleLineTextView,
    PERSON_NAME: PersonNameView,
    MULTI_LINE_TEXT: MultiLineTextView,
    RICH_TEXT_INPUT: RichTextInputView,
    DROPDOWN: DropdownView,
    MEMBER_SELECT: MemberSelectView,
    IMAGE_UPLOAD: ImageUploadView,
    FILE_UPLOAD: FileUploadView,
    ADDRESS: AddressView,
    GEOLOCATION: GeolocationView,
    NUMBER_INPUT: NumberInputView,
    ATTACHMENT_VIEW: AttachmentView,
    IMAGE_CARD_LINK: ImageCardLinkView,
    VIDEO_VIEW: VideoView,
    IMAGE_VIEW: ImageView,
    SECTION_TITLE: SectionTitleView,
    RICH_TEXT: RichTextView,
    SEPARATOR: SeparatorView,
    PARAGRAPH: ParagraphView,
    MOBILE: MobileView,
    IDENTIFIER: IdentifierView,
    DATE: DateView,
    EMAIL: EmailView,
    TIME: TimeView,
    POINT_CHECK: PointCheckView,
    ITEM_STATUS: ItemStatusView,
    ITEM_COUNT: ItemCountView,
    NUMBER_RANKING: NumberRankingView,
    BUTTON_PAGE_LINK: ButtonPageLinkView,
    ICON_PAGE_LINK: IconPageLinkView,
    ATTRIBUTE_TABLE: AttributeTableView,
    ATTRIBUTE_DASHBOARD: AttributeDashboardView,
    SUBMIT_HISTORY: SubmitHistoryView,
    INSTANCE_LIST: InstanceListView,
    ANSWER_REFERENCE: AnswerReferenceView,
    SUBMISSION_REFERENCE: SubmissionReferenceView,
    TIME_SEGMENT: TimeSegmentView,
    NUMBER_RANGE_SEGMENT: NumberRangeSegmentView,
    BAR: BarView,
    TREND: TrendView,
    PIE: PieView,
    DOUGHNUT: DoughnutView,
    SIGNATURE: SignatureView,
    MULTI_LEVEL_SELECTION: MultiLevelSelectionView,
  },

  props: {
    control: {
      type: Object,
      required: true
    },

    controlIndex: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      createControlLastAnswerAttributeControl: {},
      createControlLastAnswerAttributeDialogVisible: false,
    }
  },

  computed: {
    contentStyle() {
      return {
        marginTop: this.control.styleSetting.topMargin + 'px',
        marginBottom: this.control.styleSetting.bottomMargin + 'px',
        backgroundColor: this.control.styleSetting.backgroundColor,
        paddingTop: this.control.styleSetting.vPadding + 'px',
        paddingBottom: this.control.styleSetting.vPadding + 'px',
        paddingLeft: this.control.styleSetting.hPadding + 'px',
        paddingRight: this.control.styleSetting.hPadding + 'px',
        ...shadowStyles(this.control.styleSetting.shadow),
        ...borderStyles(this.control.styleSetting.border),
        ...borderRadiusStyles(this.control.styleSetting.borderRadius),
      }
    },

    shouldShowAsterisk() {
      return this.currentPage.setting.showAsterisk
          && this.control.fillableSetting
          && this.control.fillableSetting.mandatory;
    },

    shouldShowSummaryEligible() {
      return this.control.fillableSetting
          && this.control.fillableSetting.submissionSummaryEligible;
    },

    shouldShowLock() {
      return this.control.permissionEnabled;
    },

    shouldShowAutoFill() {
      return this.control.fillableSetting
          && this.control.fillableSetting.autoFill;
    },

    shouldAutoCalculate() {
      return this.control.autoCalculateEnabled;
    },

    shouldShowControlIndex() {
      return this.currentPage.setting.showControlIndex;
    },

    filedName() {
      if (!this.control.fillableSetting) {
        return null;
      }

      return this.control.fillableSetting.fieldName;
    },

    shouldShowAttributeTag() {
      return isControlFillable(this.control) && !this.hasControlLastAnswerRefedAttribute(this.control.id);
    },

    hasAttribute() {
      return isControlFillable(this.control) && this.hasControlLastAnswerRefedAttribute(this.control.id);
    },

    ...mapGetters([
      'isLastControl',
      'isFirstControl',
      'currentPage',
      'isCurrentPageControlFull',
      'hasControlLastAnswerRefedAttribute',
    ]),

    ...mapState([
      'tabletView'
    ])
  },

  methods: {
    ...mapActions([
      ACTIONS.MOVE_CONTROL_UP,
      ACTIONS.MOVE_CONTROL_DOWN,
      ACTIONS.DELETE_CONTROL,
      ACTIONS.CLONE_CONTROL
    ]),

    createAttributeFromControl(control) {
      this.createControlLastAnswerAttributeControl = control;
      this.createControlLastAnswerAttributeDialogVisible = true;
    },

    clone(control) {
      this[ACTIONS.CLONE_CONTROL](control).then(() => {
        this.$emit('controlCloned');
      }).catch((error) => {
        this.$message({
          type: 'error',
          message: error.message ? error.message : error,
          center: true
        });
      })
    },

    moveUp(id) {
      this[ACTIONS.MOVE_CONTROL_UP](id);
    },

    moveDown(id) {
      this[ACTIONS.MOVE_CONTROL_DOWN](id);
    },

    deleteControl(control) {
      this.$confirm(`确认删除【${control.name}】？`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        this[ACTIONS.DELETE_CONTROL](control.id)
            .catch((error) => {
              this.$message({
                type: 'error',
                showClose: true,
                duration: 5000,
                message: error.message ? error.message : error,
                center: true
              });
            });
      }).catch(_ => {
      });
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  cursor: grab;
  padding-right: $narrowPageVPadding;
  padding-left: $narrowPageVPadding;
  position: relative;
}

.wrapper::after, .wrapper::before {
  display: table;
  content: '';
}

.wrapperWide {
  padding-right: $widePageVPadding;
  padding-left: $widePageVPadding;
}

.content {
  //overflow: hidden;//启用后，ClientDropdown的Multiselect无法撑开，故注释掉
}

.asterisk {
  color: red;
}

.nameIcon {
  color: $placeholderTextColor;
  padding: 0 1px;
  font-size: 12px;
  cursor: default;
}

.filedName {
  font-size: 12px;
  color: $secondaryTextColor;
  font-weight: normal;
  cursor: default;
}

.toolbox {
  position: absolute;
  bottom: 0;
  right: 0;
  display: none;
  cursor: pointer;
}

.wrapper:hover .toolbox {
  display: block;
}

.theButton {
  outline: none;
  text-decoration: none;
  font-size: 1.2em;
  cursor: pointer;
  color: #838383;
  background-color: transparent;
  border: none;
}

.theButton:hover {
  color: $primaryTextColor;
  cursor: pointer;
}

</style>
