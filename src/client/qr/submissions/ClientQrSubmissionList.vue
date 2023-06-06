<template>
  <div v-if="initialised" :class="$style.wrapper">
    <header :class="$style.headerBar">
      <div :class="$style.iconButtonContainer">
        <button :class="$style.headerButton"
                class="majoricon i-left plainButton"
                title="返回首页"
                @click="goBackToQrHome">
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
            {{ pageActionNameOf(submission.pageId) }}
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
          <ClientQrSubmissionOperationButtons :submission="submission"></ClientQrSubmissionOperationButtons>
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

    <ClientQrSubmissionListFilterDrawer :selectablePages="selectablePages"
                                        :shouldShowPageSelect="shouldShowPageSelect"
                                        :show.sync="filterDialogVisible"
                                        :type="type">
    </ClientQrSubmissionListFilterDrawer>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import {controlFieldName, formatEpochToMinute, qrUrlWithSubmission} from "@/common/utils/common-utils";
import CLIENT_QR_SUBMISSION_LIST_ACTIONS from "@/client/qr/submissions/store/qr-submission-list-actions";
import ClientQrSubmissionOperationButtons from '@/client/qr/submissions/ClientQrSubmissionOperationButtons';
import ClientQrSubmissionListFilterDrawer from '@/client/qr/submissions/ClientQrSubmissionListFilterDrawer';
import AddressAnswer from '@/client/common/components/answer/AddressAnswer';
import CheckboxAnswer from '@/client/common/components/answer/CheckboxAnswer';
import DateAnswer from '@/client/common/components/answer/DateAnswer';
import DropdownAnswer from '@/client/common/components/answer/DropdownAnswer';
import EmailAnswer from '@/client/common/components/answer/EmailAnswer';
import GeolocationAnswer from '@/client/common/components/answer/GeolocationAnswer';
import IdentifierAnswer from '@/client/common/components/answer/IdentifierAnswer';
import ItemCountAnswer from '@/client/common/components/answer/ItemCountAnswer';
import ItemStatusAnswer from '@/client/common/components/answer/ItemStatusAnswer';
import MemberSelectAnswer from '@/client/common/components/answer/MemberSelectAnswer';
import MobileAnswer from '@/client/common/components/answer/MobileAnswer';
import NumberInputAnswer from '@/client/common/components/answer/NumberInputAnswer';
import NumberRankAnswer from '@/client/common/components/answer/NumberRankAnswer';
import PointCheckAnswer from '@/client/common/components/answer/PointCheckAnswer';
import MultiLevelSelectionAnswer from '@/client/common/components/answer/MultiLevelSelectionAnswer';
import RadioAnswer from '@/client/common/components/answer/RadioAnswer';
import SingleLineTextAnswer from '@/client/common/components/answer/SingleLineTextAnswer';
import PersonNameAnswer from '@/client/common/components/answer/PersonNameAnswer';
import TimeAnswer from '@/client/common/components/answer/TimeAnswer';
import FileUploadAnswer from '@/client/common/components/answer/FileUploadAnswer';
import SignatureAnswer from '@/client/common/components/answer/SignatureAnswer';
import ImageUploadAnswer from '@/client/common/components/answer/ImageUploadAnswer';
import MultiLineTextAnswer from '@/client/common/components/answer/MultiLineTextAnswer';
import RichTextInputAnswer from '@/client/common/components/answer/RichTextInputAnswer';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');
const clientQrSubmissionListStore = createNamespacedHelpers('CLIENT_QR_SUBMISSION_LIST_STORE');

export default {
  props: {
    selectablePages: {
      type: Array,
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
  },

  components: {
    ClientQrSubmissionOperationButtons,
    ClientQrSubmissionListFilterDrawer,
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
    ...clientQrStore.mapState([
      'canViewFillablePageIds',
      'canManageFillablePageIds',
      'canApproveFillablePageIds',
    ]),

    ...clientQrStore.mapGetters([
      'qrId',
      'homePageId',
      'pageActionNameOf',
      'answerViewableControlsOfPage',
      'submitterDesignationOf',
      'submitAtDesignationOf',
    ]),

    ...clientQrSubmissionListStore.mapState([
      'keepStateKey',
      'infiniteKey',
      'submissions',
      'search',
    ]),

    ...clientQrSubmissionListStore.mapGetters([
      'answerOf',
      'hasFilter',
    ]),

    shouldShowPageSelect() {
      return this.derivedInitPageId === 'ALL';
    },

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

    derivedInitPageId() {
      switch (this.type) {
        case 'SUBMITTER_SUBMISSION': {
          if (this.canViewFillablePageIds.length === 1 && this.initPageId === 'ALL') {
            return this.canViewFillablePageIds[0];
          }
          return this.initPageId;
        }

        case 'ALL_SUBMIT_HISTORY': {
          if (this.canManageFillablePageIds.length === 1 && this.initPageId === 'ALL') {
            return this.canManageFillablePageIds[0];
          }
          return this.initPageId;
        }

        case 'TO_BE_APPROVED': {
          if (this.canApproveFillablePageIds.length === 1 && this.initPageId === 'ALL') {
            return this.canApproveFillablePageIds[0];
          }
          return this.initPageId;
        }
      }
    },
  },

  methods: {
    ...clientQrSubmissionListStore.mapActions([
      CLIENT_QR_SUBMISSION_LIST_ACTIONS.LIST_QR_SUBMISSIONS,
      CLIENT_QR_SUBMISSION_LIST_ACTIONS.RE_FETCH_ACTIVE_SUBMISSION,
    ]),
    ...clientQrSubmissionListStore.mapMutations([
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
        qrId: this.qrId,
        pageId: this.derivedInitPageId,
        type: this.type
      });
    },

    goBackToQrHome() {
      this.$router.push({name: 'new-submission', params: {pageId: this.homePageId}});
    },

    onSearchBlurred() {
      this.resetInfinite();
    },

    onSearchEnter() {
      this.$refs.searchBox.blur();
    },

    openFilterDrawer() {
      this.filterDialogVisible = true;
    },

    gotoSubmission(submission) {
      this.setActiveSubmission(submission.id);
      let url = qrUrlWithSubmission(submission.plateId, submission.pageId, submission.id);
      if (this.type === 'TO_BE_APPROVED') {
        url = url + '?approval=true'
      }
      window.open(url, '_blank');
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

    displayTime(time) {
      return formatEpochToMinute(time);
    },

    fieldName(control) {
      return controlFieldName(control);
    },

    onVisible() {
      if (document.visibilityState === 'visible') {
        this.refreshKeepStateKey();
        this[CLIENT_QR_SUBMISSION_LIST_ACTIONS.RE_FETCH_ACTIVE_SUBMISSION]();
      }
    },

    infiniteHandler(infiniteState) {
      return this[CLIENT_QR_SUBMISSION_LIST_ACTIONS.LIST_QR_SUBMISSIONS](infiniteState);
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  background-color: $primaryBackgroundColor;
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
