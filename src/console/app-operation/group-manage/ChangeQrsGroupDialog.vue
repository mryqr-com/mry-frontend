<template>
  <el-dialog :title="title"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">
    <div :class="$style.selectTitle">{{ selectTitle }}</div>

    <section :class="$style.groupTreeSection">
      <el-tree ref="tree"
               :class="$style.groupTree"
               :data="groupData"
               :expand-on-click-node="true"
               :highlight-current="true"
               :props="groupTreeProps"
               node-key="id"
               @node-click="handleNodeClick"
               @current-change="onCurrentChange">
        <div slot-scope="{ node, data }" :class="$style.groupTreeRow">
            <span :class="$style.groupName">
              {{ groupNameOf(data.id) }}
              <span v-if="!isGroupActive(data.id)" class="tableTag redTableTag">已禁用</span>
              <span v-if="isGroupArchived(data.id)" class="tableTag yellowTableTag">已归档</span>
            </span>
        </div>
      </el-tree>
    </section>

    <div :class="$style.selectedGroupName">
      当前选中：{{ currentSelectedGroupName }}
    </div>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>
      <el-button :class="$style.footerButton"
                 :disabled="apiInProgress || !selectedGroupId"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import qrApi from '@/common/api/qr-api';

const groupManageStore = createNamespacedHelpers('GROUP_MANAGE_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    groupData: {
      type: Array,
    },

    qrs: {
      type: Array,
    },

    title: {
      type: String
    }
  },

  data() {
    return {
      apiInProgress: false,
      visible: this.show,
      selectedGroupId: null,
      groupTreeProps: {
        children: 'children',
        label: 'id',
      },
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...groupManageStore.mapGetters([
      'groupNameOf',
      'isGroupActive',
      'isGroupArchived',
    ]),

    ...appOperationStore.mapGetters(['groupDesignation']),

    selectTitle() {
      return this.groupDesignation === '分组' ? "请选择需要移动到的分组：" : `请选择需要移动到的${this.groupDesignation}或分组：`;
    },

    currentSelectedGroupName() {
      return this.selectedGroupId ? this.groupNameOf(this.selectedGroupId) : '';
    },
  },

  methods: {
    ...groupManageStore.mapMutations([
      'resetBatchSelectedQrs',
      'changeQrsGroup',
    ]),

    init() {
      this.apiInProgress = false;
      this.selectedGroupId = null;
      if (this.$refs.tree) {
        this.$refs.tree.setCurrentKey(null);
      }
    },

    handleNodeClick(data, node) {
      if (!node.expanded) {
        node.expanded = true;
      }
    },

    onCurrentChange(data) {
      this.selectedGroupId = data.id;
    },

    onSubmit() {
      this.apiInProgress = true;
      this.visible = false;

      let command = {
        qrIds: this.qrs.map(qr => qr.id),
        groupId: this.selectedGroupId,
      };

      return qrApi.changeQrsGroup(command).then(() => {
        this.$message({
          type: 'success',
          message: `移动成功。`,
          center: true
        });
        this.resetBatchSelectedQrs();
        this.changeQrsGroup(command);
        this.$emit('qrsGroupChanged');
      }).finally(() => {
        this.apiInProgress = false;
      });
    },

    cancel() {
      this.visible = false;
    },
  },
}
</script>

<style lang="scss" module>
.selectTitle {
  margin-top: 15px;
  margin-bottom: 10px;
}

.groupTreeSection {
  height: 350px;
  margin-left: 15px;
  overflow-y: auto;
}

.groupTree {
  :global {
    .el-tree-node__content {
      height: 40px;
    }
  }
}

.groupTreeRow {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.groupName {
  overflow-x: auto;
  height: 40px;
  display: flex;
  align-items: center;
}

.selectedGroupName {
  height: 60px;
  display: flex;
  align-items: center;
}

.footerButton {
  width: $dialogButtonWidth;
}
</style>

