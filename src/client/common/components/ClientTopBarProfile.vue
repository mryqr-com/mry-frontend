<template>
  <div :class="$style.wrapper">
      <span v-if="!isLoggedIn" :class="$style.loginButton" title="点击登录" @click="startLogin">
        <i class="majoricon i-user"></i>
      </span>

    <el-dropdown v-else :class="$style.eldropdown" trigger="click" @command="handleCommand">
      <div :class="$style.memberName">
        <Avatar :avatar="avatar" :class="$style.theAvatar"></Avatar>
        {{ memberName }}
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :class="$style.clientMe" command="gotoClientMe">
          <i class="majoricon i-user"></i>个人中心
        </el-dropdown-item>
        <el-dropdown-item command="quit">
          <i class="majoricon i-logout"></i>退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import loginApi from '@/common/api/login-api';

export default {
  props: ['memberName', 'isLoggedIn', 'avatar'],

  methods: {
    handleCommand(command) {
      return this[command]();
    },

    startLogin() {
      this.$router.replace({name: 'login', query: {from: location.href}});
    },

    quit() {
      return this.$confirm(`确认退出？`, '提示', {
        confirmButtonText: '是的，退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        loginApi.logout().then(() => {
          this.$router.replace({name: 'login', query: {forcePageLogin: true}});
        });
      });
    },

    gotoClientMe() {
      this.$router.push({name: 'client-me'});
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
}

.loginButton {
  cursor: pointer;
}

.loginButton:hover {
  filter: brightness(95%);
}

.eldropdown {
  color: inherit !important;
}

.memberName {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.memberName:hover {
  filter: brightness(95%);
}

.theAvatar {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .clientMe {
    display: none;
  }
}
</style>
