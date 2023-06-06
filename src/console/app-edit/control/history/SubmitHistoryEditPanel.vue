<template>
  <div :class="$style.wrapper">
    <EditTitle>引用页面</EditTitle>
    <el-select ref="pageSelect"
               v-model="value.pageIds"
               :multiple="true"
               :multipleLimit="10"
               class="settingMarginBottom block"
               placeholder="请选择需要引用的页面"
               size="mini"
               title="设置需要引用的页面（多选）">
      <el-option
          v-for="page in allPageSummaries"
          :key="page.id"
          :label="page.name"
          :value="page.id">
      </el-option>
    </el-select>

    <EditTitle>基本设置</EditTitle>
    <el-checkbox v-model="value.showSubmitter"
                 class="settingMarginBottom block"
                 size="mini"
                 title="显示提交人姓名">
      显示提交人
    </el-checkbox>

    <el-checkbox v-model="value.showPageName"
                 class="settingMarginBottom block"
                 size="mini"
                 title="显示页面名称，如果页面设置了提交动作名称，那么提交动作名称将覆盖页面名称">
      显示页面名称(或页面提交动作名称)
    </el-checkbox>

    <el-checkbox v-model="value.hideControlIfNoData"
                 class="settingMarginBottom block"
                 size="mini"
                 title="无数据时隐藏控件">
      无数据时隐藏控件
    </el-checkbox>

    <div class="keyValueSettingContainer">
      排序：
      <el-radio-group v-model="value.orderByAsc" size="mini">
        <el-radio-button :label="true" title="按提交时间升序排列，越早的提交在越前面">按时间升序
        </el-radio-button>
        <el-radio-button :label="false" title="按提交时间降序排列，越晚的提交在越前面">按时间降序
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="keyValueSettingContainer">
      最大显示条数：
      <el-input-number v-model="value.max"
                       :max="100"
                       :min="1"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="最大可显示的提交记录条数">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      外观样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="外观样式" type="plain">外观样式...</el-button>
        <AppearanceStyleInput v-model="value.appearanceStyle"></AppearanceStyleInput>
      </el-popover>
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
    ...mapGetters([
      'allPageSummaries',
    ]),
  },
}
</script>

<style lang="scss" module>
.wrapper {

}

.selectInput {
  width: 100%;
}

.localSettingItem {
  margin-top: 10px;
}

.marginBottom5 {
  margin-bottom: 5px;
}


</style>
