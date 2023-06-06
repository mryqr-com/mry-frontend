<template>
  <el-dialog :title="dialogTitle"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">
    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item label="名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="theModel.name"
                  :class="$style.nameInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="请输入名称"
                  size="medium">
        </el-input>
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
                 :disabled="apiInProgress"
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

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const groupManageStore = createNamespacedHelpers('GROUP_MANAGE_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    parentNode: {
      type: Object,
    },

    groupContainer: {
      type: Array,
    },
  },

  data() {
    return {
      apiInProgress: false,
      visible: this.show,
      theModel: {
        name: null,
      },

      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {max: 50, message: '名称不能超过50个字符', trigger: 'change'},
        ],
      },
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'groupDesignation',
      'currentAppId',
    ]),

    ...groupManageStore.mapGetters(['groupNameOf']),

    dialogTitle() {
      if (this.parentNode && this.parentNode.data.id) {
        return this.groupDesignation === '分组' ?
            `在【${this.groupNameOf(this.parentNode.data.id)}】下新建子分组` :
            `在【${this.groupNameOf(this.parentNode.data.id)}】下新建${this.groupDesignation}或子分组`;
      } else {
        return this.groupDesignation === '分组' ?
            '新建分组' :
            `新建${this.groupDesignation}或分组`;
      }
    },
  },

  methods: {
    ...appOperationStore.mapMutations(['markGroupAsDirty']),
    ...groupManageStore.mapMutations(['addGroup']),

    init() {
      this.theModel.name = null;
      this.apiInProgress = false;
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        this.apiInProgress = true;

        let command = {
          name: this.theModel.name,
          appId: this.currentAppId,
          parentGroupId: this.parentNode ? this.parentNode.data.id : null,
        };

        this.visible = false;
        return groupApi.createGroup(command).then((response) => {
          this.$message({
            type: 'success',
            message: `创建成功。`,
            center: true
          });

          this.groupContainer.unshift({id: response.data.id, children: []});
          if (this.parentNode) {
            this.parentNode.expanded = true;
          }

          this.addGroup({id: response.data.id, name: this.theModel.name});
          this.markGroupAsDirty();
        }).finally(() => {
          this.apiInProgress = false;
        });
      });
    },

    cancel() {
      this.visible = false;
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

