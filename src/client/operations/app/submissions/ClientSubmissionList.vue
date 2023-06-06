<template>
  <div v-if="initialised" :class="$style.wrapper">
    <header :class="$style.headerBar">
      <div :class="$style.iconButtonContainer">
        <button :class="$style.headerButton"
                class="majoricon i-left plainButton"
                title="返回上级"
                @click="goToUpperLink">
        </button>
      </div>

      <section :class="$style.searchSection">
        <el-input
            :key="keepStateKey"
            ref="searchBox"
            v-model="theSearch"
            :class="$style.searchInput"
            :maxlength="50"
            placeholder="搜索..."
            size="small"
            title="搜索"
            @blur="onSearchBlurred"
            @keyup.enter.native="onSearchEnter">
        </el-input>
      </section>

      <div :class="$style.iconButtonContainer">
        <button :class="[$style.headerButton,{[$style.hasFilterButton]:hasFilter}]"
                class="majoricon i-filter plainButton"
                title="筛选"
                @click="openFilterDrawer">
        </button>
      </div>
    </header>

    <main :class="$style.mainContent">
      <div v-for="submission in viewableSubmissions" :class="$style.submissionContainer">
        <section :class="$style.submissionContentSection" @click="gotoSubmission(submission)">
          <div :class="$style.pageName" :style="pageNameStyle(submission)">
            {{ pageActionNameOf(submission.pageId) }}<span :class="$style.qrName">（{{ submission.qrName }}）</span>
          </div>

          <div :class="$style.submissionContentContainer">
            <div :class="$style.answerRow">
              <div :class="$style.fieldName"> {{ submitAtDesignationOf(submission.pageId) }}：</div>
              <span :class="$style.fieldValue">{{ displayTime(submission.createdAt) }}</span>
            </div>

            <div :class="$style.answerRow">
              <div :class="$style.fieldName"> {{ submitterDesignationOf(submission.pageId) }}：</div>
              <span :class="$style.fieldValue">{{ submission.creator }}</span>
            </div>

            <div v-for="control in answerViewableControlsOfPage(submission.pageId,type)"
                 :key="control.id"
                 :class="$style.answerRow">
              <div :class="$style.fieldName"> {{ fieldName(control) }}：</div>
              <span :class="$style.fieldValue">
                 <component :is="control.type"
                            :key="control.id"
                            :ref="control.id"
                            :control="control"
                            :value="answerOf(submission.id, control.id)"/>
              </span>
            </div>
          </div>
        </section>

        <section :class="$style.submissionDropdownSection">
          <ClientSubmissionOperationButtons :submission="submission"></ClientSubmissionOperationButtons>
        </section>
      </div>

      <InfiniteLoading :key="infiniteKey"
                       spinner="spiral"
                       @infinite="infiniteHandler">
        <div slot="no-more" :class="$style.infiniteMessage">
          <span v-if="submissions.length > 20">没有了</span>
        </div>
        <div slot="no-results" :class="$style.infiniteMessage">无数据</div>
      </InfiniteLoading>
    </main>

    <ClientSubmissionListFilterDrawer :selectableGroups="selectableGroups"
                                      :selectablePages="selectablePages"
                                      :shouldShowGroupSelect="shouldShowGroupSelect"
                                      :shouldShowPageSelect="shouldShowPageSelect"
                                      :show.sync="filterDialogVisible"
                                      :type="type">
    </ClientSubmissionListFilterDrawer>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import CLIENT_SUBMISSION_LIST_ACTIONS from "@/client/operations/app/submissions/store/client-submission-list-actions";
import {controlFieldName, formatEpochToMinute, qrUrlWithSubmission} from "@/common/utils/common-utils";
import ClientSubmissionOperationButtons from '@/client/operations/app/submissions/ClientSubmissionOperationButtons';
import ClientSubmissionListFilterDrawer from '@/client/operations/app/submissions/ClientSubmissionListFilterDrawer';
import AddressAnswer from "@/client/common/components/answer/AddressAnswer";
import CheckboxAnswer from "@/client/common/components/answer/CheckboxAnswer";
import DateAnswer from "@/client/common/components/answer/DateAnswer";
import DropdownAnswer from "@/client/common/components/answer/DropdownAnswer";
import EmailAnswer from "@/client/common/components/answer/EmailAnswer";
import GeolocationAnswer from "@/client/common/components/answer/GeolocationAnswer";
import IdentifierAnswer from "@/client/common/components/answer/IdentifierAnswer";
import ItemCountAnswer from "@/client/common/components/answer/ItemCountAnswer";
import ItemStatusAnswer from "@/client/common/components/answer/ItemStatusAnswer";
import MemberSelectAnswer from "@/client/common/components/answer/MemberSelectAnswer";
import MobileAnswer from "@/client/common/components/answer/MobileAnswer";
import NumberInputAnswer from "@/client/common/components/answer/NumberInputAnswer";
import NumberRankAnswer from "@/client/common/components/answer/NumberRankAnswer";
import PointCheckAnswer from "@/client/common/components/answer/PointCheckAnswer";
import MultiLevelSelectionAnswer from "@/client/common/components/answer/MultiLevelSelectionAnswer";
import RadioAnswer from "@/client/common/components/answer/RadioAnswer";
import SingleLineTextAnswer from "@/client/common/components/answer/SingleLineTextAnswer";
import PersonNameAnswer from '@/client/common/components/answer/PersonNameAnswer';
import TimeAnswer from "@/client/common/components/answer/TimeAnswer";
import ImageUploadAnswer from "@/client/common/components/answer/ImageUploadAnswer";
import SignatureAnswer from "@/client/common/components/answer/SignatureAnswer";
import FileUploadAnswer from "@/client/common/components/answer/FileUploadAnswer";
import MultiLineTextAnswer from "@/client/common/components/answer/MultiLineTextAnswer";
import RichTextInputAnswer from '@/client/common/components/answer/RichTextInputAnswer';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');
const clientSubmissionListStore = createNamespacedHelpers('CLIENT_SUBMISSION_LIST_STORE');

