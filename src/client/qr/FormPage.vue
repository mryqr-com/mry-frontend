<template>
  <div v-if="ready" id="form-page" :class="$style.wrapper">
    <div :class="$style.profileButtonArea">
      <span v-if="readOnlyText" :class="$style.profileTag">{{ readOnlyText }}</span>
      <span v-if="approvalText" :class="$style.profileTag" :style="approvalTagStyle">{{ approvalText }}</span>
      <QrFormPageProfile :class="$style.profileButton" :submissionId="submissionId"></QrFormPageProfile>
    </div>
    <PageHeaderContainer></PageHeaderContainer>

    <div :class="$style.content" :style="contentStyle">
      <PageTitleContainer></PageTitleContainer>

      <div v-if="updateButtonViewable" :class="$style.updateButtonContainer">
        <el-button icon="el-icon-edit-outline" size="medium" type="primary" @click="enterUpdateMode">编辑</el-button>
      </div>

      <!--控件列表-->
      <component :is="control.type"
                 v-for="(control, index) in allViewableControlsOnCurrentPage"
                 :key="control.id"
                 :ref="control.id"
                 :answer="answerForControl(control.id)"
                 :answers="answers"
                 :control="control"
                 :index="index"
                 :viewOnly="isViewOnlyMode"/>

      <!--提交者信息-->
      <div v-if="isViewOnlyMode && !isCurrentPagePerInstanceSubmit"
           :class="[$style.topLevelSection,$style.submitterInfo]">
        <SubmitterInfo :submission="currentSubmission" @approvalEntered="showApprovalInput"></SubmitterInfo>
      </div>

      <!--已审批的信息-->
      <div v-if="isViewOnlyMode && isCurrentSubmissionApproved" :class="$style.topLevelSection">
        <ApprovalInfo :approval="currentSubmission.approval"></ApprovalInfo>
      </div>

      <!--审批控件-->
      <div v-if="isApprovalMode && !isCurrentSubmissionApproved" :class="$style.topLevelSection">
        <ApprovalInput ref="approvalInput" @submitted="approve"></ApprovalInput>
      </div>

      <!--提交按钮-->
      <div v-if="hasToBeSubmittedControls && !isViewOnlyMode"
           :class="$style.submitButtonWrapper">
        <StyledButton :buttonStyle="currentPageSubmitButton.buttonStyle"
                      :class="[{[$style.submitButtonLocked]:disableSubmitButton},$style.submitButton]"
                      @click="submit">
          {{ submitButtonText }}
        </StyledButton>
      </div>
    </div>

    <!--菜单-->
    <template v-if="isCurrentHomePage &&
        shouldCurrentPageShowMenu &&
        viewableMenuLinks.length > 0 &&
        (isDefaultMode || isCurrentPagePerMemberSubmit || isCurrentPagePerInstanceSubmit)">
      <div :class="$style.menuSupporter"></div>
      <MenuContainer :class="$style.menu"></MenuContainer>
    </template>

  </div>
</template>

<script>
import submissionApi from '@/common/api/submission-api'
import commonApi from '@/common/api/common-api'
import {createNamespacedHelpers} from 'vuex';
import controlAnswerInitializer from '@/client/qr/control-answer-initializer'
import wx from 'weixin-js-sdk';

