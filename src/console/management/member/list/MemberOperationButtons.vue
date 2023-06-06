<template>
  <div :class="$style.wrapper">
    <el-button size="medium"
               title="编辑成员基本信息"
               type="text"
               @click.stop="openDetailEditDialog">
      编辑
    </el-button>

    <el-dropdown :class="$style.opsDropdown"
                 size="medium"
                 trigger="click"
                 @command="handleMoreCommand">

      <el-button size="medium"
                 type="text">
        更多<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="resetPassword" title="为成员设置/更新密码">
          设置密码
        </el-dropdown-item>

        <el-dropdown-item v-if="member.role !== 'TENANT_ADMIN'" command="setAsTenantAdmin" title="设置为系统管理员">
          设置为系统管理员
        </el-dropdown-item>

        <el-dropdown-item v-if="member.role === 'TENANT_ADMIN'" command="unsetAsTenantAdmin" title="取消系统管理员">
          取消系统管理员
        </el-dropdown-item>

        <el-dropdown-item v-show="currentDepartment && !isCurrentDepartmentManager(member.id)"
                          command="addDeptManager"
                          title="设置为部门管理员">
          设置为部门管理员
        </el-dropdown-item>

        <el-dropdown-item v-show="currentDepartment && isCurrentDepartmentManager(member.id)"
                          command="removeDeptManager"
                          title="取消部门管理员">
          取消部门管理员
        </el-dropdown-item>

        <el-dropdown-item v-show="member.wxUnionId" command="unbindWx" title="解绑成员微信">
          解绑微信
        </el-dropdown-item>

        <el-dropdown-item v-if="member.active" command="deactivate" title="禁用">
          禁用
        </el-dropdown-item>

        <el-dropdown-item v-if="!member.active" command="activate" title="启用">
          启用
        </el-dropdown-item>

        <el-dropdown-item command="deleteIt" title="删除成员">
          删除
        </el-dropdown-item>

      </el-dropdown-menu>
    </el-dropdown>

    <EditMemberDialog :member="member" :show.sync="showEditDialog"></EditMemberDialog>
    <ResetMemberPasswordDialog :member="member" :show.sync="showPasswordDialog"></ResetMemberPasswordDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import memberApi from '@/common/api/member-api';
import EditMemberDialog from '@/console/management/member/list/EditMemberDialog';
import ResetMemberPasswordDialog from '@/console/management/member/list/ResetMemberPasswordDialog';
import departmentApi from '@/common/api/department-api';

const memberListStore = createNamespacedHelpers('MEMBER_LIST_STORE');

export default {
  props: ['member'],

  components: {
    EditMemberDialog,
    ResetMemberPasswordDialog,
  },

  data() {
    return {
      showEditDialog: false,
      showPasswordDialog: false,
      currentMemberDetail: null
    }
  },

  computed: {
    ...memberListStore.mapGetters(['currentDepartment', 'isCurrentDepartmentManager']),
  },

  methods: {
    ...memberListStore.mapMutations([
      'deleteMember',
      'unbindWx',
      'deactivateMember',
      'activateMember',
      'addDepartmentManager',
      'removeDepartmentManager',
      'updateMemberRoleById',
    ]),

    resetPassword() {
      this.showPasswordDialog = true;
    },

    openDetailEditDialog() {
      this.showEditDialog = true;
    },

    setAsTenantAdmin() {
      return memberApi.updateMemberRole(this.member.id, {role: 'TENANT_ADMIN'}).then(() => {
        this.updateMemberRoleById({
          id: this.member.id,
          role: 'TENANT_ADMIN'
        });
        this.$message({
          type: 'success',
          message: `成功设置为系统管理员。`,
          center: true
        });
      });
    },

    unsetAsTenantAdmin() {
      return memberApi.updateMemberRole(this.member.id, {role: 'TENANT_MEMBER'}).then(() => {
        this.updateMemberRoleById({
          id: this.member.id,
          role: 'TENANT_MEMBER'
        });
        this.$message({
          type: 'success',
          message: `成功取消系统管理员。`,
          center: true
        });
      });
    },

    unbindWx() {
      return this.$confirm(`确认为【${this.member.name}】解绑微信？`, '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return memberApi.unbindMemberWx(this.member.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功为成员【${this.member.name}】解绑微信。`,
            center: true
          });
          this.unbindWx(this.member.id);
        })
      });
    },

    deleteIt() {
      return this.$confirm(`确认删除成员【${this.member.name}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return memberApi.deleteMember(this.member.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除成员【${this.member.name}】。`,
            center: true
          });
          this.deleteMember(this.member.id);
        })
      });
    },

    addDeptManager() {
      return departmentApi.addDepartmentManager(this.currentDepartment.id, this.member.id).then(() => {
        this.$message({
          type: 'success',
          message: `成功设置【${this.member.name}】为【${this.currentDepartment.name}】管理员。`,
          center: true
        });
        this.addDepartmentManager({departmentId: this.currentDepartment.id, memberId: this.member.id});
      });
    },

    removeDeptManager() {
      return departmentApi.removeDepartmentManager(this.currentDepartment.id, this.member.id).then(() => {
        this.$message({
          type: 'success',
          message: `成功取消【${this.member.name}】为【${this.currentDepartment.name}】管理员。`,
          center: true
        });
        this.removeDepartmentManager({departmentId: this.currentDepartment.id, memberId: this.member.id});
      });
    },

    deactivate() {
      return this.$confirm(`禁用后，成员将无法登录，确认禁用成员【${this.member.name}】？`, '提示', {
        confirmButtonText: '是的，禁用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return memberApi.deactivateMember(this.member.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功禁用成员【${this.member.name}】。`,
            center: true
          });
          this.deactivateMember(this.member.id);
        })
      });
    },

    activate() {
      return this.$confirm(`确认启用成员【${this.member.name}】？`, '提示', {
        confirmButtonText: '是的，启用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return memberApi.activateMember(this.member.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功启用成员【${this.member.name}】。`,
            center: true
          });
          this.activateMember(this.member.id);
        })
      });
    },

    handleMoreCommand(command) {
      return this[command]();
    },
  },

}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
}

.opsDropdown {
  margin-left: 15px;
}

</style>
