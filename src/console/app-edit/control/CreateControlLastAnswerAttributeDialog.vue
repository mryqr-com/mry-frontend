<template>
  <el-dialog :append-to-body="true"
             :modal-append-to-body="true"
             :title="`由【${control.name}】快捷创建自定义属性`"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-alert :closable="false"
              title="请注意：通过此种方式所创建的自定义属性的类型被固定为【控件最近一次提交值】"
              type="warning">
    </el-alert>

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="newAttribute"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item label="属性名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="newAttribute.name"
                  :class="$style.nameInput"
                  :maxlength="10"
                  :spellcheck="false"
                  placeholder="请输入属性名称"
                  size="medium">
        </el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" :class="$style.footer">
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
import uuid from 'short-uuid';
import validations from "@/common/utils/validations";
import ACTIONS from "@/console/app-edit/store/app-edit-actions";

const {mapState, mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    control: {
      type: Object,
    },

    currentPage: {
      type: Object,
    }
  },

  data() {
    return {
      visible: this.show,
      newAttribute: {
        id: 'a_' + uuid.generate(),
        name: null,
        type: null,
        fixedValue: null,
        manualInput: false,
        pageId: null,
        controlId: null,
        range: null,
        pcListEligible: true,
        mobileListEligible: false,
        kanbanEligible: false,
        suffix: null,
        precision: 0,
        valueType: 'TEXT_VALUE',
      },

      rules: {
        name: [
          {required: true, message: '请输入属性名称', trigger: 'change'},
          {max: 10, message: '属性名称不能超过10个字符', trigger: 'change'},
          {validator: validations.NO_SPACE_RULE, trigger: 'change'},
          {validator: this.noDuplicatedName, trigger: 'change'}
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
    ...mapGetters([
      'allAttributes',
    ]),
  },

  methods: {
    ...mapActions([ACTIONS.ADD_ATTRIBUTE,]),

    init() {
      this.newAttribute.id = 'a_' + uuid.generate();
      this.newAttribute.name = this.initAttributeName();
      this.newAttribute.type = 'CONTROL_LAST';
      this.newAttribute.pageId = this.currentPage.id;
      this.newAttribute.controlId = this.control.id;
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['nameBox'].select();
        this.$refs['theForm'].clearValidate();
      });
    },

    initAttributeName() {
      if (this.control.fillableSetting && this.control.fillableSetting.fieldName) {
        return this.control.fillableSetting.fieldName;
      }
      return this.control.name;
    },

    noDuplicatedName(rule, value, callback) {
      let isDuplicated = this.allAttributes.filter(item => {
        return item.name === value && item.id !== this.newAttribute.id;
      }).length > 0;

      if (isDuplicated) {
        callback(new Error('属性名称已被占用'));
      } else {
        callback();
      }
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        this.visible = false;

        this[ACTIONS.ADD_ATTRIBUTE](this.newAttribute)
            .catch((error) => {
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

.footer {
  margin-top: 20px;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

