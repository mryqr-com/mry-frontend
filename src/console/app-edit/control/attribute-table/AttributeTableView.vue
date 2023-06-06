<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <template v-if="control.attributeIds.length > 0">
      <table v-if="control.styleType === 'HORIZONTAL_TABLE'" :class="$style.theTable">
        <tr v-if="control.showHeader">
          <th :class="[$style.dataTd,$style.headerNameTd]" :style="headerStyle" colspan="2">{{ control.headerText }}
          </th>
        </tr>

        <tr v-for="(attributeName, index) in attributeNames"
            :key="index"
            :class="{[$style.stripped]: control.stripped}">
          <td :class="[$style.dataTd,$style.theNameTd,{[$style.theNameTdWide]: tabletView}]" :style="keyStyle">
            {{ attributeName }}
          </td>
          <td :class="[$style.dataTd,$style.theValueTd]" :style="valueStyle">
            此处将显示实际填值
          </td>
        </tr>
      </table>

      <div v-else :style="verticalTableStyle">
        <div v-for="(attributeName, index) in attributeNames" :key="index" :class="$style.verticalControlItem">
          <BoxedTextViewer :textStyle="control.verticalKeyStyle">
            {{ attributeName }}
          </BoxedTextViewer>
          <BoxedTextViewer :textStyle="control.verticalValueStyle">
            此处将显示实际填值
          </BoxedTextViewer>
        </div>
      </div>
    </template>

    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请添加属性项</i>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {appearanceStyles, fontStyles} from "@/common/utils/common-utils";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  computed: {
    ...mapGetters([
      'attributeNameFor'
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

    attributeNames() {
      return this.control.attributeIds.map((attributeId) => {
        return this.attributeNameFor(attributeId);
      });
    },

    verticalTableStyle() {
      return {
        ...appearanceStyles(this.control.appearanceStyle),
      }
    },
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

.wrapperWide {
}

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

.theNameTdWide {
  min-width: 100px;
  max-width: 150px;
}

.theValueTd {
  padding: 10px;
  width: 99%;
  line-height: 1.3em;
}

.verticalControlItem {
  padding: 25px 0;
  border-bottom: $primary1pxBorder;
}

.verticalControlItem:last-child {
  border-bottom: none;
}

.placeholderText {
  color: $warningYellow;
}

</style>
