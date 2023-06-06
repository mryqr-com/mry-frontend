<template>
  <ControlWrapper v-if="shouldShowControl" :control="control" :index="index">
    <template v-if="values.size > 0">
      <table v-if="control.styleType === 'HORIZONTAL_TABLE'" :class="$style.theTable">
        <tr v-if="control.showHeader">
          <th :class="[$style.dataTd,$style.headerNameTd]" :style="headerStyle" colspan="2">{{ control.headerText }}
          </th>
        </tr>

        <tr v-for="(aControl, index) in allViewableControls"
            :key="index"
            :class="{[$style.stripped]: control.stripped}">
          <td :class="[$style.dataTd,$style.theNameTd]" :style="keyStyle">
            {{ fieldName(aControl) }}
          </td>
          <td :class="[$style.dataTd,$style.theValueTd]" :style="valueStyle">
            <component :is="aControl.type"
                       v-if="values.get(aControl.id)"
                       :key="aControl.id"
                       :ref="aControl.id"
                       :class="$style.value"
                       :control="aControl"
                       :value="values.get(aControl.id)"/>
          </td>
        </tr>
      </table>

      <div v-else :style="verticalTableStyle">
        <div v-for="(aControl, index) in allViewableControls" :key="index" :class="$style.verticalControlItem">
          <BoxedTextViewer :textStyle="control.verticalKeyStyle">
            {{ fieldName(aControl) }}
          </BoxedTextViewer>
          <BoxedTextViewer :textStyle="control.verticalValueStyle">
            <component :is="aControl.type"
                       v-if="values.get(aControl.id)"
                       :key="aControl.id"
                       :ref="aControl.id"
                       :class="$style.value"
                       :control="aControl"
                       :value="values.get(aControl.id)"/>
            <template v-else>
              无
            </template>
          </BoxedTextViewer>
        </div>
      </div>
    </template>
    <div v-else>无数据</div>
  </ControlWrapper>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import presentationApi from "@/common/api/presentation-api";
import {appearanceStyles, controlFieldName, fontStyles} from "@/common/utils/common-utils";
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
    TIME: TimeAnswer,
    IMAGE_UPLOAD: ImageUploadAnswer,
    SIGNATURE: SignatureAnswer,
    FILE_UPLOAD: FileUploadAnswer,
    MULTI_LINE_TEXT: MultiLineTextAnswer,
    RICH_TEXT_INPUT: RichTextInputAnswer,
  },

  data() {
    return {
      values: new Map(),
      loaded: false,
    }
  },

  created() {
    if (!this.control.complete) {
      console.error(`Submission reference control[${this.control.id}] is not complete.`)
      this.loaded = true;
      return;
    }

    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => this.values = new Map(Object.entries(response.data.values)))
        .catch(e => {
          console.error("Failed to fetch submission reference:" + e.message)
        })
        .finally(() => this.loaded = true);
  },

  computed: {
    ...clientQrStore.mapGetters([
      'qrId',
      'currentPageId',
      'allFillableControlsOnPage',
    ]),

    allViewableControls() {
      return this.allFillableControlsOnPage(this.control.pageId);
    },

    headerStyle() {
      return fontStyles(this.control.headerFontStyle);
    },

    keyStyle() {
      return fontStyles(this.control.keyFontStyle);
    },

    valueStyle() {
      return fontStyles(this.control.valueFontStyle);
    },

    verticalTableStyle() {
      return {
        ...appearanceStyles(this.control.appearanceStyle),
      }
    },

    shouldShowControl() {
      if (!this.loaded) {
        return false;
      }

      return !(this.control.hideControlIfNoData && this.values.size === 0);
    },
  },

  methods: {
    fieldName(control) {
      return controlFieldName(control);
    }
  }

}
</script>

<style lang="scss" module>
.theTable {
  border-collapse: collapse;
  width: 100%;
}

.stripped:nth-child(even) {
  background-color: rgba(246, 247, 252, 1);
}

.dataTd {
  min-height: $formPageInputHeight;
  vertical-align: middle;
  border: $primary1pxBorder;
}

.headerNameTd {
  padding: 10px;
  text-align: center;
  line-height: 1.3em;
}

.theNameTd {
  white-space: nowrap;
  padding: 10px;
  min-width: 60px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3em;
}

.theValueTd {
  word-break: break-all;
  padding: 10px;
  width: 99%;
  line-height: 1.3em;
}

.value {
  font: inherit;
  color: inherit;
}

.verticalControlItem {
  padding: 25px 0;
  border-bottom: $primary1pxBorder;
}

.verticalControlItem:last-child {
  border-bottom: none;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .theNameTd {
    min-width: 100px;
    max-width: 150px;
  }
}
</style>
