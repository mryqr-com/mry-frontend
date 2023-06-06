<template>
  <el-dialog :visible.sync="visible"
             title="图形报表设置"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">
    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="internalConfiguration"
             :rules="rules"
             label-position="left"
             label-width="150px"
             @submit.native.prevent="onSubmit">

      <el-form-item ref="gutterItem" label="报告项间距：" prop="gutter">
        <el-input-number v-model="internalConfiguration.gutter"
                         :class="[$style.fieldInput,$style.numberInput]"
                         :max="50"
                         :min="0"
                         :step="1"
                         :stepStrictly="true"
                         controls-position="right"
                         size="medium"
                         title="报告间距">
        </el-input-number>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>
      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import {cloneDeep} from 'lodash-es';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  data() {
    return {
      visible: this.show,
      internalConfiguration: {},
      rules: {}
    }
  },

  computed: {
    ...appOperationStore.mapGetters(['currentAppChartReportSetting']),
  },

  methods: {
    ...appOperationStore.mapMutations(['updateChartReportConfiguration']),

    initDialog() {
      this.internalConfiguration = cloneDeep(this.currentAppChartReportSetting.configuration);
    },

    onSubmit() {
      this.$refs['theForm'].validate().then(() => {
        this.updateChartReportConfiguration(this.internalConfiguration);
        this.visible = false;
      }).catch(e => {
      });
    },

    cancel() {
      this.visible = false;
    },

  }
}
</script>

<style lang="scss" module>
.fieldInput {
  width: 100%;
}

.numberInput {
  :global {
    .el-input__inner {
      text-align: left !important;
      padding-left: 10px !important;
    }
  }
}

.footerButton {
  width: $dialogButtonWidth;
}
</style>
