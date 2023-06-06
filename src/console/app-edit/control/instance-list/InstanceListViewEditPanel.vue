<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>
    <div class="keyValueSettingContainer" title="按照创建时间降序排列后（即最近创建的排最前面），截取最多显示的条数">
      最大显示条数：
      <el-input-number v-model="value.max"
                       :max="100"
                       :min="1"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini">
      </el-input-number>
    </div>

    <el-checkbox v-model="value.showCreator"
                 :title="`是否在${instanceDesignation}的创建人姓名`"
                 class="settingMarginBottom block"
                 size="mini">
      显示创建人
    </el-checkbox>

    <el-checkbox v-model="value.showCreatedAt"
                 :title="`是否在${instanceDesignation}的创建时间`"
                 class="settingMarginBottom block"
                 size="mini">
      显示创建时间
    </el-checkbox>

    <el-checkbox v-model="value.showSeparator"
                 class="settingMarginBottom block"
                 size="mini"
                 title="显示行间分割线">
      显示分割线
    </el-checkbox>

    <div class="keyValueSettingContainer">
      行间距：
      <el-input-number v-model="value.rowGutter"
                       :max="50"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="行间距">
      </el-input-number>
    </div>

  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  computed: {
    ...mapGetters(['instanceDesignation']),
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
