<template>
  <el-dialog :class="$style.wrapper"
             :close-on-click-modal="false"
             :title="theTitle"
             :visible.sync="visible"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)"
             @open="initDialog">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="internalPlanSetting"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item label="任务名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="internalPlanSetting.name"
                  :class="$style.fullWidthInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="请输入任务名称"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item label="表单页面：" prop="pageId">
        <el-select ref="pageIdSelect"
                   v-model="internalPlanSetting.pageId"
                   :class="$style.fullWidthInput"
                   placeholder="请选择需要提交表单的页面"
                   size="medium">
          <el-option v-for="page in homePageExplicitAllPageReferences"
                     :key="page.id"
                     :label="page.name"
                     :value="page.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="任务频率：" prop="frequency">
        <el-select ref="frequencySelect"
                   v-model="internalPlanSetting.frequency"
                   :class="$style.fullWidthInput"
                   placeholder="请选择任务执行频率"
                   size="medium"
                   @change="onFrequencyChanged">
          <el-option v-for="frequency in frequencies"
                     :key="frequency.id"
                     :label="frequency.title"
                     :value="frequency.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="首次执行任务开始时间：" prop="startTime">
        <el-date-picker v-model="internalPlanSetting.startTime.date"
                        :clearable="false"
                        :editable="false"
                        :validate-event="validated"
                        placeholder="日期"
                        size="medium"
                        type="date"
                        value-format="yyyy-MM-dd"
                        @change="onStartTimeChanged">
        </el-date-picker>

        <el-time-select v-model="internalPlanSetting.startTime.time"
                        :clearable="false"
                        :editable="false"
                        :picker-options="timePickerOptions"
                        :validate-event="validated"
                        placeholder="时间"
                        size="medium"
                        @change="onStartTimeChanged">
        </el-time-select>
      </el-form-item>

      <el-form-item label="首次执行任务结束时间：" prop="expireTime">
        <el-date-picker v-model="internalPlanSetting.expireTime.date"
                        :clearable="false"
                        :default-value="internalPlanSetting.startTime.date"
                        :editable="false"
                        :picker-options="expireTimePickerOptions"
                        :validate-event="validated"
                        placeholder="日期"
                        size="medium"
                        type="date"
                        value-format="yyyy-MM-dd"
                        @change="onEndTimeChanged">
        </el-date-picker>

        <el-time-select v-model="internalPlanSetting.expireTime.time"
                        :clearable="false"
                        :editable="false"
                        :picker-options="timePickerOptions"
                        :validate-event="validated"
                        placeholder="时间"
                        size="medium"
                        @change="onEndTimeChanged">
        </el-time-select>
      </el-form-item>

      <el-checkbox v-model="internalPlanSetting.nearExpireNotifyEnabled"
                   :title="`启用后，在设定的即将超期时间到达时，任务执行人将收到微信消息提醒`"
                   size="medium">
        启用即将超期提醒
      </el-checkbox>

      <el-form-item v-if="internalPlanSetting.nearExpireNotifyEnabled" label="首次执行任务即将超期提醒时间："
                    prop="nearExpireNotifyTime">
        <el-date-picker v-model="internalPlanSetting.nearExpireNotifyTime.date"
                        :clearable="false"
                        :default-value="internalPlanSetting.startTime.date"
                        :editable="false"
                        :picker-options="nearExpireNotifyTimePickerOptions"
                        :validate-event="validated"
                        placeholder="日期"
                        size="medium"
                        type="date"
                        value-format="yyyy-MM-dd">
        </el-date-picker>

        <el-time-select v-model="internalPlanSetting.nearExpireNotifyTime.time"
                        :clearable="false"
                        :editable="false"
                        :picker-options="timePickerOptions"
                        :validate-event="validated"
                        placeholder="时间"
                        size="medium">
        </el-time-select>
      </el-form-item>
    </el-form>

    <div v-if="shouldShowExampleText" :class="$style.exampleContainer">
      <div :class="$style.assignmentText"> {{ firstAssignmentText }}</div>
      <div :class="$style.assignmentText"> {{ secondAssignmentText }}</div>
      <div :class="$style.assignmentText">......以此类推</div>
    </div>

    <div slot="footer" :class="$style.footer">
      <a :class="$style.viewDoc"
         class="underLinedLink"
         href="//docs.mryqr.com/collaboration/assignments/"
         target="_blank">
        查看文档
      </a>
      <div>
        <el-button :class="$style.footerButton"
                   icon="el-icon-close"
                   type="plain"
                   @click="cancel">
          取消
        </el-button>

        <el-button :class="$style.footerButton"
                   icon="el-icon-check"
                   type="primary"
                   @click="onSubmit">
          确定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {cloneDeep} from 'lodash-es';