import SectionTitleControlContainer from '@/client/qr/control/SectionTitleContainer';
import SeparatorContainer from '@/client/qr/control/SeparatorContainer';
import RichTextContainer from '@/client/qr/control/RichTextContainer';
import RadioContainer from '@/client/qr/control/RadioContainer';
import CheckboxContainer from '@/client/qr/control/CheckboxContainer';
import IdentifierContainer from '@/client/qr/control/IdentifierContainer';
import SingleLineTextContainer from '@/client/qr/control/SingleLineTextContainer';
import PersonNameContainer from '@/client/qr/control/PersonNameContainer';
import MultiLineTextContainer from '@/client/qr/control/MultiLineTextContainer';
import RichTextInputContainer from '@/client/qr/control/RichTextInputContainer';
import DropdownContainer from '@/client/qr/control/DropdownContainer';
import MemberSelectContainer from '@/client/qr/control/MemberSelectContainer';
import FileUploadContainer from '@/client/qr/control/FileUploadContainer';
import ImageUploadContainer from '@/client/qr/control/ImageUploadContainer';
import SignatureContainer from '@/client/qr/control/SignatureContainer';
import AddressContainer from '@/client/qr/control/AddressContainer';
import GeolocationContainer from '@/client/qr/control/GeolocationContainer';
import NumberInputContainer from '@/client/qr/control/NumberInputContainer';
import NumberRankingContainer from '@/client/qr/control/NumberRankingContainer';
import MobileContainer from '@/client/qr/control/MobileContainer';
import EmailContainer from '@/client/qr/control/EmailContainer';
import DateContainer from '@/client/qr/control/DateContainer';
import TimeContainer from '@/client/qr/control/TimeContainer';
import ItemStatusContainer from '@/client/qr/control/ItemStatusContainer';
import PointCheckContainer from '@/client/qr/control/PointCheckContainer';
import ItemCountContainer from '@/client/qr/control/ItemCountContainer';
import PageHeaderContainer from '@/client/qr/PageHeaderContainer';
import PageTitleContainer from '@/client/qr/PageTitleContainer';
import ParagraphContainer from '@/client/qr/control/ParagraphContainer';
import SubmitHistoryContainer from '@/client/qr/control/SubmitHistoryContainer';
import InstanceListContainer from '@/client/qr/control/InstanceListContainer';
import ImageViewContainer from '@/client/qr/control/ImageViewContainer';
import VideoViewContainer from '@/client/qr/control/VideoViewContainer';
import AttachmentViewContainer from '@/client/qr/control/AttachmentViewContainer';
import ImageLinkCardContainer from '@/client/qr/control/ImageLinkCardContainer';
import MenuContainer from '@/client/qr/MenuContainer';
import ButtonPageLinkContainer from '@/client/qr/control/ButtonPageLinkContainer';
import IconPageLinkContainer from '@/client/qr/control/IconPageLinkContainer';
import SubmissionReferenceContainer from '@/client/qr/control/SubmissionReferenceContainer';
import AnswerReferenceContainer from '@/client/qr/control/AnswerReferenceContainer';
import AttributeTableContainer from '@/client/qr/control/AttributeTableContainer';
import AttributeDashboardContainer from '@/client/qr/control/AttributeDashboardContainer';
import BarContainer from '@/client/qr/control/BarContainer';
import PieContainer from '@/client/qr/control/PieContainer';
import DoughnutContainer from '@/client/qr/control/DoughnutContainer';
import TrendContainer from '@/client/qr/control/TrendContainer';
import TimeSegmentContainer from '@/client/qr/control/TimeSegmentContainer';
import NumberRangeSegmentContainer from '@/client/qr/control/NumberRangeSegmentContainer';
import MultiLevelSelectionContainer from '@/client/qr/control/MultiLevelSelectionContainer';
import {displayErrorMessage, formatEpochToMinute, isInWx, isValidHttpUrl} from '@/common/utils/common-utils';
import SubmitterInfo from '@/client/qr/SubmitterInfo';
import ApprovalInput from '@/client/qr/ApprovalInput';
import ApprovalInfo from '@/client/qr/ApprovalInfo';
import QrFormPageProfile from '@/client/qr/QrFormPageProfile';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['pageId', 'submissionId'],

  data() {
    return {
      answers: [],
      ready: false,
      disableSubmitButton: false
    }
  },

  components: {
    QrFormPageProfile,
    SubmitterInfo,
    ApprovalInput,
    ApprovalInfo,
    MenuContainer: MenuContainer,
    PageTitleContainer: PageTitleContainer,
    PageHeaderContainer: PageHeaderContainer,
    RADIO: RadioContainer,
    CHECKBOX: CheckboxContainer,
    IDENTIFIER: IdentifierContainer,
    SINGLE_LINE_TEXT: SingleLineTextContainer,
    PERSON_NAME: PersonNameContainer,
    MULTI_LINE_TEXT: MultiLineTextContainer,
    RICH_TEXT_INPUT: RichTextInputContainer,
    DROPDOWN: DropdownContainer,
    MEMBER_SELECT: MemberSelectContainer,
    FILE_UPLOAD: FileUploadContainer,
    IMAGE_UPLOAD: ImageUploadContainer,
    SIGNATURE: SignatureContainer,
    NUMBER_INPUT: NumberInputContainer,
    NUMBER_RANKING: NumberRankingContainer,
    MOBILE: MobileContainer,
    EMAIL: EmailContainer,
    DATE: DateContainer,
    TIME: TimeContainer,
    ITEM_STATUS: ItemStatusContainer,
    ITEM_COUNT: ItemCountContainer,
    POINT_CHECK: PointCheckContainer,
    GEOLOCATION: GeolocationContainer,
    ADDRESS: AddressContainer,
    SUBMIT_HISTORY: SubmitHistoryContainer,
    INSTANCE_LIST: InstanceListContainer,
    PARAGRAPH: ParagraphContainer,
    BUTTON_PAGE_LINK: ButtonPageLinkContainer,
    ICON_PAGE_LINK: IconPageLinkContainer,
    SECTION_TITLE: SectionTitleControlContainer,
    SEPARATOR: SeparatorContainer,
    RICH_TEXT: RichTextContainer,
    IMAGE_VIEW: ImageViewContainer,
    VIDEO_VIEW: VideoViewContainer,
    ATTACHMENT_VIEW: AttachmentViewContainer,
    IMAGE_CARD_LINK: ImageLinkCardContainer,
    SUBMISSION_REFERENCE: SubmissionReferenceContainer,
    ANSWER_REFERENCE: AnswerReferenceContainer,
    ATTRIBUTE_TABLE: AttributeTableContainer,
    ATTRIBUTE_DASHBOARD: AttributeDashboardContainer,
    BAR: BarContainer,
    PIE: PieContainer,
    DOUGHNUT: DoughnutContainer,
    TREND: TrendContainer,
    TIME_SEGMENT: TimeSegmentContainer,
    NUMBER_RANGE_SEGMENT: NumberRangeSegmentContainer,
    MULTI_LEVEL_SELECTION: MultiLevelSelectionContainer,
  },

  created() {
    //每次进入某个页面时，先重置mode和submission
    this.resetPage();

    //如需登录，则首先登录
    if (this.isCurrentPageRequireLogin && !this.isLoggedIn) {
      this.$router.replace({name: 'login', query: {from: location.href}});
      return;
    }

    //检查是否有权限访问当前页面，对页面有权限是所有后续操作的先决条件
    if (!this.hasAccessToCurrentPage) {
      displayErrorMessage(403, "无权访问")
      return;
    }

    if (this.isQrTemplate) {
      this.setMode('DEFAULT');
      this.initAnswers();
      return;
    }

    if (this.isCurrentPagePerInstanceSubmit) {
      return submissionApi.tryFetchInstanceLastSubmission(this.qrId, this.pageId).then(response => {
        let submission = response.data;

        if (submission) {
          this.setMode('READONLY');
          this.loadSubmission(submission);
          this.populateAnswers(submission.answers);
        } else {
          this.setMode('DEFAULT');
          this.initAnswers();
        }
      });
    }

    if (!this.submissionId) {
      if (this.isCurrentPageNewSubmit) {
        this.setMode('DEFAULT');
        if (this.isCurrentPageAutoFillable && this.isCurrentPageRequireLogin) {
          try {
            submissionApi.tryFetchSubmissionAnswersForAutoFill(this.qrId, this.pageId).then(response => {
              let answers = response.data;
              this.populateAnswers(answers);
            });
          } catch (err) {
            console.warn("Failed to fetch answers for auto fill.");
            this.initAnswers();
          }
        } else {
          this.initAnswers();
        }
        return;
      }

      if (this.isCurrentPagePerMemberSubmit) {
        return submissionApi.tryFetchMyLastSubmission(this.qrId, this.pageId).then(response => {
          let submission = response.data;

          if (submission) {
            this.setMode('READONLY');
            this.loadSubmission(submission);
            this.populateAnswers(submission.answers);
          } else {
            this.setMode('DEFAULT');
            this.initAnswers();
          }
        });
      }
    }

    return submissionApi.fetchDetailedSubmission(this.submissionId).then(response => {
      let submission = response.data;

      if (submission.pageId !== this.currentPageId) {
        displayErrorMessage(403, "无权访问")
        return;
      }

      this.loadSubmission(submission);

      if (this.$route.query.approval && this.isCurrentPageApprovalEnabled) {
        this.setMode('APPROVAL');
        this.populateAnswers(submission.answers);
        return;
      }

      this.setMode('READONLY');
      this.populateAnswers(submission.answers);
    });
  },

  mounted() {
    if (isInWx()) {
      let url = location.href.split('#')[0];
      commonApi.fetchWxJsSdkConfig(url).then(response => {
        let config = response.data;
        wx.config({
          appId: config.appId,
          timestamp: config.timestamp,
          nonceStr: config.nonce,
          signature: config.signature,
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
        });
      }).catch(e => console.info(e));

      let _this = this;
      wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData({
          title: _this.wxShareTitle,
          desc: _this.wxShareDescription ? _this.wxShareDescription : '',
          link: location.href,
          imgUrl: _this.wxShareImageUrl,
          success: function () {
          }
        });

        wx.updateTimelineShareData({
          title: _this.wxShareTitle,
          link: location.href,
          imgUrl: _this.wxShareImageUrl,
          success: function () {
          }
        });
      });
    }
  },

  methods: {
    ...clientQrStore.mapMutations([
      'setMode',
      'resetPage',
      'loadSubmission',
      'updateCirculationAfterSubmission',
    ]),

    formatEpochToMinute: formatEpochToMinute,

    initAnswers() {
      this.allFillableControlsOnCurrentPage.forEach(control => {
        let answer = controlAnswerInitializer[control.type](control, null);
        this.answers.push(answer);
      });
      this.ready = true;
    },

    populateAnswers(originalAnswers) {
      this.allFillableControlsOnCurrentPage.forEach(control => {
        let originalAnswer = originalAnswers.find(o => o.controlId === control.id);
        let answer = controlAnswerInitializer[control.type](control, originalAnswer);
        this.answers.push(answer);
      });
      this.ready = true;
    },

    checkForm() {
      let isFormValid = true;
      let firstInvalidControl;

      this.tobeSubmittedControlIdsOnCurrentPage.forEach(id => {
        this.$refs[id][0].$v.$touch();
        if (this.$refs[id][0].$v.$invalid) {
          isFormValid = false;

          if (!firstInvalidControl) {
            firstInvalidControl = this.$refs[id][0];
          }
        }
      });

      if (firstInvalidControl) {
        firstInvalidControl.$el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
        return false;
      }

      return true;
    },

    enterUpdateMode() {
      this.setMode('UPDATE');
    },

    submit() {
      if (!this.checkForm()) {
        return;
      }

      this.disableSubmitButton = true;
      let thePromise = null;
      let theAnswers = this.answers.filter(answer => {
        return this.tobeSubmittedControlIdsOnCurrentPage.includes(answer.controlId);
      });

      switch (this.mode) {
        case 'DEFAULT': {
          thePromise = submissionApi.newSubmission({
            qrId: this.qrId,
            pageId: this.pageId,
            answers: theAnswers,
            referenceData: this.referenceData,
          }).then((response) => {
            this.updateCirculationAfterSubmission(this.pageId);
            return response.data.id;
          });
          break;
        }

        case 'UPDATE': {
          thePromise = submissionApi.updateSubmission(this.currentSubmissionId, {answers: theAnswers})
              .then(() => {
                return this.currentSubmissionId;
              });
          break;
        }

        default: {
          thePromise = Promise.reject(`不支持该模式${this.mode}`)
        }
      }

      return thePromise.then((submissionId) => {
        this.afterSubmit(submissionId);
      }).finally(() => {
        this.disableSubmitButton = false;
      });
    },

    approve(approval) {
      this.disableSubmitButton = true;
      return submissionApi.approveSubmission(this.currentSubmission.id, {
        passed: approval.passed,
        note: approval.note,
      }).then(() => {
        this.$router.replace({
          name: "submitted",
          query: {
            submissionId: this.currentSubmission.id,
          }
        });
      }).finally(() => {
        this.disableSubmitButton = false;
      })
    },

    afterSubmit(submissionId) {
      if (!this.isDefaultMode || this.currentPageAfterSubmitBehaviour.type === 'DEFAULT') {
        this.$router.replace({
          name: "submitted",
          query: {
            submissionId: submissionId,
          }
        });
        return;
      }

      if (this.currentPageAfterSubmitBehaviour.enableMessage) {
        this.$message({
          type: 'success',
          message: `${this.currentPageAfterSubmitBehaviour.message}`,
          center: true,
        });
      }

      if (this.currentPageAfterSubmitBehaviour.type === 'INTERNAL_PAGE') {
        if (this.currentPageAfterSubmitBehaviour.internalPageId !== this.currentPageId) {
          this.$router.push({
            name: "new-submission",
            params: {pageId: this.currentPageAfterSubmitBehaviour.internalPageId}
          });
        } else {//当导向页面恰为当前页面时，刷新当前页面
          this.$router.go();
        }

        return;
      }

      if (this.currentPageAfterSubmitBehaviour.type === 'EXTERNAL_URL') {
        if (isValidHttpUrl(this.currentPageAfterSubmitBehaviour.externalUrl)) {//URL为合法的HTTP链接才导向链接
          let url = new URL(this.currentPageAfterSubmitBehaviour.externalUrl);
          url.searchParams.append('mry_submission_id', submissionId);
          window.open(url.toString(), "_self");
        } else {
          this.$router.replace({
            name: "submitted",
            query: {
              submissionId: submissionId,
            }
          });
        }
      }
    },

    answerForControl(controlId) {
      return this.answers.find(a => a.controlId === controlId);
    },

    showApprovalInput() {
      this.$nextTick(() => {
        this.$refs["approvalInput"].$el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      });
    }
  },

  computed: {
    ...clientQrStore.mapGetters([
      'isLoggedIn',
      'memberId',
      'mode',
      'isQrTemplate',
      'viewableMenuLinks',
      'qrName',
      'qrDescription',
      'qrId',
      'appId',
      'currentPage',
      'currentPageId',
      'pageExists',
      'homePage',
      'isCurrentHomePage',
      'currentPageHeader',
      'shouldCurrentPageShowHeader',
      'shouldCurrentPageShowTitle',
      'canManageQr',
      'isCurrentPageRequireLogin',
      'hasAccessToCurrentPage',
      'isCurrentPagePerInstanceSubmit',
      'isCurrentPagePerMemberSubmit',
      'isCurrentPageNewSubmit',
      'isCurrentPageAutoFillable',
      'currentSubmission',
      'isCurrentPageApprovalEnabled',
      'isViewOnlyMode',
      'isDefaultMode',
      'isUpdateMode',
      'isReadOnlyMode',
      'isApprovalMode',
      'allViewableControlsOnCurrentPage',
      'tobeSubmittedControlIdsOnCurrentPage',
      'allFillableControlsOnCurrentPage',
      'isCurrentSubmissionApproved',
      'currentSubmissionId',
      'currentPageContentMaxWidth',
      'shouldCurrentPageShowMenu',
      'currentPageSubmitButton',
      'canApproveCurrentSubmission',
      'currentPageAfterSubmitBehaviour',
      'referenceData',
      'canUpdateCurrentSubmission',
    ]),

    wxShareTitle() {
      if (this.isCurrentHomePage) {
        return this.qrName;
      }

      if (!this.shouldCurrentPageShowTitle) {
        return this.qrName;
      }

      return this.currentPage.title.text + ' — ' + this.qrName;
    },

    wxShareDescription() {
      if (this.isCurrentHomePage) {
        return this.qrDescription ? this.qrDescription : this.currentPage.title.description;
      }

      return this.currentPage.title.description;
    },

    wxShareImageUrl() {
      if (!this.shouldCurrentPageShowHeader) {
        return null;
      }

      return this.currentPageHeader.image ? this.currentPageHeader.image.fileUrl : null;
    },

    readOnlyText() {
      if (this.isReadOnlyMode) {
        return '只读模式';
      }
    },

    approvalText() {
      if (!this.isViewOnlyMode) {
        return;
      }

      if (this.isCurrentSubmissionApproved) {
        return '已审批';
      }

      if (this.canApproveCurrentSubmission) {
        return '待审批';
      }
    },

    approvalTagStyle() {
      if (!this.isCurrentSubmissionApproved) {
        return;
      }

      return this.currentSubmission.approval.passed ? {
        backgroundColor: '#10b01b'
      } : {
        backgroundColor: '#ea0000'
      };
    },

    updateButtonViewable() {
      return (this.isReadOnlyMode || this.isApprovalMode) && this.canUpdateCurrentSubmission;
    },

    contentStyle() {
      return {
        maxWidth: this.currentPageContentMaxWidth + 'px',
      }
    },

    hasToBeSubmittedControls() {
      return this.tobeSubmittedControlIdsOnCurrentPage.length > 0;
    },

    submitButtonText() {
      if (this.isUpdateMode) {
        return "更新";
      }

      return this.currentPageSubmitButton.text;
    },
  }
}

