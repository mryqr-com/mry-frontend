<template>
  <div :class="$style.wrapper">
    <EditTitle>选项</EditTitle>
    <div class="keyValueSettingContainer">
      选项设置：
      <el-button class="rightInputWidth" size="mini" title="编辑选项" type="plain" @click="openDialog">编辑选项...</el-button>
    </div>

    <EditTitle>基本设置</EditTitle>
    <el-checkbox v-model="value.filterable" class="settingMarginBottom block" size="mini" title="填值时选项是否可搜索">可搜索
    </el-checkbox>

    <DialogedMultiLevelSelectionInput :control="value" :show.sync="showInputDialog">
    </DialogedMultiLevelSelectionInput>
  </div>
</template>

<script>
import DialogedMultiLevelSelectionInput
  from '@/console/app-edit/control/multi-level-selection/DialogedMultiLevelSelectionInput';

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    DialogedMultiLevelSelectionInput,
  },

  data() {
    return {
      showInputDialog: false,
    };
  },

  methods: {
    openDialog() {
      this.showInputDialog = true;
    }
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

</style>
