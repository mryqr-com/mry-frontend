<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <el-row v-if="attributeNames.length > 0" :gutter="control.gutter">
      <el-col v-for="(attributeName,index) in attributeNames"
              :key="index"
              :span="24/control.itemsPerLine"
              :style="columnStyle">
        <div :class="$style.itemContainer" :style="itemStyle">
          <BoxedTextViewer v-if="control.itemTitlePosition === 'TOP'" :textStyle="control.titleStyle">
            {{ attributeName }}
          </BoxedTextViewer>

          <BoxedTextViewer :textStyle="control.contentStyle">
            此处将显示实际值
          </BoxedTextViewer>

          <BoxedTextViewer v-if="control.itemTitlePosition === 'BOTTOM'" :textStyle="control.titleStyle">
            {{ attributeName }}
          </BoxedTextViewer>
        </div>
      </el-col>
    </el-row>

    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请添加属性项</i>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {appearanceStyles} from "@/common/utils/common-utils";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  computed: {
    ...mapGetters([
      'attributeNameFor'
    ]),

    columnStyle() {
      return {
        marginBottom: this.control.gutter + 'px',
      }
    },

    itemStyle() {
      return {
        ...appearanceStyles(this.control.appearanceStyle),
      }
    },

    attributeNames() {
      return this.control.attributeIds.map((attributeId) => {
        return this.attributeNameFor(attributeId);
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.wrapperWide {
}

.itemContainer {
  overflow: hidden;
}

.placeholderText {
  color: $warningYellow;
}

</style>