</script>

<style lang="scss" module>
.wrapper {
  position: relative;
  min-height: 100%;
}

.profileButtonArea {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: $clientPageZIndex + 1;
  display: flex;
  align-items: center;
}

.profileTag {
  font-size: 13px;
  background-color: $oppositeThemeColor;
  border-radius: 2px;
  color: white;
  padding: 3px 5px;
  margin-left: 6px;
}

.profileButton {
  margin-left: 10px;
}

.content {
  margin-left: auto;
  margin-right: auto;
}

.updateButtonContainer {
  padding-right: $narrowPageVPadding;
  padding-left: $narrowPageVPadding;
  display: flex;
  justify-content: flex-end;
}

.lockedControl {
  pointer-events: none;
}

.topLevelSection {
  padding-bottom: 25px;
  padding-right: $narrowPageVPadding;
  padding-left: $narrowPageVPadding;
}

.submitterInfo {
  margin-top: 25px;
}

.submitButtonWrapper {
  padding: 36px $narrowPageVPadding 50px;
}

.submitButtonLocked {
  pointer-events: none;
}

.menuSupporter {
  height: $formPageMenuHeight;
}

.menu {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 100;
  width: 100vw;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .wrapper {
    min-height: auto;
  }

  .updateButtonContainer {
    padding-right: $widePageVPadding;
    padding-left: $widePageVPadding;
  }

  .profileButtonArea {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    align-items: center;
  }

  .topLevelSection {
    padding-right: $widePageVPadding;
    padding-left: $widePageVPadding;
  }

  .submitButtonWrapper {
    padding-right: $widePageVPadding;
    padding-left: $widePageVPadding;
    text-align: center;
  }

  .submitButton {
    width: $maxControlButtonWidth !important;
  }

  .menuSupporter {
    display: none;
  }

  .menu {
    position: sticky;
    bottom: 0;
    z-index: 100;
    width: auto;
  }

}

@media print {
  .wrapper {
    min-height: 100%;
  }

  .profileButtonArea {
    display: none;
  }

  .updateButtonContainer {
    display: none;
  }
}

</style>
