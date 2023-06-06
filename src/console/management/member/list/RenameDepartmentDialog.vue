<template>
  <el-dialog :visible.sync="visible"
             title="重命名部门"
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
                  :class="$style.nameInput"
                  :maxlength="50"
                  :spellcheck="false"
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

    departmentId: {
      type: String,
    },
  },

  data() {
    return {
      visible: this.show,
      theModel: {
        name: null,
      },

      rules: {
        name: [
          {required: true, message: '请输入部门名称', trigger: 'change'},
          {max: 50, message: '部门名称不能超过50个字符', trigger: 'change'},
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
    ...memberListStore.mapGetters(['departmentNameOf'])
  },

  methods: {
    ...memberListStore.mapMutations(['renameDepartmentById']),

    init() {
      this.theModel.name = this.departmentNameOf(this.departmentId);
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['nameBox'].select();
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        this.visible = false;

        return departmentApi.renameDepartment(this.departmentId, this.theModel).then(() => {
          this.$message({
            type: 'success',
            message: `部门重命名成功。`,
            center: true
          });

          let departmentId = this.departmentId;
          let name = this.theModel.name;
          this.renameDepartmentById({departmentId, name});
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
  width: $dialogButtonWidth;
}

</style>