import {createNamespacedHelpers} from 'vuex';
import dayjs from 'dayjs';
import frequencies from '@/common/utils/assignment-plan-frequencies';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      required: true,
    },

    planSetting: {
      type: Object,
      required: true,
    }
  },

  data() {
    return {
      visible: this.show,
      validated: false,
      internalPlanSetting: {
        name: null,
        appId: null,
        pageId: null,
        frequency: null,
        startTime: {
          date: null,
          time: null,
        },
        expireTime: {
          date: null,
          time: null,
        },
        nearExpireNotifyEnabled: false,
        nearExpireNotifyTime: {
          date: null,
          time: null,
        }
      },
      rules: {
        name: [
          {required: true, message: '请输入任务名称', trigger: 'change'},
          {max: 50, message: '任务名称不能超过50个字符', trigger: 'change'},
        ],

        pageId: [
          {required: true, message: '请选择表单页面', trigger: 'change'},
        ],

        frequency: [
          {required: true, message: '请选择任务频率', trigger: 'change'},
        ],

        startTime: [
          {validator: this.timeValidation, trigger: 'change'}
        ],

        expireTime: [
          {validator: this.timeValidation, trigger: 'change'},
          {validator: this.expireTimeValidation, trigger: 'change'}
        ],

        nearExpireNotifyTime: [
          {validator: this.timeValidation, trigger: 'change'},
          {validator: this.nearExpireNotifyTimeValidation, trigger: 'change'}
        ]
      },
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...appOperationStore.mapGetters(['homePageExplicitAllPageReferences']),

    theTitle() {
      return this.isNew ? '新增任务计划' : "编辑任务计划";
    },

    frequencies() {
      return frequencies;
    },

    timePickerOptions() {
      return {
        start: '00:00',
        step: '01:00',
        end: '23:00'
      }
    },

    maxAllowedEndTime() {
      let startDateTime = this.internalPlanSetting.startTime;
      return this.internalPlanSetting.frequency && this.isDateTimeValid(startDateTime) ?
          this.nextTime(this.timeOf(startDateTime), this.internalPlanSetting.frequency) :
          null;
    },

    expireTimePickerOptions() {
      let _this = this;
      return {
        disabledDate(date) {
          if (_this.maxAllowedEndTime && dayjs(date).isAfter(_this.maxAllowedEndTime)) {
            return true;
          }

          return _this.isDateTimeValid(_this.internalPlanSetting.startTime) &&
              dayjs(date).isBefore(_this.timeOf(_this.internalPlanSetting.startTime).startOf('day'));
        }
      }
    },

    nearExpireNotifyTimePickerOptions() {
      let _this = this;
      return {
        disabledDate(date) {
          if (_this.isDateTimeValid(_this.internalPlanSetting.startTime) &&
              dayjs(date).isBefore(_this.timeOf(_this.internalPlanSetting.startTime).startOf('day'))) {
            return true;
          }

          return _this.isDateTimeValid(_this.internalPlanSetting.expireTime) &&
              dayjs(date).isAfter(_this.timeOf(_this.internalPlanSetting.expireTime).endOf('day'));
        }
      }
    },

    shouldShowExampleText() {
      return this.internalPlanSetting.frequency &&
          this.isDateTimeValid(this.internalPlanSetting.startTime) &&
          this.isDateTimeValid(this.internalPlanSetting.expireTime) &&
          this.timeOf(this.internalPlanSetting.startTime).isBefore(this.timeOf(this.internalPlanSetting.expireTime));
    },

    firstAssignmentText() {
      let assignmentText = `第1次任务：于${this.formatTime(this.timeOf(this.internalPlanSetting.startTime))}开始，
        并于${this.formatTime(this.timeOf(this.internalPlanSetting.expireTime))}结束。`;

      let notifyText = this.internalPlanSetting.nearExpireNotifyEnabled && this.isDateTimeValid(this.internalPlanSetting.nearExpireNotifyTime) ?
          `任务执行人会在${this.formatTime(this.timeOf(this.internalPlanSetting.nearExpireNotifyTime))}收到任务即将超期的微信提醒。` : ``;
      return assignmentText + notifyText;
    },

    secondAssignmentText() {
      let assignmentText = `第2次任务：于${this.formatTime(this.nextTime(this.timeOf(this.internalPlanSetting.startTime), this.internalPlanSetting.frequency))}开始，
        并于${this.formatTime(this.nextTime(this.timeOf(this.internalPlanSetting.expireTime), this.internalPlanSetting.frequency))}结束。`;

      let notifyText = this.internalPlanSetting.nearExpireNotifyEnabled && this.isDateTimeValid(this.internalPlanSetting.nearExpireNotifyTime) ?
          `任务执行人会在
          ${this.formatTime(this.nextTime(this.timeOf(this.internalPlanSetting.nearExpireNotifyTime), this.internalPlanSetting.frequency))}收到任务即将超期的微信提醒。`
          : ``;
      return assignmentText + notifyText;
    },
  },

  methods: {
    initDialog() {
      this.validated = false;

      this.internalPlanSetting = cloneDeep(this.planSetting);
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    timeOf(dateTime) {
      if (this.isDateTimeValid(dateTime)) {
        return dayjs(dateTime.date + ' ' + dateTime.time, 'YYYY-MM-DD HH:mm', true);
      }
    },

    formatTime(time) {
      return time.format('YYYY-MM-DD HH:mm');
    },

    isDateTimeValid(dateTime) {
      return dateTime && dateTime.date && dateTime.time;
    },

    nextTime(time, frequency) {
      switch (frequency) {
        case 'EVERY_DAY': {
          return time.add(1, 'day');
        }

        case 'EVERY_WEEK': {
          return time.add(7, 'day');
        }

        case 'EVERY_MONTH': {
          return time.add(1, 'month');
        }

        case 'EVERY_THREE_MONTH': {
          return time.add(3, 'month');
        }

        case 'EVERY_SIX_MONTH': {
          return time.add(6, 'month');
        }

        case 'EVERY_YEAR': {
          return time.add(12, 'month');
        }
      }
    },

    onFrequencyChanged() {
      this.internalPlanSetting.startTime.date = null;
      this.internalPlanSetting.startTime.time = null;
      this.internalPlanSetting.expireTime.date = null;
      this.internalPlanSetting.expireTime.time = null;
      this.internalPlanSetting.nearExpireNotifyTime.date = null;
      this.internalPlanSetting.nearExpireNotifyTime.time = null;
    },

    onSubmit() {
      this.validated = true;
      this.$refs['theForm'].validate().then(() => {
        this.$emit("updated", this.internalPlanSetting);
        this.visible = false;
      }).catch(e => {
      });
    },

    timeValidation(rule, value, callback) {
      if (!value || (!value.date && !value.time)) {
        callback(new Error('请选择日期和时间'));
        return;
      }

      if (!value.date) {
        callback(new Error('请选择日期'));
        return;
      }

      if (!value.time) {
        callback(new Error('请选择时间'));
        return;
      }

      callback();
    },

    expireTimeValidation(rule, value, callback) {
      let endDateTime = value;
      let startDateTime = this.internalPlanSetting.startTime;
      if (!(this.internalPlanSetting.frequency && this.isDateTimeValid(startDateTime) && this.isDateTimeValid(endDateTime))) {
        callback();
        return;
      }

      let expireTime = this.timeOf(endDateTime);
      let startTime = this.timeOf(startDateTime);

      if (!startTime.isBefore(expireTime)) {
        callback(new Error('结束时间必须晚于开始时间。'));
        return;
      }

      if (this.maxAllowedEndTime && expireTime.isAfter(this.maxAllowedEndTime)) {
        callback(new Error(`结束时间不能超过下次任务开始时间(${this.formatTime(this.maxAllowedEndTime)})。`));
      }

      callback();
    },

    nearExpireNotifyTimeValidation(rule, value, callback) {
      let nearEndNotifyDateTime = value;
      let startDateTime = this.internalPlanSetting.startTime;
      let endDateTime = this.internalPlanSetting.expireTime;

      if (!(this.internalPlanSetting.frequency &&
          this.isDateTimeValid(startDateTime) &&
          this.isDateTimeValid(endDateTime) &&
          this.isDateTimeValid(nearEndNotifyDateTime))) {
        callback();
        return;
      }

      let expireTime = this.timeOf(endDateTime);
      let startTime = this.timeOf(startDateTime);
      let nearExpireNotifyTime = this.timeOf(nearEndNotifyDateTime);

      if (!startTime.isBefore(expireTime)) {
        callback();
        return;
      }

      if (!(nearExpireNotifyTime.isAfter(startTime) && nearExpireNotifyTime.isBefore(expireTime))) {
        let allowedStartTime = startTime.add(1, 'hour');
        let allowedEndTime = expireTime.subtract(1, 'hour');
        if (allowedStartTime.isAfter(allowedEndTime)) {
          callback(new Error(`任务开始时间和结束时间相隔太近，无法设置即将超期提醒时间，请重新设置开始时间或结束时间。`));
        } else {
          callback(new Error(`即将超期提醒时间必须位于开始时间和结束时间之间（${(this.formatTime(allowedStartTime))} - ${(this.formatTime(allowedEndTime))}）。`));
        }
      }

      callback();
    },

    onStartTimeChanged() {
      if (this.validated) {
        this.$refs['theForm'].validateField('expireTime');
        if (this.internalPlanSetting.nearExpireNotifyEnabled) {
          this.$refs['theForm'].validateField('nearExpireNotifyTime');
        }
      }
    },

    onEndTimeChanged() {
      if (this.validated) {
        if (this.internalPlanSetting.nearExpireNotifyEnabled) {
          this.$refs['theForm'].validateField('nearExpireNotifyTime');
        }
      }
    },

    cancel() {
      this.visible = false;
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 15px;
    }

    .el-date-editor {
      width: 278px !important;
    }
  }
}

.fullWidthInput {
  width: 100%;
}

.exampleContainer {
  margin-top: 25px;
  background-color: $lightBackgroundColor;
  font-size: 13px;
  padding: 10px;
}

.assignmentText {
  line-height: 1.4em;
  margin-bottom: 10px;
}

.assignmentText:last-child {
  margin-bottom: 0;
}

.viewDoc {
  color: $primaryThemeColor;
  font-size: 13px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footerButton {
  width: $dialogButtonWidth;
}
</style>
