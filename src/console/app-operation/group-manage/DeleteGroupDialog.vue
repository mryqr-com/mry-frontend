<template>
  <el-dialog :title="dialogTitle"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-alert :closable="false"
              :title="`警告：删除【${groupName}】后，其下（包括各级子分组下）所有的${instanceDesignation}将被同时删除，且无法恢复。`"
              class="marginBottom15"
              type="warning">
    </el-alert>

    <el-checkbox v-model="confirmed"
                 size="medium"
                 title="我已知晓，确认删除">
      我已知晓，确认删除
    </el-checkbox>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>
      <el-button :class="$style.footerButton"
                 :disabled="apiInProgress || !confirmed"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        确认删除
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

    node: {
      type: Object,
    },
  },

  data() {
    return {
      apiInProgress: false,
      visible: this.show,
      confirmed: false,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    ...groupManageStore.mapMutations(['resetCurrentGroup']),
    ...appOperationStore.mapMutations(['markGroupAsDirty']),

    init() {
      this.apiInProgress = false;
      this.confirmed = false;
    },

    onSubmit() {
      this.apiInProgress = true;
      this.visible = false;
      return groupApi.deleteGroup(this.node.data.id).then(() => {
        this.$message({
          type: 'success',
          message: `删除成功。`,
          center: true
        });

        this.removeNode();
        if (this.node.data.id === this.currentGroupId) {
          this.resetCurrentGroup();
        }
        this.markGroupAsDirty();
      }).finally(() => {
        this.apiInProgress = false;
      });
    },

    removeNode() {
      const parent = this.node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === this.node.data.id);
      children.splice(index, 1);
    },

    cancel() {
      this.visible = false;
    },
  },

  computed: {
    ...groupManageStore.mapGetters([
      'groupNameOf',
      'currentGroupId'
    ]),
    ...appOperationStore.mapGetters(['instanceDesignation']),


    dialogTitle() {
      return this.node ? `删除【${this.groupNameOf(this.node.data.id)}】` : '确认删除';
    },

    groupName() {
      return this.node ? `${this.groupNameOf(this.node.data.id)}` : '';
    },
  },
}
</script>

<style lang="scss" module>
.nameInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