export default {
  props: {
    selectableGroups: {
      type: Array,
      default: function () {
        return [];
      },
    },

    selectablePages: {
      type: Array,
      required: true,
    },

    groupId: {
      type: String,
      required: true,
    },

    initPageId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true
    },

    upperLinkName: {
      type: String,
      required: true,
    },
  },

  components: {
    ClientSubmissionOperationButtons,
    ClientSubmissionListFilterDrawer,
    InfiniteLoading: () => import(/* webpackChunkName: "infinite-loading" */ 'vue-infinite-loading'),
    ADDRESS: AddressAnswer,
    CHECKBOX: CheckboxAnswer,
    DATE: DateAnswer,
    DROPDOWN: DropdownAnswer,
    EMAIL: EmailAnswer,
    GEOLOCATION: GeolocationAnswer,
    IDENTIFIER: IdentifierAnswer,
    ITEM_COUNT: ItemCountAnswer,
    ITEM_STATUS: ItemStatusAnswer,
    MEMBER_SELECT: MemberSelectAnswer,
    MOBILE: MobileAnswer,
    NUMBER_INPUT: NumberInputAnswer,
    NUMBER_RANKING: NumberRankAnswer,
    POINT_CHECK: PointCheckAnswer,
    MULTI_LEVEL_SELECTION: MultiLevelSelectionAnswer,
    RADIO: RadioAnswer,
    SINGLE_LINE_TEXT: SingleLineTextAnswer,
    PERSON_NAME: PersonNameAnswer,
    TIME: TimeAnswer,
    IMAGE_UPLOAD: ImageUploadAnswer,
    SIGNATURE: SignatureAnswer,
    FILE_UPLOAD: FileUploadAnswer,
    MULTI_LINE_TEXT: MultiLineTextAnswer,
    RICH_TEXT_INPUT: RichTextInputAnswer,
  },

  data() {
    return {
      initialised: false,
      filterDialogVisible: false,
    }
  },

  created() {
    this.init();
    this.initialised = true;
    document.addEventListener('visibilitychange', this.onVisible);
  },

  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.onVisible);
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'appId',
      'viewableGroupIds',
      'viewablePageIds',
      'managableGroupIds',
      'managablePageIds',
      'approvableGroupIds',
      'approvablePageIds',
      'pageActionNameOf',
      'answerViewableControlsOfPage',
      'submitterDesignationOf',
      'submitAtDesignationOf',
    ]),

    ...clientSubmissionListStore.mapState([
      'keepStateKey',
      'infiniteKey',
      'submissions',
      'search',
    ]),

    ...clientSubmissionListStore.mapGetters([
      'answerOf',
      'hasFilter',
    ]),

    viewableSubmissions() {
      if (this.type === 'TO_BE_APPROVED') {//待审批时，审批完后的submission应该过滤掉
        return this.submissions.filter(sumission => {
          return sumission.approvalStatus === 'NONE'
        })
      }

      return this.submissions;
    },

    theSearch: {
      get() {
        return this.search;
      },

      set(value) {
        this.updateSearch(value);
      }
    },

    derivedGroupId() {
      switch (this.type) {
        case 'SUBMITTER_SUBMISSION': {
          if (this.viewableGroupIds.length === 1 && this.groupId === 'ALL') {
            return this.viewableGroupIds[0];
          }
          return this.groupId;
        }

        case 'ALL_SUBMIT_HISTORY': {
          if (this.managableGroupIds.length === 1 && this.groupId === 'ALL') {
            return this.managableGroupIds[0];
          }
          return this.groupId;
        }

        case 'TO_BE_APPROVED': {
          if (this.approvableGroupIds.length === 1 && this.groupId === 'ALL') {
            return this.approvableGroupIds[0];
          }
          return this.groupId;
        }
      }
    },

    derivedInitPageId() {
      switch (this.type) {
        case 'SUBMITTER_SUBMISSION': {
          if (this.viewablePageIds.length === 1 && this.initPageId === 'ALL') {
            return this.viewablePageIds[0];
          }
          return this.initPageId;
        }

        case 'ALL_SUBMIT_HISTORY': {
          if (this.managablePageIds.length === 1 && this.initPageId === 'ALL') {
            return this.managablePageIds[0];
          }
          return this.initPageId;
        }

        case 'TO_BE_APPROVED': {
          if (this.approvablePageIds.length === 1 && this.initPageId === 'ALL') {
            return this.approvablePageIds[0];
          }
          return this.initPageId;
        }
      }
    },

    shouldShowGroupSelect() {
      return this.derivedGroupId === 'ALL';
    },

    shouldShowPageSelect() {
      return this.derivedInitPageId === 'ALL';
    },
  },

  methods: {
    ...clientSubmissionListStore.mapActions([
      CLIENT_SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS,
      CLIENT_SUBMISSION_LIST_ACTIONS.RE_FETCH_ACTIVE_SUBMISSION,
    ]),

    ...clientSubmissionListStore.mapMutations([
      'resetState',
      'initState',
      'refreshKeepStateKey',
      'updateSearch',
      'resetInfinite',
      'setActiveSubmission',
    ]),

    init() {
      this.resetState();
      this.initState({
        appId: this.appId,
        originGroupId: this.groupId,
        groupId: this.derivedGroupId,
        pageId: this.derivedInitPageId,
        type: this.type
      });
    },

    goToUpperLink() {
      this.$router.push({name: this.upperLinkName});
    },

    onSearchEnter() {
      this.$refs.searchBox.blur();
    },

    onSearchBlurred() {
      this.resetInfinite();
    },

    openFilterDrawer() {
      this.filterDialogVisible = true;
    },

    infiniteHandler(infiniteState) {
      return this[CLIENT_SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS](infiniteState);
    },

    pageNameStyle(submission) {
      switch (submission.approvalStatus) {
        case 'PASSED': {
          return {
            borderLeftColor: '#10b01b'
          }
        }

        case 'NOT_PASSED': {
          return {
            borderLeftColor: '#ea0000'
          }
        }
      }
    },

    gotoSubmission(submission) {
      this.setActiveSubmission(submission.id);
      let url = qrUrlWithSubmission(submission.plateId, submission.pageId, submission.id);
      if (this.type === 'TO_BE_APPROVED') {
        url = url + '?approval=true'
      }
      window.open(url, '_blank');
    },

    displayTime(time) {
      return formatEpochToMinute(time);
    },

    fieldName(control) {
      return controlFieldName(control);
    },

    onVisible() {
      if (document.visibilityState === 'visible') {
        this.refreshKeepStateKey();
        this[CLIENT_SUBMISSION_LIST_ACTIONS.RE_FETCH_ACTIVE_SUBMISSION]();
      }
    },
  },

}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  overflow-y: auto;
}

