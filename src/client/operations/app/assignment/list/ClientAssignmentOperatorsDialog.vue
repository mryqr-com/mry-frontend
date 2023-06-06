<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :customClass="$style.elDialog"
             :title="theTitle"
             :visible.sync="visible"
             top="0"
             width="100%"
             @close="$emit('update:show', false)"
             @open="init">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item label="任务执行人（最多10名）：">
        <el-select ref="operatorSelect"
                   v-model="theModel.memberIds"
                   :class="$style.theInput"
                   :multiple-limit="10"
                   filterable
                   multiple
                   @change="collapseDropdown('operatorSelect')">
          <el-option v-for="member in allMembers"
                     :key="member.id"
                     :label="member.showName"
                     :value="member.id">
            <span style="float: left">{{ member.showName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" :class="$style.footer">
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
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from "vuex";

import memberApi from '@/common/api/member-api';
import {cloneDeep} from 'lodash-es';
import assignmentApi from '@/common/api/assignment-api';

const clientAssignmentListStore = createNamespacedHelpers('CLIENT_ASSIGNMENT_LIST_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    assignment: {
      type: Object,
    },
  },

  data() {
    return {
      visible: this.show,
      allMembers: [],
      theModel: {
        memberIds: [],
      }
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    ...clientAssignmentListStore.mapMutations(['setAssignmentOperators']),

    init() {
      this.theModel.memberIds = cloneDeep(this.assignment.operators);
      return memberApi.listMemberReferences().then((members) => {
        this.allMembers = members;
      });
    },

    onSubmit() {
      return assignmentApi.setOperators(this.assignment.id, this.theModel).then(() => {
        this.$message({
          type: 'success',
          message: `成功设置任务执行人。`,
          duration: 1000,
          center: true
        });
        this.visible = false;
        let members = this.allMembers.filter(member => this.theModel.memberIds.includes(member.id));
        this.setAssignmentOperators({assignmentId: this.assignment.id, members: members});
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

  },

  computed: {
    theTitle() {
      return `为【${this.assignment.name}】设置执行人`
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}

.elDialog {
  height: 100%;
}

.theInput {
  width: 100%;
}

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

