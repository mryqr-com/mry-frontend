<template>
  <el-dialog :title="isNew? `新建${reportTitle}`:`编辑${reportTitle}`"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">
    <el-form v-if="internalReport.setting"
             ref="theForm"
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

      <el-form-item ref="segmentTypeItem" label="统计类型：" prop="setting.segmentType">
        <el-select v-model="internalReport.setting.segmentType"
                   :class="$style.fieldInput"
                   placeholder="请选择统计类型"
                   size="medium"
                   title="统计类型">
          <el-option
              v-for="type in segmentTypes"
              :key="type.key"
              :label="type.key === 'QR_COUNT_SUM'?`${instanceDesignation}总数`:type.name"
              :value="type.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="basedCAttributeIdItem" label="基准属性项：" prop="setting.basedAttributeId">
        <el-select v-model="internalReport.setting.basedAttributeId"
                   :class="$style.fieldInput"
                   placeholder="请选择基准属性项"
                   size="medium"
                   title="所引用的基准属性项">
          <el-option
              v-for="attr in allCategorizedAttributes"
              :key="attr.id"
              :label="attr.name"
              :value="attr.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
          v-if="refBasedAttributeValueType === 'ADDRESS_VALUE' || refBasedAttributeValueType==='GEOLOCATION_VALUE'"
          ref="addressPrecisionTypeItem"
          label="统计粒度："
          prop="setting.addressPrecisionType">
        <el-select v-model="internalReport.setting.addressPrecisionType"
                   :class="$style.fieldInput"
                   placeholder="统计粒度"
                   size="medium"
                   title="统计粒度">
          <el-option
              v-for="aType in addressPrecisionTypes"
              :key="aType.type"
              :label="aType.text"
              :value="aType.type">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="refBasedAttributeValueType === 'MULTI_LEVEL_SELECTION_VALUE'"
                    ref="multiLevelSelectionPrecisionTypeItem"
                    label="统计粒度："
                    prop="setting.multiLevelSelectionPrecisionType">
        <el-select v-model="internalReport.setting.multiLevelSelectionPrecisionType"
                   :class="$style.fieldInput"
                   placeholder="统计粒度"
                   size="medium"
                   title="统计粒度">
          <el-option
              v-for="aType in multiLevelSelectionPrecisionTypes"
              :key="aType.type"
              :label="aType.text"
              :value="aType.type">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="internalReport.setting.segmentType && internalReport.setting.segmentType !== 'QR_COUNT_SUM'"
                    ref="targetAttributeIdsItem"
                    label="目标属性项："
                    prop="setting.targetAttributeIds">
        <el-select ref="targetAttributeSelect"
                   v-model="internalReport.setting.targetAttributeIds"
                   :class="$style.fieldInput"
                   :multiple="true"
                   :multiple-limit="canSelectMultiTargetAttributes?2:1"
                   placeholder="请选择目标属性项"
                   size="medium"
                   title="所引用的目标属性项"
                   @change="collapseDropdown('targetAttributeSelect')">
          <el-option
              v-for="attr in allNumberedAttributes"
              :key="attr.id"
              :label="attr.name"
              :value="attr.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="rangeItem" label="统计时间范围：" prop="setting.range">
        <el-select v-model="internalReport.setting.range"
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
import {createNamespacedHelpers} from "vuex";
import reportRanges from "@/common/utils/report-ranges";
import qrSegmentTypes from '@/common/utils/qr-segment-types';
import addressPrecisionTypes from "@/common/utils/address-precision-types";
import multiLevelSelectionPrecisionTypes from "@/common/utils/multi-level-selection-precision-types";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    report: {
      type: Object,
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

        'setting.segmentType': [
          {required: true, message: '请选择统计类型', trigger: 'change'},
        ],

        'setting.basedAttributeId': [
          {required: true, message: '请选择基准属性项', trigger: 'change'},
        ],

        'setting.addressPrecisionType': [
          {required: true, message: '请选择统计粒度', trigger: 'change'},
        ],

        'setting.multiLevelSelectionPrecisionType': [
          {required: true, message: '请选择统计粒度', trigger: 'change'},
        ],

        'setting.targetAttributeIds': [
          {type: 'array', required: true, message: '请选择目标属性项', trigger: 'change'},
        ],

        'setting.range': [
          {required: true, message: '请选择统计时间范围', trigger: 'change'},
        ],
      }
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allNumberedAttributes',
      'allCategorizedAttributes',
      'attributeOf',
      'instanceDesignation',
    ]),

    canSelectMultiTargetAttributes() {
      return this.report.type === 'ATTRIBUTE_BAR_REPORT';
    },

    refBasedAttributeValueType() {
      if (!this.internalReport.setting.basedAttributeId) {
        return null;
      }

      return this.attributeOf(this.internalReport.setting.basedAttributeId).valueType;
    },

    segmentTypes() {
      return qrSegmentTypes;
    },

    addressPrecisionTypes() {
      return addressPrecisionTypes;
    },

    multiLevelSelectionPrecisionTypes() {
      return multiLevelSelectionPrecisionTypes;
    },

    ranges() {
      return reportRanges;
    },

    reportTitle() {
      switch (this.report.type) {
        case 'ATTRIBUTE_BAR_REPORT': {
          return '属性值条形图报表';
        }
        case 'ATTRIBUTE_DOUGHNUT_REPORT': {
          return '属性值圆环图报表';
        }
        case 'ATTRIBUTE_PIE_REPORT': {
          return '属性值饼状图报表';
        }
      }
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
    },

    collapseDropdown(select) {
      let _this = this;
      setTimeout(function () {
        _this.$refs[select].blur();
      }, 50);
    },
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
