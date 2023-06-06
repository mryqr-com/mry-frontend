<template>
  <div :class="$style.wrapper">
    <el-button :class="$style.addButton"
               :disabled="isMaxMemberReached"
               :title="addButtonTitle"
               icon="el-icon-plus"
               size="medium"
               type="primary"
               @click="showDialog">
      新增成员
    </el-button>

    <el-dialog :visible.sync="dialogVisible"
               title="新增成员"
               width="500px"
               @open="openInit">

      <el-form ref="theForm"
               :model="theModel"
               :rules="rules"
               autocomplete="off"
               label-position="top">

        <el-form-item label="姓名：" prop="name">
          <el-input ref="name-input"
                    v-model="theModel.name"
                    :class="$style.inputBox"
                    :maxlength="50"
                    :spellcheck="false"
                    autocomplete="off"
                    placeholder="请输入成员姓名"
                    size="medium">
          </el-input>
        </el-form-item>

        <el-form-item :key="deptKey" label="部门：" prop="departmentIds">
          <el-select ref="deptSelect"
                     v-model="theModel.departmentIds"
                     :class="$style.inputBox"
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
                    :class="$style.inputBox"
                    :maxlength="11"
                    :spellcheck="false"
                    :validate-event="validated"
                    autocomplete="off"
                    novalidate
                    placeholder="请输入手机号（手机号和邮箱不能同时为空）"
                    size="medium"
                    type="tel">
          </el-input>
        </el-form-item>

        <el-form-item ref="email-input-item" label="邮箱：" prop="email">
          <el-input v-model.trim="theModel.email"
                    :class="$style.inputBox"
                    :maxlength="50"
                    :spellcheck="false"
                    :validate-event="validated"
                    autocomplete="off"
                    novalidate
                    placeholder="请输入邮箱（邮箱和手机号不能同时为空）"
                    size="medium">
          </el-input>
        </el-form-item>

        <el-form-item ref="password-input-item" label="密码(由8-20位字符组成，可以为字母，数字或特殊符号)：" prop="password">
          <el-input ref="password-input"
                    v-model.trim="theModel.password"
                    :class="$style.inputBox"
                    :maxlength="20"
                    :spellcheck="false"
                    :validate-event="validated"
                    autocomplete="new-password"
                    placeholder="请输入密码"
                    size="medium"
                    type="password">
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
                   icon="el-icon-plus"
                   size="medium"
                   type="primary"
                   @click="onSubmit">
          确定
        </el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';

import memberApi from '@/common/api/member-api';
import validations from '@/common/utils/validations';
import MEMBER_LIST_ACTIONS from '@/console/management/member/list/store/member-list-actions';
import uuid from 'short-uuid';

const memberListStore = createNamespacedHelpers('MEMBER_LIST_STORE');

export default {
  data() {
    return {
      validated: false,
      dialogVisible: false,
      apiInProgress: false,
      deptKey: uuid.generate(),//trick，departmentIds无法实时更新
      theModel: {
        name: null,
        departmentIds: [],
        mobile: null,
        email: null,
        password: null,
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

        password: [
          {required: true, message: '请输入密码', trigger: 'change'},
          {validator: validations.PASSWORD_RULE, trigger: 'change'}
        ]
      }
    }
  },

  computed: {
    ...mapGetters([
      'isMaxMemberReached',
      'isCurrentPlanExpired',
      'currentPlanName',
    ]),

    ...memberListStore.mapGetters(['currentDepartment', 'departments']),

    addButtonTitle() {
      if (this.isMaxMemberReached) {
        if (this.isCurrentPlanExpired) {
          return `无法新增成员，当前套餐(${this.currentPlanName})已过期，有效套餐已降为免费版，且已达所允许成员数量上限，如需继续请升级或续费。`;
        }
        return `无法新增成员，已达当前套餐(${this.currentPlanName})所允许成员数量上限，如需继续请升级。`;
      } else {
        return '添加新增';
      }
    },
  },

  methods: {
    ...memberListStore.mapActions([
      MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS,
    ]),

    ...memberListStore.mapMutations([
      'clearSearchTerm',
      'resetPageIndex',
      'resetSorting',
    ]),

    mobileAndEmailValidator(rule, value, callback) {
      if (!this.theModel.mobile && !this.theModel.email) {
        callback(new Error('手机号和邮箱不能同时为空'));
      } else {
        callback();
      }
    },

    showDialog() {
      this.dialogVisible = true;
    },

    openInit() {
      this.validated = false;
      this.apiInProgress = false;
      this.theModel.name = null;
      this.theModel.departmentIds = [];
      this.theModel.email = null;
      this.theModel.mobile = null;
      this.theModel.password = null;

      if (this.currentDepartment) {
        this.theModel.departmentIds = [this.currentDepartment.id];
      }

      this.deptKey = uuid.generate();
      this.$nextTick(() => {
        this.$refs['name-input'].focus();
        this.$refs['theForm'].resetFields();
      });
    },

    onSubmit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {

        this.apiInProgress = true;
        return memberApi.createMember(this.theModel).then(() => {
          this.dialogVisible = false;

          this.$message({
            type: 'success',
            message: `成员添加成功。`,
            center: true
          });

          this.clearSearchTerm();
          this.resetPageIndex();
          this.resetSorting();
          return this[MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS]();
        }).finally(() => {
          this.apiInProgress = false;
        });

      });
    },

    cancel() {
      this.dialogVisible = false;
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
  :global {
    .el-dialog__body {
      padding-bottom: 10px;
    }
  }
}

.addButton {
  width: $pageButtonWidth;
}

.inputBox {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>
