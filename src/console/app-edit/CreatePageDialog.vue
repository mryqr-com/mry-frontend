<template>
  <el-dialog :class="$style.wrapper"
             :visible.sync="visible"
             title="新建页面"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-form ref="ruleForm"
             :hide-required-asterisk="true"
             :model="ruleForm"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item label="请输入页面名称：" prop="name">
        <el-input ref="input-box"
                  v-model="ruleForm.name"
                  :class="$style.theInput"
                  :maxlength="10"
                  :spellcheck="false"
                  size="medium"
                  @focus="resetForm">
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
                 icon="el-icon-plus"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from 'vuex'
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import {pageName} from '@/common/utils/common-utils';

const {mapActions, mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  name: "CreatePageDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      visible: this.show,
      ruleForm: {
        name: null
      },
      rules: {
        name: [
          {required: true, message: '请输入页面名称', trigger: 'change'},
          {max: 10, message: '页面名称长度不能超过10个字符', trigger: 'change'},
          {validator: this.noDuplicatedName, trigger: 'change'}
        ]
      }
    };
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...mapGetters(['allPages']),
  },

  methods: {
    ...mapActions([
      ACTIONS.CREATE_PAGE,
    ]),

    init() {
      this.ruleForm.name = null;
      this.$nextTick(() => {
        this.$refs['input-box'].focus();
      });
    },

    noDuplicatedName(rule, value, callback) {
      let isDuplicated = this.allPages.filter(page => {
        return pageName(page) === value;
      }).length > 0;

      if (isDuplicated) {
        callback(new Error('页面名称已被占用'));
      } else {
        callback();
      }
    },

    onSubmit() {
      return this.$refs['ruleForm'].validate().then(() => {
        return this[ACTIONS.CREATE_PAGE](this.ruleForm.name).then((id) => {
              this.$router.push({name: "app-edit-page", params: {pageId: id}});
              this.visible = false;
              this.$message({
                type: 'success',
                message: `页面 【${this.ruleForm.name}】 创建成功。`,
                center: true
              });
            }
        ).catch((error) => {
          this.$message({
            type: 'error',
            message: error.message ? error.message : error,
            center: true
          });
        });
      });
    },

    cancel() {
      this.visible = false;
    },

    resetForm() {
      this.$refs['ruleForm'].clearValidate('name');
    }

  },
}
</script>


<style lang="scss" module>
.theInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

