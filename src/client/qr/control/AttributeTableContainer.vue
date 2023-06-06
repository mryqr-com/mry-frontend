<template>
  <ControlWrapper v-if="shouldShowControl" :control="control" :index="index">
    <template v-if="values.size > 0">
      <table v-if="control.styleType === 'HORIZONTAL_TABLE'" :class="$style.theTable">
        <tr v-if="control.showHeader">
          <th :class="[$style.dataTd,$style.headerNameTd]" :style="headerStyle" colspan="2">{{ control.headerText }}
          </th>
        </tr>

        <tr v-for="(attribute, index) in allViewableAttributes"
            :key="index"
            :class="{[$style.stripped]: control.stripped}">
          <td :class="[$style.dataTd,$style.theNameTd]" :style="keyStyle">
            {{ attribute.name }}
          </td>
          <td :class="[$style.dataTd,$style.theValueTd]" :style="valueStyle">
            <component :is="attribute.valueType"
                       v-if="values.get(attribute.id)"
                       :key="attribute.id"
                       :ref="attribute.id"
                       :appSetting="appSetting"
                       :attribute="attribute"
                       :class="$style.value"
                       :refControl="controlOf(attribute.controlId)"
                       :value="values.get(attribute.id)"/>
          </td>
        </tr>
      </table>

      <div v-else :style="verticalTableStyle">
        <div v-for="(attribute, index) in allViewableAttributes" :key="index" :class="$style.verticalControlItem">
          <BoxedTextViewer :textStyle="control.verticalKeyStyle">
            {{ attribute.name }}
          </BoxedTextViewer>
          <BoxedTextViewer :textStyle="control.verticalValueStyle">
            <component :is="attribute.valueType"
                       v-if="values.get(attribute.id)"
                       :key="attribute.id"
                       :ref="attribute.id"
                       :appSetting="appSetting"
                       :attribute="attribute"
                       :class="$style.value"
                       :refControl="controlOf(attribute.controlId)"
                       :value="values.get(attribute.id)"/>
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

