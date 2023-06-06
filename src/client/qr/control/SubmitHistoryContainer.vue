<template>
  <ControlWrapper v-if="shouldShowControl" :class="$style.wrapper" :control="control" :index="index">
    <el-timeline v-if="submissions.length > 0">
      <el-timeline-item v-for="submission in submissions"
                        :key="submission.id"
                        :timestamp="displayTime(submission.createdAt)"
                        placement="top">
        <el-card :class="[$style.elCard,{[$style.nameClickable]: canManageQr}]" :style="cardStyle">
          <div @click="tryOpen(submission.pageId, submission.id)">
            <div v-if="control.showPageName" :class="$style.pageName">
              {{ pageActionNameOf(submission.pageId) }}
            </div>

            <div v-if="control.showSubmitter && isPageRequireLogin(submission.pageId)" :class="$style.contentRow">
              <div :class="$style.fieldName"> {{ submitterDesignationOf(submission.pageId) }}：</div>
              <span :class="$style.valueText">{{ submission.creator }}</span>
            </div>

            <div v-for="control in submissionSummaryEligibleControlsOfPage(submission.pageId)"
                 :key="control.id"
                 :class="$style.contentRow">
              <div :class="$style.fieldName"> {{ fieldName(control) }}</div>
              <span :class="$style.valueText">
                 <component :is="control.type"
                            :key="control.id"
                            :ref="control.id"
                            :control="control"
                            :value="submission.values.get(control.id)"/>
              </span>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <div v-else>无数据</div>
  </ControlWrapper>
</template>

<script>
import presentationApi from '@/common/api/presentation-api';
import {createNamespacedHelpers} from "vuex";
import {
  appearanceStyles,
  controlFieldName,
  formatEpochToMinute,
  qrUrlWithSubmission
} from "@/common/utils/common-utils";
import AddressAnswer from '@/client/common/components/answer/AddressAnswer';
import CheckboxAnswer from '@/client/common/components/answer/CheckboxAnswer';
import DateAnswer from '@/client/common/components/answer/DateAnswer';
import DropdownAnswer from '@/client/common/components/answer/DropdownAnswer';
import EmailAnswer from '@/client/common/components/answer/EmailAnswer';
import GeolocationAnswer from '@/client/common/components/answer/GeolocationAnswer';
import FileUploadAnswer from '@/client/common/components/answer/FileUploadAnswer';
import IdentifierAnswer from '@/client/common/components/answer/IdentifierAnswer';
import ItemCountAnswer from '@/client/common/components/answer/ItemCountAnswer';
import ItemStatusAnswer from '@/client/common/components/answer/ItemStatusAnswer';
import MemberSelectAnswer from '@/client/common/components/answer/MemberSelectAnswer';
import MobileAnswer from '@/client/common/components/answer/MobileAnswer';
import NumberInputAnswer from '@/client/common/components/answer/NumberInputAnswer';
import MultiLineTextAnswer from '@/client/common/components/answer/MultiLineTextAnswer';
import RichTextInputAnswer from '@/client/common/components/answer/RichTextInputAnswer';
import ImageUploadAnswer from '@/client/common/components/answer/ImageUploadAnswer';
import NumberRankAnswer from '@/client/common/components/answer/NumberRankAnswer';
import PointCheckAnswer from '@/client/common/components/answer/PointCheckAnswer';
import SignatureAnswer from '@/client/common/components/answer/SignatureAnswer';
import MultiLevelSelectionAnswer from '@/client/common/components/answer/MultiLevelSelectionAnswer';
import RadioAnswer from '@/client/common/components/answer/RadioAnswer';
import SingleLineTextAnswer from '@/client/common/components/answer/SingleLineTextAnswer';
import PersonNameAnswer from '@/client/common/components/answer/PersonNameAnswer';
import TimeAnswer from '@/client/common/components/answer/TimeAnswer';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],
  components: {
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
    MULTI_LINE_TEXT: MultiLineTextAnswer,
    RICH_TEXT_INPUT: RichTextInputAnswer,
    TIME: TimeAnswer,
    IMAGE_UPLOAD: ImageUploadAnswer,
    SIGNATURE: SignatureAnswer,
    FILE_UPLOAD: FileUploadAnswer,
  },

  data() {
    return {
      submissions: [],
      loaded: false,
    }
  },

  created() {
    if (!this.control.complete) {
      console.error(`Submit history control[${this.control.id}] is not complete.`)
      this.loaded = true;
      return;
    }

    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => {
          this.submissions = response.data.submissions;
          this.submissions.forEach(submission => {
            submission.values = new Map(Object.entries(submission.values));
          })
        })
        .catch(e => {
          console.error("Failed to fetch submit history:" + e.message)
        })
        .finally(() => this.loaded = true);
  },

  computed: {
    ...clientQrStore.mapGetters([
      'qrId',
      'currentPageId',
      'controlOf',
      'plateId',
      'submissionSummaryEligibleControlsOfPage',
      'pageActionNameOf',
      'canManageQr',//可管理qr的人可以点击单开submission
      'submitterDesignationOf',
      'isPageRequireLogin',
    ]),

    cardStyle() {
      return {
        ...appearanceStyles(this.control.appearanceStyle),
      }
    },

    shouldShowControl() {
      if (!this.loaded) {
        return false;
      }

      return !(this.control.hideControlIfNoData && this.submissions.length === 0);
    },
  },

  methods: {
    tryOpen(pageId, submissionId) {
      if (this.canManageQr) {
        window.open(qrUrlWithSubmission(this.plateId, pageId, submissionId), '_blank');
      }
    },

    displayTime(time) {
      return formatEpochToMinute(time);
    },

    fieldName(control) {
      return controlFieldName(control) + '：';
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-timeline-item__wrapper {
      padding-left: 15px !important;
    }

    .el-card__body {
      padding: 0 !important;
    }
  }
}

.nameClickable {
  cursor: pointer;
}

.elCard {
  color: $regularTextColor;
  border-top: 1px solid white;
}

.pageName {
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 1.3em;
  color: $primaryTextColor;
}

.contentRow {
  margin-bottom: 8px;
  line-height: 1.3em;
  display: flex;
  font-size: 13px;
}

.contentRow:last-child {
  margin-bottom: 0;
}

.fieldName {
  flex-grow: 0;
  flex-shrink: 0;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: $secondaryTextColor;
}

.valueText {
  word-break: break-all;
  flex-grow: 1;
}

</style>
