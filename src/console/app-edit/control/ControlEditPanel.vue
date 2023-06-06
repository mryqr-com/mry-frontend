<template>
  <div v-if="currentControl" :class="$style.wrapper">
    <PanelContent :helpUrl="controlHelpDocLinks[theControl.type]" :title="controlTypeName">
      <div class="singleLineTitleWithSuffix">
        <EditTitle>标题</EditTitle>
        <el-popover
            placement="bottom"
            trigger="click"
            width="300">
          <ItalicTextButton slot="reference" title="设置标题样式">样式</ItalicTextButton>
          <div class="keyValueSettingContainer">可见性：
            <el-radio-group v-model="theLocal.nameSetting.hidden" size="mini">
              <el-radio-button :label="false" title="显示控件">显示
              </el-radio-button>
              <el-radio-button :label="true" title="隐藏控件">隐藏
              </el-radio-button>
            </el-radio-group>
          </div>

          <template v-if="!theLocal.nameSetting.hidden">
            <div class="keyValueSettingContainer">位置：
              <el-radio-group v-model="theLocal.nameSetting.position" size="mini">
                <el-radio-button label="TOP" title="标题位于控件内容之上">顶部
                </el-radio-button>
                <el-radio-button label="BOTTOM" title="标题位于控件内容之下">底部
                </el-radio-button>
              </el-radio-group>
            </div>

            <BoxedTextStyleInput v-model="theLocal.nameSetting.textStyle"></BoxedTextStyleInput>
          </template>

          <div :class="$style.applyToButton">
            <el-dropdown trigger="click" @command="handleNameStyleApplyToCommand">
              <ItalicTextButton title="将该样式应用于其他控件">应用于...</ItalicTextButton>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="applyNameStyleToCurrentPageAllSameTypeControls">
                  {{ `本页中所有${this.isFillable ? '填值' : '展示'}控件` }}
                </el-dropdown-item>
                <el-dropdown-item command="applyNameStyleToCurrentPageAllControls">本页中所有控件
                </el-dropdown-item>
                <el-dropdown-item command="applyNameStyleToAllPageAllSameTypeControls">
                  {{ `所有页面的所有${this.isFillable ? '填值' : '展示'}控件` }}
                </el-dropdown-item>
                <el-dropdown-item command="applyNameStyleToAllPageAllControls">所有页面的所有控件
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-popover>
      </div>

      <el-input v-model="theLocal.name"
                :class="{elementInputErrorBordered: $v.theLocal.name.$invalid }"
                :maxlength="100"
                :spellcheck="false"
                placeholder="控件标题"
                size="mini"
                title="控件标题，对于填值控件来说，建议同时设置'字段名称'(位于'填值设置'之下)，以便在运营应用时可以用更加简洁的字段名称代替控件标题">
      </el-input>
      <ErrorMessage v-if="!$v.theLocal.name.required">标题不能为空</ErrorMessage>

      <div class="singleLineTitleWithSuffix marginTop10">
        <div class="singleLineTitle">描述</div>
        <el-popover
            placement="bottom"
            trigger="click"
            width="300">
          <ItalicTextButton slot="reference" title="设置描述文本的样式">样式</ItalicTextButton>
          <BoxedTextStyleInput v-model="theLocal.descriptionStyle"></BoxedTextStyleInput>
          <div :class="$style.applyToButton">
            <el-dropdown trigger="click" @command="handleDescriptionStyleApplyToCommand">
              <ItalicTextButton title="将该样式应用于其他控件">应用于...</ItalicTextButton>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="applyDescriptionStyleToCurrentPageAllSameTypeControls">
                  {{ `本页中所有${this.isFillable ? '填值' : '展示'}控件` }}
                </el-dropdown-item>
                <el-dropdown-item command="applyDescriptionStyleToCurrentPageAllControls">本页中所有控件
                </el-dropdown-item>
                <el-dropdown-item command="applyDescriptionStyleToAllPageAllSameTypeControls">
                  {{ `所有页面的所有${this.isFillable ? '填值' : '展示'}控件` }}
                </el-dropdown-item>
                <el-dropdown-item command="applyDescriptionStyleToAllPageAllControls">所有页面的所有控件
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-popover>
      </div>
      <el-input v-model="theLocal.description"
                :maxlength="500"
                :rows="2"
                class="block"
                size="mini"
                title="描述将显示于标题之下"
                type="textarea">
      </el-input>

      <component :is="theControl.type" v-model="theLocal"/>

      <el-collapse v-model="activeName" :class="$style.settingCollapse">
        <el-collapse-item v-if="isFillable" name="fillableSetting">
          <template slot="title">
            <CollapseTitle>填值设置</CollapseTitle>
          </template>

          <div class="singleLineTitle">字段名称</div>
          <el-input v-model.trim="theLocal.fillableSetting.fieldName"
                    :maxlength="10"
                    :spellcheck="false"
                    class="settingMarginBottom"
                    size="mini"
                    title="字段名称，通常为控件所代表的字段简称，设置后运营页面等处将以字段名称替代控件标题，建议设置">
          </el-input>

          <el-checkbox v-model="theLocal.fillableSetting.submissionSummaryEligible"
                       class="settingMarginBottom block"
                       size="mini"
                       title="勾选后，字段提交值将直接显示在提交历史控件和手机端的提交列表中，通常情况下可将一些需要重点显示的字段设置为摘要字段">
            设置为摘要字段重点显示
          </el-checkbox>

          <el-checkbox v-if="mandatoryShowable"
                       v-model="theLocal.fillableSetting.mandatory"
                       class="settingMarginBottom block"
                       size="mini"
                       title="是否必填">
            必填
          </el-checkbox>

          <el-checkbox v-if="autoFillShowable"
                       v-model="theLocal.fillableSetting.autoFill"
                       class="settingMarginBottom block"
                       size="mini"
                       title="自动填充上次提交值，该选项只对提交类型为'新建'以及需要登录的页面下的控件有效">
            自动填充上次提交值
          </el-checkbox>

          <div class="singleLineTitle">自定义错误提示文本</div>
          <el-input v-model="theLocal.fillableSetting.errorTips"
                    :maxlength="100"
                    class="settingMarginBottom"
                    size="mini"
                    title="在提交者填写有误时的提示信息，该文本将覆盖系统所有默认的错误提示信息"
                    type="textarea">
          </el-input>
        </el-collapse-item>

        <el-collapse-item name="permissionSetting">
          <template slot="title">
            <CollapseTitle>权限设置</CollapseTitle>
          </template>
          <el-checkbox v-model="theLocal.permissionEnabled"
                       class="settingMarginBottom block"
                       size="mini"
                       title="控件增强权限作用于页面权限的基础之上，如果提交者没有页面权限，那么无论控件权限如何，均无法访问控件">
            启用控件增强权限
          </el-checkbox>
          <template v-if="theLocal.permissionEnabled">
            <div class="keyValueSettingContainer">
              控件权限：
              <el-select v-model="theLocal.permission"
                         class="width150"
                         placeholder="请选择权限"
                         size="mini"
                         title="设置控件权限">
                <el-option
                    v-for="permissionType in controlPermissionTypes"
                    :key="permissionType.type"
                    :label="permissionType.text"
                    :value="permissionType.type">
                </el-option>
              </el-select>
            </div>

            <el-checkbox v-if="isFillable && isCurrentPageRequireLogin"
                         v-model="theLocal.submitterViewable"
                         class="settingMarginBottom block"
                         size="mini"
                         title="提交值是否对原始提交者可见，用于需要让原始提交者看到提交值但是却不能填写或更新的情况，比如对于考卷系统，对考卷的打分(数字控件)只能由老师完成，学生可见但是不能修改分数">
              提交值对表单的原始提交者可见
            </el-checkbox>

          </template>
        </el-collapse-item>

        <el-collapse-item name="styleSetting">
          <template slot="title">
            <CollapseTitle>控件样式</CollapseTitle>
          </template>

          <div class="singleLineTitle">边框</div>
          <BorderInput v-model="theLocal.styleSetting.border"
                       class="settingMarginBottom">
          </BorderInput>

          <div class="singleLineTitle">边框阴影</div>
          <ShadowInput v-model="theLocal.styleSetting.shadow"
                       class="settingMarginBottom">
          </ShadowInput>

          <div class="singleLineTitle" title="圆角">圆角</div>
          <BorderRadiusInput v-model="theLocal.styleSetting.borderRadius"
                             class="settingMarginBottom">
          </BorderRadiusInput>

          <div class="keyValueSettingContainer">
            顶部外边距：
            <el-input-number v-model="theLocal.styleSetting.topMargin"
                             :max="100"
                             :min="0"
                             :step="1"
                             :stepStrictly="true"
                             controls-position="right"
                             size="mini"
                             title="控件顶部外边距">
            </el-input-number>
          </div>

          <div class="keyValueSettingContainer">
            底部外边距：
            <el-input-number v-model="theLocal.styleSetting.bottomMargin"
                             :max="100"
                             :min="0"
                             :step="1"
                             :stepStrictly="true"
                             controls-position="right"
                             size="mini"
                             title="控件底部外边距">
            </el-input-number>
          </div>

          <div class="keyValueSettingContainer" title="垂直内边距">
            垂直内边距：
            <el-input-number v-model="theLocal.styleSetting.vPadding"
                             :max="100"
                             :min="0"
                             :step="1"
                             :stepStrictly="true"
                             controls-position="right"
                             size="mini">
            </el-input-number>
          </div>

          <div class="keyValueSettingContainer" title="水平内边距">
            水平内边距：
            <el-input-number v-model="theLocal.styleSetting.hPadding"
                             :max="100"
                             :min="0"
                             :step="1"
                             :stepStrictly="true"
                             controls-position="right"
                             size="mini">
            </el-input-number>
          </div>

          <div class="keyValueSettingContainer">
            背景色：
            <MryColorPicker v-model="theLocal.styleSetting.backgroundColor" title="背景色"></MryColorPicker>
          </div>

          <div :class="$style.applyToButton">
            <el-dropdown trigger="click" @command="handleControlStyleApplyToCommand">
              <ItalicTextButton title="将控件样式应用于其他控件">应用于...</ItalicTextButton>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="applyControlStyleToCurrentPageAllSameTypeControls">
                  {{ `本页中所有${this.isFillable ? '填值' : '展示'}控件` }}
                </el-dropdown-item>
                <el-dropdown-item command="applyControlStyleToCurrentPageAllControls">本页中所有控件
                </el-dropdown-item>
                <el-dropdown-item command="applyControlStyleToAllPageAllSameTypeControls">
                  {{ `所有页面的所有${this.isFillable ? '填值' : '展示'}控件` }}
                </el-dropdown-item>
                <el-dropdown-item command="applyControlStyleToAllPageAllControls">所有页面的所有控件
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-collapse-item>
      </el-collapse>
    </PanelContent>
  </div>
