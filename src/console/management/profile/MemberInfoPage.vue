<template>
  <div v-if="infoFetched" :class="$style.wrapper">
    <section :class="$style.infoSection">
      <div :class="$style.row">
        <div :class="$style.title">姓名：</div>
        <div :class="$style.infoValue">
          {{ info.name }}
          <span v-if="info.role === 'TENANT_ADMIN'"
                :class="$style.adminRole"
                class="tableTag yellowTableTag">
            系统管理员
          </span>
        </div>
      </div>

      <div :class="$style.row">
        <div :class="$style.title">手机：</div>
        <div :class="$style.infoValue">{{ info.mobile }}</div>
      </div>

      <div :class="$style.row">
        <div :class="$style.title">邮箱：</div>
        <div :class="$style.infoValue">{{ info.email }}</div>
      </div>

      <div :class="$style.row">
        <div :class="$style.title">部门：</div>
        <div :class="$style.infoValue">{{ info.departments.join(', ') }}</div>
      </div>

      <div :class="$style.row">
        <div :class="$style.title">微信：</div>
        <div :class="$style.infoValue">
          <span :style="wxStyle">{{ wxBoundText }}</span>
          <span>{{ wxBoundNickname }}</span>
          <el-button v-if="info.wxBound"
                     :class="$style.wxButton"
                     size="mini"
                     @click="unbindWx">解绑微信
          </el-button>
          <el-button v-else
                     :class="$style.wxButton"
                     size="mini"
                     @click="bindWx">去绑定
          </el-button>
        </div>
      </div>
    </section>
    <section :class="$style.avatarSection">
      <Avatar v-if="!localAvatar" :avatar="null" :class="$style.placeHolderAvatar"></Avatar>
      <CroppedImageUploader v-model="localAvatar"
                            :buttonStyle="avatarButtonStyle"
                            :ossRequest="memberInfoOssRequest"
                            delete-button-text="删除头像"
                            upload-button-text="上传头像"
                            @deleted="onDeletedAvatar"
                            @uploaded="onUploadedAvatar">
      </CroppedImageUploader>
    </section>
  </div>
</template>

<script>
import memberApi from '@/common/api/member-api';
import {mapGetters, mapMutations} from 'vuex';
import loginApi from "@/common/api/login-api";

export default {
  components: {
    CroppedImageUploader: () => import(/* webpackChunkName: "cropped-image-uploader" */ '@/common/components/CroppedImageUploader'),
  },

  data() {
    return {
      infoFetched: false,
      info: {},
    }
  },

  mounted() {
    this.infoFetched = false;
    return memberApi.fetchMyMemberInfo().then((response) => {
      this.infoFetched = true;
      this.info = response.data;
    });
  },

  methods: {
    ...mapMutations([
      'updateMemberAvatar',
    ]),

    unbindWx() {
      return this.$confirm(`确认解绑微信？`, '提示', {
        confirmButtonText: '是的，解绑微信',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return memberApi.unbindMyWx();
      }).then(() => {
        this.$message({
          type: 'success',
          message: `解绑微信成功。`,
          center: true
        });
        this.info.wxBound = false;
        this.info.wxNickName = null;
      });
    },

    bindWx() {
      this.$confirm(`绑定微信时，您将先用手机微信扫码，然后再次登录。`, '提示', {
        confirmButtonText: '好的，去绑定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        loginApi.logout().then(() => {
          this.$router.push({name: 'login', query: {from: location.href, defaultToWx: true}});
        });
      });
    },

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
    }
  },

  computed: {
    ...mapGetters([
      'currentMemberAvatar',
      'memberInfoOssRequest'
    ]),

    localAvatar: {
      get() {
        return this.currentMemberAvatar;
      },

      set(avatar) {
        this.updateMemberAvatar(avatar)
      }
    },

    wxBoundText() {
      return this.info.wxBound ? "已绑定" : "未绑定";
    },

    wxBoundNickname() {
      return this.info.wxBound && this.info.wxNickName ? `（${this.info.wxNickName}）` : '';
    },

    wxStyle() {
      if (this.info.wxBound) {
        return {
          color: '#10b01b'
        }
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
  }
}
</script>

<style lang="scss" module>
.wrapper {
  margin-right: 30px;
  display: flex;
  align-items: center;
}

.infoSection {
  flex-grow: 1;
  flex-shrink: 0;
}

.avatarSection {
  width: 100px;
  flex-grow: 0;
  flex-shrink: 0;
}

.row {
  display: flex;
  height: 36px;
  align-items: center;
}

.title {
  flex-basis: 80px;
  text-align: right;
  margin-right: 10px;
}

.infoValue {
  max-width: 500px;
  line-height: 1.3em;
  color: $primaryTextColor;
}

.adminRole {
  display: inline-flex;
}

.wxButton {
  margin-left: 10px;
}


.placeHolderAvatar {
  width: 100%;
  height: 100%;
  margin-bottom: 6px;
}

</style>
