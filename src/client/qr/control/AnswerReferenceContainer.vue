<template>
  <ControlWrapper v-if="shouldShowControl" :control="control" :index="index">
    <component :is="refControl.type"
               v-if="refControl"
               :key="displayValue.key"
               :ref="displayValue.key"
               :presentationControl="control"
               :refControl="refControl"
               :value="displayValue"/>
    <div v-else>无数据</div>
  </ControlWrapper>
</template>

<script>
import presentationApi from "@/common/api/presentation-api";
import {createNamespacedHelpers} from "vuex";
import AddressRefAnswer from '@/client/qr/control/answer-reference/AddressRefAnswer';
import CheckboxRefAnswer from '@/client/qr/control/answer-reference/CheckboxRefAnswer';
import DateRefAnswer from '@/client/qr/control/answer-reference/DateRefAnswer';
import DropdownRefAnswer from '@/client/qr/control/answer-reference/DropdownRefAnswer';
import EmailRefAnswer from '@/client/qr/control/answer-reference/EmailRefAnswer';
import GeolocationRefAnswer from '@/client/qr/control/answer-reference/GeolocationRefAnswer';
import IdentifierRefAnswer from '@/client/qr/control/answer-reference/IdentifierRefAnswer';
import ItemCountRefAnswer from '@/client/qr/control/answer-reference/ItemCountRefAnswer';
import ItemStatusRefAnswer from '@/client/qr/control/answer-reference/ItemStatusRefAnswer';
import MemberSelectRefAnswer from '@/client/qr/control/answer-reference/MemberSelectRefAnswer';
import MobileRefAnswer from '@/client/qr/control/answer-reference/MobileRefAnswer';
import NumberInputRefAnswer from '@/client/qr/control/answer-reference/NumberInputRefAnswer';
import NumberRankRefAnswer from '@/client/qr/control/answer-reference/NumberRankRefAnswer';
import PointCheckRefAnswer from '@/client/qr/control/answer-reference/PointCheckRefAnswer';
import RadioRefAnswer from '@/client/qr/control/answer-reference/RadioRefAnswer';
import SingleLineTextRefAnswer from '@/client/qr/control/answer-reference/SingleLineTextRefAnswer';
import PersonNameRefAnswer from '@/client/qr/control/answer-reference/PersonNameRefAnswer';
import TimeRefAnswer from '@/client/qr/control/answer-reference/TimeRefAnswer';
import MultiLineTextRefAnswer from '@/client/qr/control/answer-reference/MultiLineTextRefAnswer';
import RichTextInputRefAnswer from '@/client/qr/control/answer-reference/RichTextInputRefAnswer';
import ImageUploadRefAnswer from '@/client/qr/control/answer-reference/ImageUploadRefAnswer';
import FileUploadRefAnswer from '@/client/qr/control/answer-reference/FileUploadRefAnswer';
import SignatureRefAnswer from '@/client/qr/control/answer-reference/SignatureRefAnswer';
import MultiLevelSelectionRefAnswer from '@/client/qr/control/answer-reference/MultiLevelSelectionRefAnswer';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],

  components: {
    ADDRESS: AddressRefAnswer,
    CHECKBOX: CheckboxRefAnswer,
    DATE: DateRefAnswer,
    DROPDOWN: DropdownRefAnswer,
    EMAIL: EmailRefAnswer,
    GEOLOCATION: GeolocationRefAnswer,
    IDENTIFIER: IdentifierRefAnswer,
    ITEM_COUNT: ItemCountRefAnswer,
    ITEM_STATUS: ItemStatusRefAnswer,
    MEMBER_SELECT: MemberSelectRefAnswer,
    MOBILE: MobileRefAnswer,
    NUMBER_INPUT: NumberInputRefAnswer,
    NUMBER_RANKING: NumberRankRefAnswer,
    POINT_CHECK: PointCheckRefAnswer,
    RADIO: RadioRefAnswer,
    SINGLE_LINE_TEXT: SingleLineTextRefAnswer,
    PERSON_NAME: PersonNameRefAnswer,
    TIME: TimeRefAnswer,
    MULTI_LINE_TEXT: MultiLineTextRefAnswer,
    RICH_TEXT_INPUT: RichTextInputRefAnswer,
    IMAGE_UPLOAD: ImageUploadRefAnswer,
    FILE_UPLOAD: FileUploadRefAnswer,
    SIGNATURE: SignatureRefAnswer,
    MULTI_LEVEL_SELECTION: MultiLevelSelectionRefAnswer,
  },

  data() {
    return {
      displayValue: null,
      loaded: false,
    }
  },

  created() {
    if (!this.control.complete) {
      console.error(`Answer reference control[${this.control.id}] is not complete.`)
      this.loaded = true;
      return;
    }

    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => this.displayValue = response.data.value)
        .catch(e => {
          console.error("Failed to fetch answer reference:" + e.message)
        })
        .finally(() => this.loaded = true);
  },

  computed: {
    ...clientQrStore.mapGetters([
      'qrId',
      'currentPageId',
      'getPage',
      'controlOf',
    ]),

    refControl() {
      if (this.displayValue) {
        return this.controlOf(this.displayValue.key);
      }
    },

    shouldShowControl() {
      if (!this.loaded) {
        return false;
      }

      return !(this.control.hideControlIfNoData && !this.displayValue);
    },
  },

}
</script>

<style lang="scss" module>

</style>
