<template>
  <div v-if="infoFetched" :class="$style.wrapper">
    <div :class="$style.memberInfo">
      <section :class="$style.avatarSection">
        <Avatar v-if="!localAvatar" :avatar="memberAvatar" :class="$style.placeHolderAvatar"></Avatar>
        <CroppedImageUploader v-model="localAvatar"
                              :buttonStyle="avatarButtonStyle"
                              :ossRequest="memberInfoOssRequest"
                              delete-button-text="删除头像"
                              upload-button-text="上传头像"
                              @deleted="onDeletedAvatar"
                              @uploaded="onUploadedAvatar">
        </CroppedImageUploader>
      </section>

      <section :class="$style.memberProfileSection">
        <div :class="$style.memberName">
          {{ info.name }}
          <span v-if="info.role === 'TENANT_ADMIN'"
                :class="$style.adminRole"
                class="tableTag yellowTableTag">
            系统管理员
          </span>
        </div>

        <div :class="$style.profileRow">
          <div :class="$style.profileTitle">账户：</div>
          <div :class="$style.profileInfoValue">{{ tenantName }}</div>
        </div>

        <div :class="$style.profileRow">
          <div :class="$style.profileTitle">手机：</div>
          <div :class="$style.profileInfoValue">{{ info.mobile }}</div>
        </div>

        <div :class="$style.profileRow">
          <div :class="$style.profileTitle">邮箱：</div>
          <div :class="$style.profileInfoValue">{{ info.email }}</div>
        </div>

        <div :class="$style.profileRow">
          <div :class="$style.profileTitle">部门：</div>
          <div :class="$style.profileInfoValue">{{ info.departments.join(', ') }}</div>
        </div>
      </section>
    </div>

    <div :class="$style.buttonArea">
      <button :class="$style.buttonRow"
              class="plainButton"
              @click="gotoBaseSettingPage">
        <span :class="$style.buttonRowLeftTitle">
          <i :class="$style.buttonRowIcon" class="majoricon i-setting"/>
          基本设置
        </span>
        <i :class="$style.buttonRowRightArrow" class="majoricon i-right"/>
      </button>

      <button :class="$style.buttonRow"
              class="plainButton"
              @click="gotoResetPasswordPage">
        <span :class="$style.buttonRowLeftTitle">
          <i :class="$style.buttonRowIcon" class="majoricon i-lock"/>
          修改密码
        </span>
        <i :class="$style.buttonRowRightArrow" class="majoricon i-right"/>
      </button>

      <button :class="$style.buttonRow"
              class="plainButton"
              @click="gotoChangeMobilePage">
        <span :class="$style.buttonRowLeftTitle">
          <i :class="$style.buttonRowIcon" class="majoricon i-mobile"/>
          更改手机号
        </span>
        <i :class="$style.buttonRowRightArrow" class="majoricon i-right"/>
      </button>

      <button :class="$style.buttonRow"
              class="plainButton"
              @click="gotoMyAppsPage">
        <span :class="$style.buttonRowLeftTitle">
          <i :class="$style.buttonRowIcon" class="majoricon i-appstore"/>
          我的应用
        </span>
        <i :class="$style.buttonRowRightArrow" class="majoricon i-right"/>
      </button>

<!--      <button v-if="info.wxBound"-->
<!--              :class="$style.buttonRow"-->
<!--              class="plainButton"-->
<!--              @click="unbindWx">-->
<!--        <span :class="$style.buttonRowLeftTitle">-->
<!--          <i :class="$style.buttonRowIcon" class="majoricon i-api"/>-->
<!--          解绑微信{{ wxNickName }}-->
<!--        </span>-->
<!--        <i :class="$style.buttonRowRightArrow" class="majoricon i-right"/>-->
<!--      </button>-->

      <button :class="$style.buttonRow"
              class="plainButton"
              @click="logout">
        <span :class="$style.buttonRowLeftTitle">
          <i :class="$style.buttonRowIcon" class="majoricon i-logout"/>
          退出登录
        </span>
        <i :class="$style.buttonRowRightArrow" class="majoricon i-right"/>
      </button>

      <button :class="$style.buttonRow"
              class="plainButton"
              @click="gotoMryOfficialSite">
        <span :class="$style.buttonRowLeftTitle">
          <i :class="$style.buttonRowIcon" class="majoricon i-home"/>
          码如云官网
        </span>
        <i :class="$style.buttonRowRightArrow" class="majoricon i-right"/>
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import memberApi from "@/common/api/member-api";
import loginApi from "@/common/api/login-api";
import {goToMryOfficialWebsite} from "@/common/utils/common-utils";

