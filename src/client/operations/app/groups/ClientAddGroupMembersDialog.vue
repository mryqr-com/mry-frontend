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
      <el-form-item label="请选择成员：">
        <el-select ref="memberSelect"
                   v-model="theModel.memberIds"
                   :class="$style.theInput"
                   :multiple-limit="500"
                   filterable
                   multiple
                   @change="collapseDropdown('memberSelect')">
          <el-option v-for="member in allMembers"
                     :key="member.id"
                     :label="member.showName"
                     :value="member.id">
            {{ member.showName }}
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
import memberApi from '@/common/api/member-api';
import groupApi from '@/common/api/group-api';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    group: {
      type: Object,
    },
  },

  data() {
    return {
      visible: this.show,
      allMembers: [],
      theModel: {
        memberIds: []
      }
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    init() {
      this.theModel.memberIds = [];
      return memberApi.listMemberReferences().then((members) => {
        this.allMembers = members;
      });
    },

    onSubmit() {
      return groupApi.addGroupMembers(this.group.id, this.theModel).then(() => {
        this.$message({
          type: 'success',
          message: `添加成员成功。`,
          duration: 1000,
          center: true
        });
        this.visible = false;
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
      return `为【${this.group.name}】添加成员`
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

