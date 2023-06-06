<template>
  <el-dialog :class="$style.wrapper"
             :visible.sync="visible"
             title="任务计划详情"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)">
    <div :class="$style.row">
      <span :class="$style.rowKey">任务名称：</span>
      <span :class="$style.rowValue">{{ assignmentPlan.name }}</span>
    </div>

    <div :class="$style.row">
      <span :class="$style.rowKey">表单页面：</span>
      <span :class="$style.rowValue">{{ pageNameOf(assignmentPlan.setting.pageId) }}</span>
    </div>

    <div :class="$style.row">
      <span :class="$style.rowKey">任务频率：</span>
      <span :class="$style.rowValue">{{ frequencyText }}</span>
    </div>

    <div :class="$style.row">
      <span :class="$style.rowKey">首次任务开始时间：</span>
      <span :class="$style.rowValue">{{ displayTime(assignmentPlan.setting.startTime) }}</span>
    </div>

    <div :class="$style.row">
      <span :class="$style.rowKey">首次任务结束时间：</span>
      <span :class="$style.rowValue">{{ displayTime(assignmentPlan.setting.expireTime) }}</span>
    </div>

    <div :class="$style.row">
      <span :class="$style.rowKey">即将超期提醒时间：</span>
      <span :class="$style.rowValue">{{ nearExpireText }}</span>
    </div>

    <div v-if="assignmentPlan.active" :class="$style.row">
      <span :class="$style.rowKey">下次任务开始时间：</span>
      <span :class="$style.rowValue">{{ formatEpochToMinute(assignmentPlan.nextAssignmentStartAt) }}</span>
    </div>

    <div :class="$style.row">
      <span :class="$style.rowKey">创建人：</span>
      <span :class="$style.rowValue">{{ assignmentPlan.creator }}</span>
    </div>

    <div v-if="isGroupLevel" :class="$style.row">
      <span :class="$style.rowKey">执行人：</span>
      <span v-if="assignmentPlan.operatorNames.length > 0" :class="$style.rowValue">
        {{ assignmentPlan.operatorNames.join(", ") }}
      </span>
      <span v-else :class="$style.noOperators">未设置</span>
    </div>

    <div v-if="isAppLevel" :class="$style.row">
      <span :class="$style.rowKey">排除{{ groupDesignation }}：</span>
      <span :class="$style.rowValue">{{ excludedGroupNames }}</span>
    </div>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="primary"
                 @click="cancel">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import frequencies from '@/common/utils/assignment-plan-frequencies';
import {formatEpochToMinute} from "@/common/utils/common-utils";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const assignmentPlanStore = createNamespacedHelpers('ASSIGNMENT_PLAN_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    assignmentPlan: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      visible: this.show,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...appOperationStore.mapGetters(['pageNameOf', 'groupDesignation', 'groupNameOf']),
    ...assignmentPlanStore.mapGetters(['isGroupLevel', 'isAppLevel']),

    frequencyText() {
      return frequencies.find(fre => fre.id === this.assignmentPlan.setting.frequency).title;
    },

    nearExpireText() {
      if (this.assignmentPlan.setting.nearExpireNotifyEnabled) {
        return this.displayTime(this.assignmentPlan.setting.nearExpireNotifyTime);
      } else {
        return '未设置';
      }
    },

    excludedGroupNames() {
      let groups = this.assignmentPlan.excludedGroups
          .map(groupId => this.groupNameOf(groupId))
          .filter(result => !!result)
          .join(', ');
      return groups ? groups : '无';
    },
  },

  methods: {
    formatEpochToMinute,
    displayTime(dateTime) {
      return dateTime.date + ' ' + dateTime.time;
    },

    cancel() {
      this.visible = false;
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.row {
  display: flex;
  margin-bottom: 5px;
}

.rowKey {
  width: 150px;
  text-align: left;
  flex-shrink: 0;
  flex-grow: 0;
  line-height: 1.6em;
}

.rowValue {
  margin-left: 10px;
  flex-grow: 1;
  line-height: 1.6em;
  color: $primaryTextColor;
}

.noOperators {
  margin-left: 10px;
  flex-grow: 1;
  line-height: 1.6em;
  color: $warningYellow;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>