.headerBar {
  height: $clientTopBarHeight;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: $clientPageZIndex + 1;
  background-color: white;
  display: flex;
  align-items: center;
  box-shadow: $lightShadow;
}

.headerButton {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $clientIconButtonLength;
  height: $clientIconButtonLength;
  font-size: 20px;
  color: $regularTextColor;
}

.searchSection {
  flex-shrink: 1;
  flex-grow: 1;
  margin-left: 20px;
  margin-right: 10px;
}

.searchInput {
  width: 100%;
}

.iconButtonContainer {
  flex-shrink: 0;
  flex-grow: 0;
  padding: 10px;
}

.hasFilterButton {
  color: $oppositeThemeColor;
}

.hasFilterButton:before {
  font-weight: 500;
}

.mainContent {
  background-color: $primaryBackgroundColor;
  position: relative;
  z-index: $clientPageZIndex;
  margin-top: $clientTopBarHeight;
  padding: 12px 10px;
  height: calc(100vh - #{$clientTopBarHeight});
  overflow-y: auto;
}

.submissionContainer {
  background-color: white;
  margin-bottom: 12px;
  padding: 10px;
  min-height: 80px;
  display: flex;
}

.submissionContentSection {
  flex-grow: 1;
  margin-right: 5px;
}

.pageName {
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: 5px;
  color: $primaryTextColor;
  border-left: 3px solid $primaryThemeColor;
  padding-left: 5px;
}

.qrName {
  font-size: 12px;
  color: $secondaryTextColor;
}

.submissionContentContainer {
  font-size: 13px;
  color: #b0b5bd;
}

.answerRow {
  margin-bottom: 5px;
  line-height: 1.3em;
  display: flex;
}

.answerRow:last-child {
  margin-bottom: 0;
}

.fieldName {
  width: 80px;
  overflow: hidden;
  flex-shrink: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.fieldValue {
  flex-grow: 1;
  word-break: break-all;
  color: $secondaryTextColor;
}

.submissionDropdownSection {

}

.infiniteMessage {
  padding-bottom: 15px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .mainContent {
    padding: 15px 10px;
  }

  .submissionContainer {
    margin-bottom: 15px;
  }

  .fieldName {
    width: 100px;
  }
}
</style>
