<template>
  <el-dialog :title="isNew? `新建控件提交值分时统计图`:`编辑控件提交值分时统计图`"
             :visible.sync="visible"
             top="60px"
             width="600px"
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

      <section :class="$style.settingSection">
        <div v-for="(setting,index) in internalReport.setting.segmentSettings"
             :class="[$style.settingContainer,{[$style.multipleSettingContainer]:hasMultiple}]">
          <div v-if="hasMultiple" :class="$style.settingTitle">
            <span>统计项{{ index + 1 }}：</span>
            <i v-if="hasMultiple"
               :class="$style.deleteButton"
               class="el-icon-close"
               title="删除"
               @click="deleteSetting(index)">
            </i>
          </div>
          <el-form-item v-if="hasMultiple"
                        :prop="'setting.segmentSettings.' + index + '.name'"
                        :rules="[{required: true, message: '请输入统计项名称', trigger: 'change'},{max: 10, message: '统计项名称不能超过10个字符', trigger: 'change'}]"
                        label="统计项名称：">
            <el-input v-model="setting.name"
                      :class="$style.fieldInput"
                      :maxlength="10"
                      :spellcheck="false"
                      size="medium">
            </el-input>
          </el-form-item>

          <el-form-item :prop="'setting.segmentSettings.' + index + '.segmentType'"
                        :rules="[{required: true, message: '请选择统计类型', trigger: 'change'}]"
                        label="统计类型：">
            <el-select v-model="setting.segmentType"
                       :class="$style.fieldInput"
                       placeholder="请选择统计类型"
                       size="medium"
                       title="统计类型">
              <el-option v-for="type in segmentTypes"
                         :key="type.key"
                         :label="type.name"
                         :value="type.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :prop="'setting.segmentSettings.' + index + '.basedType'"
                        :rules="[{required: true, message: '请选择统计方式', trigger: 'change'}]"
                        label="统计方式：">
            <el-select v-model="setting.basedType"
                       :class="$style.fieldInput"
                       placeholder="请选择统计方式"
                       size="medium"
                       title="统计方式">
              <el-option v-for="type in basedTypes"
                         :key="type.key"
                         :label="type.name"
                         :value="type.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :prop="'setting.segmentSettings.' + index + '.pageId'"
                        :rules="[{required: true, message: '请选择页面', trigger: 'change'}]"
                        label="页面：">
            <el-select v-model="setting.pageId"
                       :class="$style.fieldInput"
                       placeholder="请选择需引用的页面"
                       size="medium"
                       title="所引用的页面"
                       @change="clearControlSelection(setting)">
              <el-option v-for="page in homePageExplicitAllPageReferences"
                         :key="page.id"
                         :label="page.name"
                         :value="page.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="setting.basedType && setting.basedType !== 'CREATED_AT'"
                        :prop="'setting.segmentSettings.' + index + '.basedControlId'"
                        :rules="[{required: true, message: '请选择基准控件', trigger: 'change'}]"
                        label="基准控件：">
            <el-select v-model="setting.basedControlId"
                       :class="$style.fieldInput"
                       placeholder="请选择基准控件"
                       size="medium"
                       title="请选择基准控件">
              <el-option v-for="control in allDateControlsOfPage(setting.pageId)"
                         :key="control.id"
                         :label="controlFieldName(control)"
                         :value="control.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="setting.segmentType && setting.segmentType !== 'SUBMIT_COUNT_SUM'"
                        :prop="'setting.segmentSettings.' + index + '.targetControlId'"
                        :rules="[{required: true, message: '请选择目标控件', trigger: 'change'}]"
                        label="目标控件：">
            <el-select v-model="setting.targetControlId"
                       :class="$style.fieldInput"
                       placeholder="请选择目标控件"
                       size="medium"
                       title="所引用的目标控件">
              <el-option v-for="control in allAnswerNumberedControlsOfPage(setting.pageId)"
                         :key="control.id"
                         :label="controlFieldName(control)"
                         :value="control.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </section>

      <el-form-item ref="intervalItem" label="时段间隔：" prop="setting.interval">
        <el-select v-model="internalReport.setting.interval"
                   :class="$style.fieldInput"
                   placeholder="请选择时段间隔"
                   size="medium"
                   title="时段间隔">
          <el-option
              v-for="interval in intervals"
              :key="interval.key"
              :label="interval.name"
              :value="interval.key">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button v-if="internalReport.setting && internalReport.setting.segmentSettings.length < 2"
                 icon="el-icon-plus"
                 size="medium"
                 type="plain"
                 @click="addItem">
        添加统计项
      </el-button>

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
import {controlFieldName} from "@/common/utils/common-utils";
import submissionSegmentTypes from '@/common/utils/submission-segment-types';
import timeSegmentIntervals from '@/common/utils/time-segment-intervals';
import submissionReportTimeBasedTypes from '@/common/utils/submission-report-time-based-types';
import uuid from "short-uuid";

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

        'setting.interval': [
          {required: true, message: '请选择统计时段间隔', trigger: 'change'},
        ],
      }
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allAnswerNumberedControlsOfPage',
      'allDateControlsOfPage',
      'homePageExplicitAllPageReferences',
    ]),

    segmentTypes() {
      return submissionSegmentTypes;
    },

    basedTypes() {
      return submissionReportTimeBasedTypes;
    },

    intervals() {
      return timeSegmentIntervals;
    },

    hasMultiple() {
      return this.internalReport.setting.segmentSettings.length === 2;
    },

  },

  methods: {
    controlFieldName,
    initDialog() {
      this.internalReport = cloneDeep(this.report);
      this.$nextTick(() => {
        this.$refs['nameInput'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    clearControlSelection(setting) {
      setting.targetControlId = null;
      setting.basedControlId = null;
    },

    onSubmit() {
      this.$refs['theForm'].validate().then(() => {
        this.$emit("updated", this.internalReport);
        this.visible = false;
      }).catch(e => {
      });
    },

    addItem() {
      this.internalReport.setting.segmentSettings.push(
          {
            id: uuid.generate(),
            name: "未命名",
            segmentType: null,
            basedType: null,
            pageId: null,
            basedControlId: null,
            targetControlId: null,
          }
      );
    },

    deleteSetting(index) {
      this.internalReport.setting.segmentSettings.splice(index, 1);
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

.settingSection {
  display: flex;
  margin-bottom: 10px;
}

.settingContainer {
  flex-grow: 1;
}

.settingContainer:nth-child(2) {
  margin-left: 15px;
}

.multipleSettingContainer {
  border: 1px solid $placeholderTextColor;
  margin-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 15px;
}

.settingTitle {
  padding-top: 10px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
}

.deleteButton {
  cursor: pointer;
}

.deleteButton:hover {
  color: $rejectRed;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>
