<template>
  <el-dialog :class="$style.wrapper"
             :visible.sync="visible"
             title="编辑成员"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item label="姓名：" prop="name">
        <el-input v-model="theModel.name"
                  :class="$style.theInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="请输入成员姓名"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item label="部门：" prop="departmentIds">
        <el-select ref="deptSelect"
                   v-model="theModel.departmentIds"
                   :class="$style.theInput"
                   filterable
                   multiple
                   size="medium"
                   @change="collapseDropdown('deptSelect')">
          <el-option v-for="dept in departments"
                     :key="dept.id"
                     :label="dept.name"
                     :value="dept.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="mobile-input-item" label="手机号：" prop="mobile">
        <el-input v-model.trim="theModel.mobile"
                  :class="$style.theInput"
                  :maxlength="11"
                  :spellcheck="false"
                  :validate-event="validated"
                  placeholder="请输入手机号（手机号和邮箱不能同时为空）"
                  size="medium"
                  type="tel">
        </el-input>
      </el-form-item>

      <el-form-item ref="email-input-item" label="邮箱：" prop="email">
        <el-input v-model.trim="theModel.email"
                  :class="$style.theInput"
                  :maxlength="50"
                  :spellcheck="false"
                  :validate-event="validated"
                  placeholder="请输入邮箱（邮箱和手机号不能同时为空）"
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
import validations from '@/common/utils/validations';
import {cloneDeep} from 'lodash-es';

import memberApi from '@/common/api/member-api';

const memberListStore = createNamespacedHelpers('MEMBER_LIST_STORE');


export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    member: {
      type: Object,
    }
  },

  data() {
    return {
      validated: false,
      visible: this.show,
      theModel: {
        name: null,
        departmentIds: [],
        mobile: null,
        email: null
      },

      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'change'},
          {max: 50, message: '姓名不能超过50个字符', trigger: 'change'},
        ],

        mobile: [
          {validator: validations.MOBILE_RULE},
          {validator: this.mobileAndEmailValidator}
        ],

        email: [
          {validator: validations.EMAIL_RULE},
          {validator: this.mobileAndEmailValidator}
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
    ...memberListStore.mapGetters(['departments']),
  },

  methods: {
    ...memberListStore.mapMutations(['updateMemberDetailById']),

    mobileAndEmailValidator(rule, value, callback) {
      if (!this.theModel.mobile && !this.theModel.email) {
        callback(new Error('手机号和邮箱不能同时为空'));
      } else {
        callback();
      }
    },

    init() {
      this.validated = false;
      this.theModel.name = this.member.name;
      this.theModel.email = this.member.email;
      this.theModel.mobile = this.member.mobile;
      this.theModel.departmentIds = cloneDeep(this.member.departmentIds);

      let _this = this;
      setTimeout(function () {
        _this.$refs['theForm'].clearValidate();
      }, 300);
    },

    onSubmit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        this.visible = false;

        return memberApi.updateMember(this.member.id, this.theModel).then(() => {
          this.updateMemberDetailById({
            id: this.member.id,
            name: this.theModel.name,
            departmentIds: this.theModel.departmentIds,
            mobile: this.theModel.mobile,
            email: this.theModel.email
          });
          this.$message({
            type: 'success',
            message: `成员更新成功。`,
            center: true
          });
        });
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

