<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]" :title="theTitle">
    <div v-if="!control.pageId" :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请设置引用页面</i>
    </div>

    <div v-else-if="viewableControls.length === 0" :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 所选页面中没有可显示的字段</i>
    </div>

    <template v-else>
      <table v-if="control.styleType === 'HORIZONTAL_TABLE'" :class="$style.theTable">
        <tr v-if="control.showHeader">
          <th :class="[$style.dataTd,$style.headerNameTd]" :style="headerStyle" colspan="2">{{ control.headerText }}
          </th>
        </tr>

        <tr v-for="(controlName, index) in viewableControls"
            :key="index"
            :class="{[$style.stripped]: control.stripped}">
          <td :class="[$style.dataTd,$style.theNameTd,{[$style.theNameTdWide]: tabletView}]" :style="keyStyle">
            {{ controlName }}
          </td>
          <td :class="[$style.dataTd,$style.theValueTd]" :style="valueStyle">
            此处将显示实际填值
          </td>
        </tr>
      </table>

      <div v-else :style="verticalTableStyle">
        <div v-for="(controlName, index) in viewableControls" :key="index" :class="$style.verticalControlItem">
          <BoxedTextViewer :textStyle="control.verticalKeyStyle">
            {{ controlName }}
          </BoxedTextViewer>
          <BoxedTextViewer :textStyle="control.verticalValueStyle">
            此处将显示实际填值
          </BoxedTextViewer>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import {appearanceStyles, controlFieldName, fontStyles, isControlFillable} from '@/common/utils/common-utils';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  computed: {
    ...appEditStore.mapGetters([
      'pageOf',
      'pageNameOf',
    ]),

    theTitle() {
      if (this.control.pageId) {
        return `引用表单页面：${this.pageNameOf(this.control.pageId)}`;
      }
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

    viewableControls() {
      if (!this.control.pageId) {
        return [];
      }

      return this.pageOf(this.control.pageId).controls.filter(control => {
        return isControlFillable(control);
      }).map(control => controlFieldName(control));
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

.placeholderText {
  color: $warningYellow;
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

</style>
