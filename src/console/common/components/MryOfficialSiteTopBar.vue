<template>
  <div :class="$style.wrapper">
    <div :class="$style.content">
      <div :class="$style.leftPart">
        <a :class="$style.logo" href="//www.mryqr.com">
          <img :class="$style.logoImage" :src="logoImageUrl" alt="码如云"/>
          码如云
        </a>

        <a :class="$style.link" href="//www.mryqr.com">产品简介</a>
<!--        <a :class="$style.link" href="/public/packages" target="_blank">服务价格</a>-->
        <a :class="$style.link" href="/public/app-templates" target="_blank">应用模板</a>
<!--        <a :class="$style.link" href="/public/printing-service" target="_blank">印刷服务</a>-->
        <a :class="$style.link" href="//docs.mryqr.com" target="_blank">文档中心</a>
      </div>
      <div :class="$style.rightPart">
        <el-button v-if="!isLoggedIn"
                   :class="$style.button"
                   size="small"
                   type="plain"
                   @click="gotoRegister">
          免费注册
        </el-button>

        <el-button :class="$style.button"
                   size="small"
                   type="primary"
                   @click="gotoConsoleHome">
          {{ isLoggedIn ? '进入后台' : '登录后台' }}
        </el-button>

        <Profile v-if="isLoggedIn" :class="$style.profile"></Profile>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import mryLogo from '@/common/static/mry.svg';
import Profile from '@/console/common/Profile';


export default {
  components: {
    Profile,
  },

  computed: {
    ...mapGetters(['isLoggedIn']),

    logoImageUrl() {
      return mryLogo;
    },
  },

  methods: {
    gotoRegister() {
      this.$router.push({name: 'register'});
    },

    gotoConsoleHome() {
      this.$router.push({name: 'default-home'});
    },
  }
}
</script>


<style lang="scss" module>
.wrapper {
  position: fixed;
  z-index: 200;
  width: 100vw;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: $consoleTopBarHeight;
  box-shadow: $primaryShadow;
  background-color: $whiteBackgroundColor;
  padding: 0 24px;
}

.content {
  width: 100%;
  max-width: 1200px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.leftPart {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 40px;
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  flex-shrink: 0;
}

.logo:link, .logo:visited, .logo:active {
  color: $primaryTextColor;
}

.logoImage {
  width: 36px;
  margin-right: 8px;
}

.link {
  font-size: 16px;
  margin-right: 20px;
  margin-left: 20px;
}

.link:hover {
  color: $primaryThemeColor !important;
}

.link:link, .link:visited, .link:active {
  color: $primaryTextColor;
}

.rightPart {
  flex-grow: 0;
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.button {
  font-size: 14px;
  width: 120px;
}

.profile {
  margin-left: 10px;
}

@media (max-width: $pcScreenBreakpoint) {
  .rightPart {
    display: none;
  }
}

</style>
