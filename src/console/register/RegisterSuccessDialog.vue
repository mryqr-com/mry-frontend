<template>
  <el-dialog :close-on-click-modal="false"
             :show-close="false"
             :visible.sync="visible"
             title="注册成功"
             width="500px"
             @close="$emit('update:show', false)">

    <div :class="$style.rightTick">
      <svg :class="$style.checkmark" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <circle :class="$style.checkmark__circle" cx="26" cy="26" fill="none" r="25"/>
        <path :class="$style.checkmark__check" d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none"/>
      </svg>

      <span :class="$style.successText">恭喜您成功注册码如云，现在您可以登录并使用码如云了！</span>
    </div>

    <div slot="footer">
      <el-button :class="$style.closeButton"
                 size="medium"
                 type="primary"
                 @click="goToLogin">
        去登录<i class="el-icon-right el-icon--right"></i>
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import loginApi from '@/common/api/login-api';

export default {

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      visible: this.show,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    goToLogin() {
      return loginApi.logout().then(() => {
        this.$router.replace({name: 'login'});
        this.visible = false;
      });
    }
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

.rightTick {
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0 0 0 #7ac142;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0 0 0 30px #7ac142;
  }
}

.successText {
  margin-left: 10px;
  line-height: 1.5em;
}

.closeButton {
  width: $pageButtonWidth;
}

</style>

