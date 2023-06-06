<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>
    <el-checkbox v-model="value.allowRandomPosition" class="settingMarginBottom block" size="mini" title="是否允许定位任意位置">
      允许定位任意位置
    </el-checkbox>

    <template v-if="isGeolocationEnabled">
      <el-checkbox v-model="value.offsetRestrictionEnabled" :title="`限制与${instanceDesignation}定位的偏离量`" class="settingMarginBottom block"
                   size="mini">
        限制与{{ instanceDesignation }}定位的偏离量
      </el-checkbox>

      <div v-if="value.offsetRestrictionEnabled" class="keyValueSettingContainer">
        最大偏离半径(米)：
        <el-input-number v-model="value.offsetRestrictionRadius"
                         :max="100000"
                         :min="50"
                         :step="50"
                         :stepStrictly="true"
                         class="rightInputWidth"
                         controls-position="right"
                         size="mini"
                         title="最大允许偏离半径">
        </el-input-number>
      </div>
    </template>

    <div class="keyValueSettingContainer">
      按钮样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="设置定位按钮样式" type="plain">按钮样式...
        </el-button>
        <ButtonStyleInput v-model="value.buttonStyle"></ButtonStyleInput>
      </el-popover>
    </div>

  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  computed: {
    ...mapGetters(['isGeolocationEnabled', 'instanceDesignation']),
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

</style>
