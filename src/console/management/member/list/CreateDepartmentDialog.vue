<template>
  <el-dialog :class="$style.wrapper"
             :title="theTitle"
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
      <el-form-item label="部门名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="theModel.name"
                  :class="$style.theInput"
                  :maxlength="50"
                  :spellcheck="false"
                  :validate-event="validated"
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
import departmentApi from '@/common/api/department-api';

const memberListStore = createNamespacedHelpers('MEMBER_LIST_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    parentNode: {
      type: Object,
    },

    departmentContainer: {
      type: Array,
    },
  },

  data() {
    return {
      validated: false,
      visible: this.show,
      apiInProgress: false,
      theModel: {
        name: null,
      },

      rules: {
        name: [
          {required: true, message: '请输入部门名称', trigger: 'change'},
          {max: 50, message: '部门名称不能超过50个字符', trigger: 'change'},
        ],
      }
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...memberListStore.mapGetters(['departmentNameOf']),

    theTitle() {
      if (this.parentNode) {
        return `在【${this.departmentNameOf(this.parentNode.data.id)}】下新建子部门`;
      }
      return '新建部门';
    },
  },

  methods: {
    ...memberListStore.mapMutations(['addDepartment']),

    init() {
      this.apiInProgress = false;
      this.validated = false;
      this.theModel.name = null;
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        this.apiInProgress = true;
        this.visible = false;

        let command = {
          name: this.theModel.name,
          parentDepartmentId: this.parentNode ? this.parentNode.data.id : null,
        };

        return departmentApi.createDepartment(command).then((response) => {
          this.addDepartment({id: response.data.id, name: this.theModel.name, managers: []});
          this.departmentContainer.unshift({id: response.data.id, children: []});
          if (this.parentNode) {
            this.parentNode.expanded = true;
          }
          this.$message({
            type: 'success',
            message: `成功新建部门。`,
            center: true
          });
        }).finally(() => {
          this.apiInProgress = false;
        });
      });
    },

    cancel() {
      this.visible = false;
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.theInput {
  width: 100%;
}

.footerButton {
  margin-top: 10px;
  width: $dialogButtonWidth;
}

</style>