</template>

<script>
import {required} from 'vuelidate/lib/validators';

import {cloneDeep, isEqual} from 'lodash-es';
import CheckboxEditPanel from '@/console/app-edit/control/checkbox/CheckboxEditPanel';
import DropdownEditPanel from '@/console/app-edit/control/dropdown/DropdownEditPanel';
import MemberSelectEditPanel from '@/console/app-edit/control/member-select/MemberSelectEditPanel';
import ImageUploadEditPanel from '@/console/app-edit/control/image-upload/ImageUploadEditPanel';
import FileUploadEditPanel from '@/console/app-edit/control/file-upload/FileUploadEditPanel';
import AddressEditPanel from '@/console/app-edit/control/address/AddressEditPanel';
import GeolocationEditPanel from '@/console/app-edit/control/geolocation/GeolocationEditPanel';
import NumberInputEditPanel from '@/console/app-edit/control/number-input/NumberInputEditPanel';
import AttachmentViewEditPanel from '@/console/app-edit/control/attachment/AttachmentViewEditPanel';
import VideoViewEditPanel from '@/console/app-edit/control/video/VideoViewEditPanel';
import ImageViewEditPanel from '@/console/app-edit/control/image-view/ImageViewEditPanel';
import SectionTitleViewEditPanel from '@/console/app-edit/control/section-title/SectionTitleViewEditPanel';
import RichTextInputEditPanel from '@/console/app-edit/control/rich-text-input/RichTextInputEditPanel';
import SeparatorEditPanel from '@/console/app-edit/control/separator/SeparatorEditPanel';
import ParagraphEditPanel from '@/console/app-edit/control/paragraph/ParagraphEditPanel';
import MobileEditPanel from '@/console/app-edit/control/mobile/MobileEditPanel';
import IdentifierEditPanel from '@/console/app-edit/control/identifier/IdentifierEditPanel';
import DateEditPanel from '@/console/app-edit/control/date/DateEditPanel';
import EmailEditPanel from '@/console/app-edit/control/email/EmailEditPanel';
import TimeEditPanel from '@/console/app-edit/control/time/TimeEditPanel';
import PointCheckEditPanel from '@/console/app-edit/control/pointcheck/PointCheckEditPanel';
import ItemStatusEditPanel from '@/console/app-edit/control/item-status/ItemStatusEditPanel';
import ItemCountEditPanel from '@/console/app-edit/control/item-count/ItemCountEditPanel';
import NumberRankingEditPanel from '@/console/app-edit/control/number-ranking/NumberRankingEditPanel';
import ButtonPageLinkEditPanel from '@/console/app-edit/control/button-page-link/ButtonPageLinkEditPanel';
import IconPageLinkEditPanel from '@/console/app-edit/control/icon-page-link/IconPageLinkEditPanel';
import AttributeTableEditPanel from '@/console/app-edit/control/attribute-table/AttributeTableEditPanel';
import AttributeDashboardEditPanel from '@/console/app-edit/control/attribute-dashboard/AttributeDashboardEditPanel';
import SubmitHistoryEditPanel from '@/console/app-edit/control/history/SubmitHistoryEditPanel';
import InstanceListViewEditPanel from '@/console/app-edit/control/instance-list/InstanceListViewEditPanel';
import AnswerReferenceEditPanel from '@/console/app-edit/control/answer-reference/AnswerReferenceEditPanel';
import SubmissionReferenceEditPanel from '@/console/app-edit/control/submission-reference/SubmissionReferenceEditPanel';
import TimeSegmentEditPanel from '@/console/app-edit/control/time-segment/TimeSegmentEditPanel';
import NumberRangeSegmentEditPanel from '@/console/app-edit/control/number-range-segment/NumberRangeSegmentEditPanel';
import BarEditPanel from '@/console/app-edit/control/bar/BarEditPanel';
import TrendEditPanel from '@/console/app-edit/control/trend/TrendEditPanel';
import PieEditPanel from '@/console/app-edit/control/pie/PieEditPanel';
import DoughnutEditPanel from '@/console/app-edit/control/doughnut/DoughnutEditPanel';
import ImageCardLinkEditPanel from '@/console/app-edit/control/image-card-link/ImageCardLinkEditPanel';
import SignatureEditPanel from '@/console/app-edit/control/signature/SignatureEditPanel';
import MultiLevelSelectionEditPanel
  from '@/console/app-edit/control/multi-level-selection/MultiLevelSelectionEditPanel';

