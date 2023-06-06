<template>
  <div v-if="ready" :class="$style.wrapper" :style="wrapperStyle">
    <section :class="$style.loginSection">
      <div :class="$style.loginHeader">
        <Logo :iconFile="logo" :name="tenantName"></Logo>
      </div>

      <el-alert v-if="wxIdInfo"
                :class="$style.wxBindAlert"
                :closable="false"
                center
                effect="light"
                type="warning">
        您即将绑定微信，请使用手机号或邮箱登录以完成绑定，绑定后方可微信扫码登录。
      </el-alert>

      <MobileOrEmailLogin v-if="loginType === 'MobileOrEmailLogin'"
                          :wxIdInfo="wxIdInfo"
                          @loginSuccess="gotoFromUrl">
      </MobileOrEmailLogin>

      <VerificationCodeLogin v-if="loginType === 'VerificationCodeLogin'"
                             :wxIdInfo="wxIdInfo"
                             @loginSuccess="gotoFromUrl">
      </VerificationCodeLogin>

      <section :class="$style.bottomSection">
        <span v-if="loginType==='MobileOrEmailLogin'"
              :class="[$style.textButton]"
              class="underLinedLink"
              title="通过发往手机或邮箱的验证码进行登录"
              type="text"
              @click="loginType='VerificationCodeLogin'">
          验证码登录
        </span>

        <span v-if="loginType==='VerificationCodeLogin'"
              :class="[$style.textButton]"
              class="underLinedLink"
              title="使用密码登录"
              type="text"
              @click="loginType='MobileOrEmailLogin'">
          密码登录
        </span>

        <span v-if="!wxIdInfo && !isInWx()"
              :class="[$style.textButton,$style.pcWxLogin]"
              class="underLinedLink"
              title="用手机微信扫描二维码登录"
              type="text"
              @click="startPcWxLogin">
          <img :class="$style.wxLogo" :src="wxLogoUrl" alt="微信登录">&nbsp;微信扫码登录
        </span>

        <span v-if="loginType==='MobileOrEmailLogin'"
              :class="[$style.textButton]"
              class="underLinedLink"
              type="text"
              @click="gotoFindbackPasswordPage">
          忘记密码
        </span>
      </section>
    </section>

  </div>
</template>

<script>
import cookies from 'js-cookie'
import loginApi from '@/common/api/login-api';
import {
  changeFavIcon,
  currentSubdomainPrefix,
  isCurrentUsingDomainName,
  isInWx,
  isSubdomainCustomized,
  rootDomain
} from '@/common/utils/common-utils';
import wxLogo from '@/common/static/wx.png';
import tenantApi from '@/common/api/tenant-api';
import {imageDisplayUrl, imageThumbnailUrl} from '@/common/utils/image-utils'
import VerificationCodeLogin from '@/common/components/login/VerificationCodeLogin';
import MobileOrEmailLogin from '@/common/components/login/MobileOrEmailLogin';
import commonApi from '@/common/api/common-api';
import {mapMutations} from 'vuex';

const FROM_URL_KEY = 'fromUrl';

