<template>
  <el-dialog :title="isNew? `新建${instanceDesignation}相关数字报表`:`编辑${instanceDesignation}相关数字报表`"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="internalReport"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item ref="nameItem" label="名称：" prop="name">
        <el-input ref="nameInput"
                  v-model="internalReport.name"
                  :class="$style.fieldInput"
                  :maxlength="20"
                  :spellcheck="false"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item ref="reportTypeItem" label="统计类型：" prop="instanceNumberReportType">
        <el-select v-model="internalReport.instanceNumberReportType"
                   :class="$style.fieldInput"
                   placeholder="请选择属统计类型"
                   size="medium"
                   title="属性类型设置">
          <el-option
              v-for="reportType in instanceNumberReportTypes"
              :key="reportType.key"
              :label="reportType.name"
              :value="reportType.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="rangeItem" label="统计时间范围：" prop="range">
        <el-select v-model="internalReport.range"
                   :class="$style.fieldInput"
                   placeholder="请选择时间范围"
                   size="medium"
                   title="统计时间范围设置">
          <el-option
              v-for="range in ranges"
              :key="range.key"
              :label="range.name"
              :value="range.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="suffixItem" label="后缀：" prop="suffix">
        <el-input ref="suffixInput"
                  v-model.trim="internalReport.suffix"
                  :class="$style.fieldInput"
                  :maxlength="10"
                  :spellcheck="false"
                  size="medium">
        </el-input>
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
import {cloneDeep} from 'lodash-es';
import reportRanges from '@/common/utils/report-ranges';
import {createNamespacedHelpers} from "vuex";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    report: {
      type: Object,
      required: true
    },

    isNew: {
      type: Boolean,
      required: true,
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
      internalReport: {},
      rules: {
        name: [
          {required: true, message: '请输入报表名称', trigger: 'change'},
          {max: 20, message: '名称不能超过20个字符', trigger: 'change'},
        ],

        suffix: [
          {max: 10, message: '后缀不能超过10个字符', trigger: 'change'},
        ],

        range: [
          {required: true, message: '请选择统计时间范围', trigger: 'change'},
        ],

        instanceNumberReportType: [
          {required: true, message: '请选择统计类型', trigger: 'change'},
        ],
      }
    }
  },

  computed: {
    ...appOperationStore.mapGetters(['instanceDesignation']),

    instanceNumberReportTypes() {
      return [
        {
          name: `${this.instanceDesignation}数量总计`,
          key: 'INSTANCE_COUNT'
        },

        {
          name: '提交数量总计',
          key: 'INSTANCE_SUBMIT_COUNT'
        },

        {
          name: `被访问过的${this.instanceDesignation}数量总计`,
          key: 'ACCESSED_INSTANCE_COUNT'
        },
      ];
    },

    ranges() {
      return reportRanges;
    },

  },

  methods: {
    initDialog() {
      this.internalReport = cloneDeep(this.report);
      this.$nextTick(() => {
        this.$refs['nameInput'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      this.$refs['theForm'].validate().then(() => {
        this.$emit("updated", this.internalReport);
        this.visible = false;
      }).catch(e => {
      });
    },

    cancel() {
      this.visible = false;
    }
  }
}
</script>

<style lang="scss" module>
.fieldInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>