import presentationApi from "@/common/api/presentation-api";
import {createNamespacedHelpers} from "vuex";
import {appearanceStyles, fontStyles} from "@/common/utils/common-utils";
import AddressAttributeValue from '@/client/common/components/attribute/AddressAttributeValue';
import CheckboxAttributeValue from '@/client/common/components/attribute/CheckboxAttributeValue';
import BooleanAttributeValue from '@/client/common/components/attribute/BooleanAttributeValue';
import DoubleAttributeValue from '@/client/common/components/attribute/DoubleAttributeValue';
import DropdownAttributeValue from '@/client/common/components/attribute/DropdownAttributeValue';
import EmailAttributeValue from '@/client/common/components/attribute/EmailAttributeValue';
import FilesAttributeValue from '@/client/common/components/attribute/FilesAttributeValue';
import GeolocationAttributeValue from '@/client/common/components/attribute/GeolocationAttributeValue';
import GroupAttributeValue from '@/client/common/components/attribute/GroupAttributeValue';
import IdentifierAttributeValue from '@/client/common/components/attribute/IdentifierAttributeValue';
import ImagesAttributeValue from '@/client/common/components/attribute/ImagesAttributeValue';
import IntegerAttributeValue from '@/client/common/components/attribute/IntegerAttributeValue';
import ItemCountAttributeValue from '@/client/common/components/attribute/ItemCountAttributeValue';
import ItemStatusAttributeValue from '@/client/common/components/attribute/ItemStatusAttributeValue';
import LocalDateAttributeValue from '@/client/common/components/attribute/LocalDateAttributeValue';
import LocalTimeAttributeValue from '@/client/common/components/attribute/LocalTimeAttributeValue';
import MemberEmailAttributeValue from "@/client/common/components/attribute/MemberEmailAttributeValue";
import MemberMobileAttributeValue from "@/client/common/components/attribute/MemberMobileAttributeValue";
import MemberAttributeValue from "@/client/common/components/attribute/MemberAttributeValue";
import MembersMobileAttributeValue from "@/client/common/components/attribute/MembersMobileAttributeValue";
import MembersAttributeValue from "@/client/common/components/attribute/MembersAttributeValue";
import MembersEmailAttributeValue from "@/client/common/components/attribute/MembersEmailAttributeValue";
import MobileAttributeValue from "@/client/common/components/attribute/MobileAttributeValue";
import MultiLevelSelectionAttributeValue from "@/client/common/components/attribute/MultiLevelSelectionAttributeValue";
import MultiLineTextAttributeValue from "@/client/common/components/attribute/MultiLineTextAttributeValue";
import RichTextAttributeValue from "@/client/common/components/attribute/RichTextAttributeValue";
import PointCheckAttributeValue from "@/client/common/components/attribute/PointCheckAttributeValue";
import RadioAttributeValue from "@/client/common/components/attribute/RadioAttributeValue";
import SignatureAttributeValue from "@/client/common/components/attribute/SignatureAttributeValue";
import TextAttributeValue from '@/client/common/components/attribute/TextAttributeValue';
import TimestampAttributeValue from "@/client/common/components/attribute/TimestampAttributeValue";
import CirculationStatusAttributeValue from "@/client/common/components/attribute/CirculationStatusAttributeValue";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],

  components: {
    ADDRESS_VALUE: AddressAttributeValue,
    CHECKBOX_VALUE: CheckboxAttributeValue,
    BOOLEAN_VALUE: BooleanAttributeValue,
    DOUBLE_VALUE: DoubleAttributeValue,
    DROPDOWN_VALUE: DropdownAttributeValue,
    EMAIL_VALUE: EmailAttributeValue,
    FILES_VALUE: FilesAttributeValue,
    GEOLOCATION_VALUE: GeolocationAttributeValue,
    GROUP_VALUE: GroupAttributeValue,
    IDENTIFIER_VALUE: IdentifierAttributeValue,
    IMAGES_VALUE: ImagesAttributeValue,
    INTEGER_VALUE: IntegerAttributeValue,
    ITEM_COUNT_VALUE: ItemCountAttributeValue,
    ITEM_STATUS_VALUE: ItemStatusAttributeValue,
    LOCAL_DATE_VALUE: LocalDateAttributeValue,
    LOCAL_TIME_VALUE: LocalTimeAttributeValue,
    MEMBER_EMAIL_VALUE: MemberEmailAttributeValue,
    MEMBER_MOBILE_VALUE: MemberMobileAttributeValue,
    MEMBER_VALUE: MemberAttributeValue,
    MEMBERS_EMAIL_VALUE: MembersEmailAttributeValue,
    MEMBERS_MOBILE_VALUE: MembersMobileAttributeValue,
    MEMBERS_VALUE: MembersAttributeValue,
    MOBILE_VALUE: MobileAttributeValue,
    MULTI_LEVEL_SELECTION_VALUE: MultiLevelSelectionAttributeValue,
    MULTI_LINE_TEXT_VALUE: MultiLineTextAttributeValue,
    RICH_TEXT_VALUE: RichTextAttributeValue,
    POINT_CHECK_VALUE: PointCheckAttributeValue,
    RADIO_VALUE: RadioAttributeValue,
    SIGNATURE_VALUE: SignatureAttributeValue,
    TEXT_VALUE: TextAttributeValue,
    TIMESTAMP_VALUE: TimestampAttributeValue,
    CIRCULATION_STATUS_VALUE: CirculationStatusAttributeValue,
  },

  data() {
    return {
      values: new Map(),
      loaded: false,
    }
  },

  created() {
    if (!this.control.complete) {
      console.error(`Attribute table control[${this.control.id}] is not complete.`)
      this.loaded = true;
      return;
    }

    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => this.values = new Map(Object.entries(response.data.values)))
        .catch(e => {
          console.error("Failed to fetch attribute table data:" + e.message)
        })
        .finally(() => this.loaded = true);
  },

  computed: {
    ...clientQrStore.mapGetters([
      'qrId',
      'currentPageId',
      'controlOf',
      'attributesOf',
      'appSetting',
    ]),

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

    allViewableAttributes() {
      return this.attributesOf(this.control.attributeIds);
    }
  },
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
