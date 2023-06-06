<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <div :class="$style.profileButton">
      <Avatar :avatar="currentMemberAvatar" :class="$style.theAvatar"></Avatar>
      {{ currentMemberName }}
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="backToConsoleHomePage"><i class="el-icon-mobile-phone"></i>我的应用
      </el-dropdown-item>
      <el-dropdown-item command="gotoSettings"><i class="el-icon-setting"></i>个人设置</el-dropdown-item>
      <el-dropdown-item command="quit"><i class="el-icon-switch-button"></i>退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import {mapGetters} from 'vuex';
import loginApi from '@/common/api/login-api';

export default {
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'backToConsoleHomePage': {
          this.$router.push({name: 'my-app-list'});
          break;
        }

        case 'gotoSettings': {
          this.$router.push({name: 'personal-settings'});
          break;
        }

        case 'quit': {
          return this.$confirm(`确认退出？`, '提示', {
            confirmButtonText: '是的，退出',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            loginApi.logout().then(() => {
              this.$router.replace({name: 'login', query: {forcePageLogin: true}});
            });
          });
        }
      }
    }
  },

  computed: {
    ...mapGetters([
      'currentMemberName',
      'currentMemberAvatar',
    ])
  }
};
</script>

<style lang="scss" module>
.profileButton {
  display: flex;
  align-items: center;
}

.profileButton:hover {
  color: $primaryThemeColor;
  cursor: pointer;
}

.theAvatar {
  width: 36px;
  height: 36px;
  margin-right: 5px;
}

</style>
