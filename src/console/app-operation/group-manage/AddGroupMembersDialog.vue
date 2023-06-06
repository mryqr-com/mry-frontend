<template>
  <el-dialog v-if="groupId"
             :class="$style.wrapper"
             :title="theTitle"
             :visible.sync="visible"
             width="500px"
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
                   size="medium">
          <el-option v-for="member in selectableMembers"
                     :key="member.id"
                     :label="member.showName"
                     :value="member.id">
            {{ member.showName }}
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
import {createNamespacedHelpers} from 'vuex';
import groupApi from '@/common/api/group-api';

const groupManageStore = createNamespacedHelpers('GROUP_MANAGE_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    groupId: {
      type: String,
    },

    selectableMembers: {
      type: Array,
    },
  },

  data() {
    return {
      visible: this.show,
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
    ...groupManageStore.mapMutations(['addMembersToCurrentGroup']),
    ...appOperationStore.mapMutations(['markGroupAsDirty']),

    init() {
      this.theModel.memberIds = [];
    },

    onSubmit() {
      this.visible = false;
      if (this.theModel.memberIds.length === 0) {
        return;
      }

      return groupApi.addGroupMembers(this.groupId, this.theModel).then(() => {
        this.addMembersToCurrentGroup(this.theModel.memberIds);
        this.$message({
          type: 'success',
          message: `成功添加成员。`,
          center: true
        });
        this.markGroupAsDirty();
      });
    },

    cancel() {
      this.visible = false;
    },
  },

  computed: {
    ...groupManageStore.mapGetters(['groupNameOf']),

    theTitle() {
      return `为【${this.groupNameOf(this.groupId)}】添加成员`
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
}

.theInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

