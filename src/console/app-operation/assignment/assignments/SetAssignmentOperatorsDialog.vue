<template>
  <el-dialog :class="$style.wrapper"
             :title="`为${assignment.name}设置执行人`"
             :visible.sync="visible"
             width="600px"
             @close="$emit('update:show', false)"
             @open="init">

    <div>执行人（最多10名）：</div>
    <el-select ref="operatorSelect"
               v-model="internalOperators"
               :class="$style.theInput"
               :multiple-limit="10"
               filterable
               multiple
               placeholder="请选择任务执行人"
               size="medium"
               @change="collapseDropdown('operatorSelect')">
      <el-option v-for="member in allMembers"
                 :key="member.id"
                 :label="member.showName"
                 :value="member.id">
      </el-option>
    </el-select>

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
import {createNamespacedHelpers} from 'vuex';
import {cloneDeep} from 'lodash-es';
import memberApi from "@/common/api/member-api";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    assignment: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      visible: this.show,
      allMembers: [],
      internalOperators: [],
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    init() {
      this.internalOperators = cloneDeep(this.assignment.operators);
      return memberApi.listMemberReferences().then((members) => {
        this.allMembers = members;
      });
    },

    onSubmit() {
      this.$emit('updated', this.internalOperators);
      this.visible = false;
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
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 15px;
    }
  }
}

.theInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>