export default {
  components: {
    CroppedImageUploader: () => import(/* webpackChunkName: "cropped-image-uploader" */ '@/common/components/CroppedImageUploader'),
  },

  data() {
    return {
      infoFetched: false,
      info: null,
    }
  },

  mounted() {
    document.title = '个人设置';
    this.infoFetched = false;
    return memberApi.fetchMyMemberInfo().then((response) => {
      this.infoFetched = true;
      this.info = response.data;
    });
  },

  computed: {
    ...mapGetters([
      'memberAvatar',
      'memberInfoOssRequest',
      'tenantName',
    ]),

    wxNickName() {
      if (this.info && this.info.wxNickName) {
        return `（${this.info.wxNickName}）`;
      }
    },

    localAvatar: {
      get() {
        return this.memberAvatar;
      },

      set(avatar) {
        this.updateMemberAvatar(avatar)
      }
    },

    avatarButtonStyle() {
      {
        return {
          fontStyle: {
            fontFamily: "默认",
            fontSize: 13,
            bold: false,
            italic: false,
            color: "#606266",
          },
          backgroundColor: "white",
          border: {
            type: 'SOLID',
            width: 1,
            sides: ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'],
            color: '#DCDFE6'
          },
          shadow: {
            width: 0,
            color: 'rgba(0, 0, 0, .3)'
          },
          vPadding: 6,
          borderRadius: 0,
        };
      }
    }
  },

  methods: {
    ...mapMutations([
      'updateMemberAvatar',
    ]),

    onUploadedAvatar(avatar) {
      return memberApi.updateMyAvatar({avatar: avatar}).then(() => {
        this.$message({
          type: 'success',
          message: '头像上传成功。',
          center: true
        });
      });
    },

    onDeletedAvatar() {
      return memberApi.deleteMyAvatar().then(() => {
        this.$message({
          type: 'success',
          message: `头像删除成功。`,
          center: true
        });
      });
    },

    gotoBaseSettingPage() {
      this.$router.push({name: 'client-me-base-setting'});
    },

    gotoResetPasswordPage() {
      this.$router.push({name: 'client-me-reset-password'});
    },

    gotoMyAppsPage() {
      this.$router.push({name: 'default-home'});
    },

    gotoChangeMobilePage() {
      this.$router.push({name: 'client-me-change-mobile'});
    },

    unbindWx() {
      return this.$confirm(`确认解绑微信？`, '提示', {
        confirmButtonText: '是的，解绑',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return memberApi.unbindMyWx().then(() => {
          this.info.wxBound = false;
          this.info.wxNickName = null;
          this.$message({
            type: 'success',
            message: `成功解绑微信。`,
            center: true,
            duration: 1000
          });
        });
      });
    },

    logout() {
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

    gotoMryOfficialSite() {
      goToMryOfficialWebsite();
    }
  }
};
</script>

<style lang="scss" module>
$buttonRowHeight: 60px;

.wrapper {
}

.memberInfo {
  display: flex;
  align-items: center;
  padding: 30px 24px;
  background-color: white;
  box-shadow: $lightShadow;
}

.avatarSection {
  width: 100px;
  flex-grow: 0;
  flex-shrink: 0;
}

.placeHolderAvatar {
  width: 100%;
  height: 100%;
  margin-bottom: 6px;
}

.memberProfileSection {
  flex-grow: 1;
  flex-shrink: 0;
  margin-left: 30px;
}

.memberName {
  font-size: 20px;
  font-weight: 500;
  color: $primaryTextColor;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.adminRole {
  display: inline-flex;
  font-size: 14px;
  margin-left: 5px;
  font-weight: normal;
}

.profileRow {
  display: flex;
  min-height: 30px;
  align-items: center;
}

.profileTitle {
  margin-right: 10px;
}

.profileInfoValue {
  max-width: 150px;
  line-height: 1.3em;
  color: $primaryTextColor;
}

.buttonArea {
  margin-top: 30px;
  border-top: $primary1pxBorder;
  border-bottom: $primary1pxBorder;
  background-color: white;
}

.buttonRow {
  width: 100%;
  height: $buttonRowHeight;
  border-bottom: $primary1pxBorder;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.buttonRow:last-child {
  border-bottom: none;
}

.buttonRow:hover {
  cursor: pointer;
}

.buttonRowLeftTitle {
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-size: 15px;
}

.buttonRowIcon {
  font-size: 18px;
  font-weight: 500;
  margin-right: 15px;
}

.buttonRowRightArrow {
  flex-grow: 0;
  font-size: 15px;
  font-weight: 500;
  color: $regularTextColor;
}

</style>