export default {
  components: {
    VerificationCodeLogin,
    MobileOrEmailLogin
  },
  data() {
    return {
      ready: false,
      loginType: 'MobileOrEmailLogin',

      tenantName: null,
      logo: null,
      loginBackground: null,

      wxIdInfo: null,
      forcePageLogin: false,
      defaultToWx: false,
    }
  },

  mounted() {
    this.init();

    let fromUrl = this.$route.query.from ? this.$route.query.from : '';
    this.setFromUrlCookie(fromUrl);

    loginApi.refreshToken().then(() => {
      this.gotoFromUrl();
    }).catch(() => {
      if (isInWx() && isCurrentUsingDomainName() && !this.wxIdInfo && !this.forcePageLogin) {
        return commonApi.fetchMobileWxInfo().then((response) => {
          let mobileWxInfo = response.data;
          const mobileWxRedirectUrl = encodeURIComponent(mobileWxInfo.mobileAuthRedirectUrl);
          let mobileWxAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${mobileWxInfo.mobileAppId}&redirect_uri=${mobileWxRedirectUrl}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
          location.replace(mobileWxAuthUrl);
        });
      }

      if (this.defaultToWx && !this.forcePageLogin) {
        this.startPcWxLogin();
        return;
      }

      if (isSubdomainCustomized()) {
        let subdomainPrefix = currentSubdomainPrefix();
        tenantApi.fetchTenantPublicProfile(subdomainPrefix).then((response) => {
          const profile = response.data;
          this.tenantName = profile.name;
          this.logo = profile.logo;
          this.loginBackground = profile.loginBackground;
          if (this.logo) {
            changeFavIcon(imageThumbnailUrl(this.logo));
          }

          document.title = `登录 - ${this.tenantName}`;
        }).catch(() => {
          console.error("Failed to fetch tenant public profile, use mry's defaults.");
        }).finally(() => {
          this.ready = true;
        })
      } else {
        document.title = "登录 - 码如云";
        this.ready = true;
      }
    });
  },

  computed: {
    wrapperStyle() {
      return {
        backgroundImage: this.loginBackground ? `url('${imageDisplayUrl(this.loginBackground)}')` : null,
      }
    },

    wxLogoUrl() {
      return wxLogo;
    },

  },

  methods: {
    ...mapMutations(['clearMyAppsCache']),
    isInWx,
    init() {
      this.ready = false;
      this.loginType = 'MobileOrEmailLogin';
      this.tenantName = null;
      this.logo = null;
      this.loginBackground = null;
      this.wxIdInfo = this.$route.query.wx ? this.$route.query.wx : null;
      this.defaultToWx = !!this.$route.query.defaultToWx;
      this.forcePageLogin = !!this.$route.query.forcePageLogin;
    },

    setFromUrlCookie(fromUrl) {
      cookies.set(FROM_URL_KEY, fromUrl, {domain: rootDomain(), expires: 1 / 24, path: '/'});
    },

    gotoFromUrl() {
      this.clearMyAppsCache();
      let fromUrl = cookies.get(FROM_URL_KEY);
      cookies.remove(FROM_URL_KEY, {domain: rootDomain(), path: '/'});
      if (fromUrl) {
        location.replace(fromUrl);
      } else {
        this.$router.replace({name: 'default-home'});
      }
    },

    gotoFindbackPasswordPage() {
      this.$router.push({name: 'findback-password'})
    },

    startPcWxLogin() {
      return commonApi.fetchPcWxInfo().then((response) => {
        let appId = response.data.pcAppId;
        const redirectUrl = encodeURIComponent(response.data.pcAuthRedirectUrl);
        let authUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_login#wechat_redirect`;
        location.replace(authUrl);
      });
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  background-position: center;
  background-size: cover;
  background-color: white;
  justify-content: center;
  background-image: linear-gradient(#b9e3ff, white);
}

.loginSection {
  width: 500px;
  background-color: white;
  padding: 24px;
  margin-top: -100px;
  box-shadow: $pageShadow;
}

.loginHeader {
  margin-top: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 50px;
  justify-content: center;
}

.wxBindAlert {
  margin-bottom: 20px;

  :global {
    p {
      line-height: 1.3em;
    }
  }
}

.bottomSection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.pcWxLogin:hover {
  color: #08c406;
}

.wxLogo {
  height: 24px;
}

@media (max-width: $mobileScreenBreakpoint) {
  .wrapper {
    background-image: none !important;
    align-items: flex-start;
  }

  .loginSection {
    margin-top: 70px;
    box-shadow: none;
  }

  .pcWxLogin {
    display: none;
  }

  .wxBindAlert {
    display: none;
  }
}

</style>