import RadioEditPanel from '@/console/app-edit/control/radio/RadioEditPanel';
import SingleLineTextEditPanel from '@/console/app-edit/control/single-line-text/SingleLineTextEditPanel';
import PersonNameEditPanel from '@/console/app-edit/control/person-name/PersonNameEditPanel';
import MultiLineTextEditPanel from '@/console/app-edit/control/multi-line-text/MultiLineTextEditPanel';
import RichTextEditPanel from '@/console/app-edit/control/rich-text/RichTextEditPanel';
import controlTypes from '@/common/utils/control-types';
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import {isControlAutoFillEligible} from "@/common/utils/common-utils";

const {mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    CHECKBOX: CheckboxEditPanel,
    RADIO: RadioEditPanel,
    SINGLE_LINE_TEXT: SingleLineTextEditPanel,
    PERSON_NAME: PersonNameEditPanel,
    MULTI_LINE_TEXT: MultiLineTextEditPanel,
    RICH_TEXT_INPUT: RichTextInputEditPanel,
    DROPDOWN: DropdownEditPanel,
    MEMBER_SELECT: MemberSelectEditPanel,
    IMAGE_UPLOAD: ImageUploadEditPanel,
    FILE_UPLOAD: FileUploadEditPanel,
    ADDRESS: AddressEditPanel,
    GEOLOCATION: GeolocationEditPanel,
    NUMBER_INPUT: NumberInputEditPanel,
    ATTACHMENT_VIEW: AttachmentViewEditPanel,
    IMAGE_CARD_LINK: ImageCardLinkEditPanel,
    VIDEO_VIEW: VideoViewEditPanel,
    IMAGE_VIEW: ImageViewEditPanel,
    SECTION_TITLE: SectionTitleViewEditPanel,
    SEPARATOR: SeparatorEditPanel,
    RICH_TEXT: RichTextEditPanel,
    PARAGRAPH: ParagraphEditPanel,
    MOBILE: MobileEditPanel,
    IDENTIFIER: IdentifierEditPanel,
    DATE: DateEditPanel,
    EMAIL: EmailEditPanel,
    TIME: TimeEditPanel,
    POINT_CHECK: PointCheckEditPanel,
    ITEM_STATUS: ItemStatusEditPanel,
    ITEM_COUNT: ItemCountEditPanel,
    NUMBER_RANKING: NumberRankingEditPanel,
    BUTTON_PAGE_LINK: ButtonPageLinkEditPanel,
    ICON_PAGE_LINK: IconPageLinkEditPanel,
    ATTRIBUTE_TABLE: AttributeTableEditPanel,
    ATTRIBUTE_DASHBOARD: AttributeDashboardEditPanel,
    SUBMIT_HISTORY: SubmitHistoryEditPanel,
    INSTANCE_LIST: InstanceListViewEditPanel,
    ANSWER_REFERENCE: AnswerReferenceEditPanel,
    SUBMISSION_REFERENCE: SubmissionReferenceEditPanel,
    TIME_SEGMENT: TimeSegmentEditPanel,
    NUMBER_RANGE_SEGMENT: NumberRangeSegmentEditPanel,
    BAR: BarEditPanel,
    TREND: TrendEditPanel,
    PIE: PieEditPanel,
    DOUGHNUT: DoughnutEditPanel,
    SIGNATURE: SignatureEditPanel,
    MULTI_LEVEL_SELECTION: MultiLevelSelectionEditPanel,
  },

  data() {
    return {
      theLocal: {},
      activeName: "fillableSetting"
    }
  },

  created() {
    this.theLocal = cloneDeep(this.theControl);
  },

  methods: {
    ...mapActions([
      ACTIONS.UPDATE_CONTROL,
      ACTIONS.APPLY_CONTROL_NAME_SETTING_TO,
      ACTIONS.APPLY_CONTROL_DESCRIPTION_STYLE_TO,
      ACTIONS.APPLY_CONTROL_STYLE_TO,
    ]),

    applyNameStyleToCurrentPageAllSameTypeControls() {
      this[ACTIONS.APPLY_CONTROL_NAME_SETTING_TO]({
            sourceControl: this.theLocal,
            isAllControls: false,
            isAllPages: false,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    applyNameStyleToCurrentPageAllControls() {
      this[ACTIONS.APPLY_CONTROL_NAME_SETTING_TO]({
            sourceControl: this.theLocal,
            isAllControls: true,
            isAllPages: false,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    applyNameStyleToAllPageAllSameTypeControls() {
      this[ACTIONS.APPLY_CONTROL_NAME_SETTING_TO]({
            sourceControl: this.theLocal,
            isAllControls: false,
            isAllPages: true,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    applyNameStyleToAllPageAllControls() {
      this[ACTIONS.APPLY_CONTROL_NAME_SETTING_TO]({
            sourceControl: this.theLocal,
            isAllControls: true,
            isAllPages: true,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    handleNameStyleApplyToCommand(command) {
      return this[command]();
    },

    applyDescriptionStyleToCurrentPageAllSameTypeControls() {
      this[ACTIONS.APPLY_CONTROL_DESCRIPTION_STYLE_TO]({
            sourceControl: this.theLocal,
            isAllControls: false,
            isAllPages: false,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    applyDescriptionStyleToCurrentPageAllControls() {
      this[ACTIONS.APPLY_CONTROL_DESCRIPTION_STYLE_TO]({
            sourceControl: this.theLocal,
            isAllControls: true,
            isAllPages: false,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    applyDescriptionStyleToAllPageAllSameTypeControls() {
      this[ACTIONS.APPLY_CONTROL_DESCRIPTION_STYLE_TO]({
            sourceControl: this.theLocal,
            isAllControls: false,
            isAllPages: true,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    applyDescriptionStyleToAllPageAllControls() {
      this[ACTIONS.APPLY_CONTROL_DESCRIPTION_STYLE_TO]({
            sourceControl: this.theLocal,
            isAllControls: true,
            isAllPages: true,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    handleDescriptionStyleApplyToCommand(command) {
      return this[command]();
    },

    applyControlStyleToCurrentPageAllSameTypeControls() {
      this[ACTIONS.APPLY_CONTROL_STYLE_TO]({
            sourceControl: this.theLocal,
            isAllControls: false,
            isAllPages: false,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    applyControlStyleToCurrentPageAllControls() {
      this[ACTIONS.APPLY_CONTROL_STYLE_TO]({
            sourceControl: this.theLocal,
            isAllControls: true,
            isAllPages: false,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    applyControlStyleToAllPageAllSameTypeControls() {
      this[ACTIONS.APPLY_CONTROL_STYLE_TO]({
            sourceControl: this.theLocal,
            isAllControls: false,
            isAllPages: true,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    applyControlStyleToAllPageAllControls() {
      this[ACTIONS.APPLY_CONTROL_STYLE_TO]({
            sourceControl: this.theLocal,
            isAllControls: true,
            isAllPages: true,
          }
      ).then(() => {
        this.$message({
          type: 'success',
          message: `应用成功。`,
          center: true
        });
      });
    },

    handleControlStyleApplyToCommand(command) {
      return this[command]();
    },

  },

  watch: {
    theControl: {
      handler: function () {
        this.theLocal = cloneDeep(this.theControl);
      },
      deep: true
    },
    theLocal: {
      handler: function () {
        if (!isEqual(this.theLocal, this.theControl)) {
          this.theControl = this.theLocal;
        }
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters([
      'currentControl',
      'isCurrentPageRequireLogin',
      'isCurrentPageNewSubmit',
      'controlPermissions'
    ]),

    isFillable() {
      return controlTypes[this.theControl.type].fillable;
    },

    controlTypeName() {
      return controlTypes[this.theControl.type].name;
    },

    controlPermissionTypes() {
      return this.controlPermissions;
    },

    mandatoryShowable() {
      return !this.theLocal.autoCalculateEnabled;//只有数字控件和状态控件有该autoCalculateEnabled字段
    },

    autoFillShowable() {
      return isControlAutoFillEligible(this.currentControl) &&
          this.isCurrentPageRequireLogin &&
          this.isCurrentPageNewSubmit &&
          !this.theLocal.autoCalculateEnabled;
    },

    theControl: {
      get() {
        return this.currentControl;
      },

      set(control) {
        this[ACTIONS.UPDATE_CONTROL](control);
      }
    },

    controlHelpDocLinks() {
      return {
        SECTION_TITLE: '//docs.mryqr.com/page-controls/section-title',
        SEPARATOR: '//docs.mryqr.com/page-controls/separator',
        PARAGRAPH: '//docs.mryqr.com/page-controls/paragraph',
        RICH_TEXT: '//docs.mryqr.com/page-controls/rich-text-editor',
        IMAGE_CARD_LINK: '//docs.mryqr.com/page-controls/image-card-link',
        BUTTON_PAGE_LINK: '//docs.mryqr.com/page-controls/button-page-link',
        ICON_PAGE_LINK: '//docs.mryqr.com/page-controls/icon-page-link',
        INSTANCE_LIST: '//docs.mryqr.com/page-controls/instance-list',
        SUBMIT_HISTORY: '//docs.mryqr.com/page-controls/submit-history',
        ANSWER_REFERENCE: '//docs.mryqr.com/page-controls/answer-reference',
        SUBMISSION_REFERENCE: '//docs.mryqr.com/page-controls/submission-reference',
        IMAGE_VIEW: '//docs.mryqr.com/page-controls/image-view',
        VIDEO_VIEW: '//docs.mryqr.com/page-controls/video-view',
        ATTACHMENT_VIEW: '//docs.mryqr.com/page-controls/attachments',
        ATTRIBUTE_TABLE: '//docs.mryqr.com/page-controls/attributes-table',
        ATTRIBUTE_DASHBOARD: '//docs.mryqr.com/page-controls/attributes-dashboard',
        TREND: '//docs.mryqr.com/page-controls/trend',
        BAR: '//docs.mryqr.com/page-controls/bar',
        PIE: '//docs.mryqr.com/page-controls/pie',
        DOUGHNUT: '//docs.mryqr.com/page-controls/doughnut',
        TIME_SEGMENT: '//docs.mryqr.com/page-controls/time-segment',
        NUMBER_RANGE_SEGMENT: '//docs.mryqr.com/page-controls/number-range-segment',
        RADIO: '//docs.mryqr.com/page-controls/radio',
        CHECKBOX: '//docs.mryqr.com/page-controls/checkbox',
        SINGLE_LINE_TEXT: '//docs.mryqr.com/page-controls/single-line-text',
        MULTI_LINE_TEXT: '//docs.mryqr.com/page-controls/multi-line-text',
        RICH_TEXT_INPUT: '//docs.mryqr.com/page-controls/rich-text-input',
        DROPDOWN: '//docs.mryqr.com/page-controls/dropdown',
        MEMBER_SELECT: '//docs.mryqr.com/page-controls/member-select',
        FILE_UPLOAD: '//docs.mryqr.com/page-controls/file-upload',
        IMAGE_UPLOAD: '//docs.mryqr.com/page-controls/image-upload',
        ADDRESS: '//docs.mryqr.com/page-controls/address',
        GEOLOCATION: '//docs.mryqr.com/page-controls/geolocation',
        NUMBER_INPUT: '//docs.mryqr.com/page-controls/number-input',
        NUMBER_RANKING: '//docs.mryqr.com/page-controls/number-ranking',
        MOBILE: '//docs.mryqr.com/page-controls/mobile-number',
        IDENTIFIER: '//docs.mryqr.com/page-controls/identifier',
        PERSON_NAME: '//docs.mryqr.com/page-controls/person-name',
        EMAIL: '//docs.mryqr.com/page-controls/email',
        DATE: '//docs.mryqr.com/page-controls/date',
        TIME: '//docs.mryqr.com/page-controls/time',
        ITEM_COUNT: '//docs.mryqr.com/page-controls/item-count',
        ITEM_STATUS: '//docs.mryqr.com/page-controls/item-status',
        POINT_CHECK: '//docs.mryqr.com/page-controls/point-check',
        SIGNATURE: '//docs.mryqr.com/page-controls/signature',
        MULTI_LEVEL_SELECTION: '//docs.mryqr.com/page-controls/multi-level-selection'
      };
    }
  },
  validations: {
    theLocal: {
      name: {
        required,
      }
    }

  }
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-collapse-item__content {
      line-height: 1;
    }
  }
}

.content {
  padding: 0 25px;
}

.theTitle {
  width: 50%;
}

.settingCollapse {
  margin-top: 15px;
  margin-bottom: 20px;
}

.oneLineCheckbox {
  display: block;
  margin-top: 5px;
}

.applyToButton {
  display: flex;
  justify-content: flex-end;
}


</style>
