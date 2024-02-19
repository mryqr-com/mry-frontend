<template>
  <div :class="$style.wrapper">
    <div :class="$style.leftSection" :style="leftSectionStyle">
      <div :class="$style.foldContainer">
        <!--      由于fold前后将导致QR分组管理页的table变大后无法变小，故隐藏-->
        <!--        <button :class="$style.foldButton" @click="toggleFold">-->
        <!--          <i v-if="fold" :class="$style.foldIcon" class="el-icon-d-arrow-right"></i>-->
        <!--          <i v-if="!fold" :class="$style.foldIcon" class="el-icon-d-arrow-left"></i>-->
        <!--        </button>-->
      </div>

      <div :class="$style.logoArea">
        <router-link :class="$style.logoLink" :to="{ name: 'my-app-list'}" title="返回我的应用">
          <div :class="$style.logoImageContainer">
            <img :class="$style.logoImage" :src="logoImageUrl" :style="logoImageStyle" alt="码如云">
          </div>
          <div v-if="!fold" :class="$style.logoText">{{ logoText }}</div>
        </router-link>
      </div>

      <div :class="$style.menuArea">
        <slot :fold="fold" name="menu">请在这里添加菜单</slot>
      </div>
    </div>

    <div :class="$style.rightSection" :style="rightSectionStyle">
      <slot></slot>
    </div>

  </div>
</template>

<script>
import mryLogo from '@/common/static/mry.svg';
import {mapGetters} from 'vuex';
import eventBus from '@/common/utils/event-bus';

export default {
  data() {
    return {
      fold: 'true' === sessionStorage.getItem('leftNavFold')
    }
  },

  mounted() {
    eventBus.$emit('lefeMenuFoldChanged', this.fold ? 'FOLD' : 'UNFOLD');
  },

  methods: {
    toggleFold() {
      this.fold = !this.fold;
      sessionStorage.setItem('leftNavFold', this.fold);
      eventBus.$emit('lefeMenuFoldChanged', this.fold ? 'FOLD' : 'UNFOLD');
    }
  },

  computed: {
    ...mapGetters(['tenantLogo', 'tenantName']),

    logoImageStyle() {
      return {
        maxWidth: this.fold ? '50px' : '200px',
        minHeight: this.fold ? '30px' : '50px',
      }
    },

    logoImageUrl() {
      return this.tenantLogo ? this.tenantLogo.fileUrl : mryLogo;
    },

    logoText() {
      let mryLogoText = '码如云';
      return this.tenantLogo ? this.tenantName : mryLogoText;
    },

    leftSectionStyle() {
      return {
        width: this.fold ? '50px' : '240px'
      }
    },

    rightSectionStyle() {
      return {
        marginLeft: this.fold ? '50px' : '240px'
      }
    },

  },

};
</script>

<style lang="scss" module>
.wrapper {
  height: 100vh;
}

.leftSection:hover .foldButton {
  display: block;
}

.foldContainer {
  height: 50px;
  position: relative;
}

.foldButton {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  border: none;
  background-color: transparent;
}

.foldIcon {
  font-size: 18px;
  color: white;
  font-weight: 500;
  transition: color 0.5s;
}

.foldIcon:hover {
  color: $primaryThemeColor;
}

.leftSection {
  height: 100vh;
  background-color: #24282c;
  position: fixed;
  transition: width 0.5s;
  top: 0;
  left: 0;
}

.logoArea {
  margin-top: 30px;
  margin-bottom: 30px;
}

.logoLink {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.logoImageContainer {
  overflow: hidden;
  position: relative;
}

.logoImageContainer:after {
  content: "";
  position: absolute;
  top: -50%;
  left: -60%;
  width: 20%;
  height: 200%;
  opacity: 0;
  transform: rotate(30deg);
  background: rgba(255, 255, 255, 0.13);
  background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0.13) 0%,
          rgba(255, 255, 255, 0.13) 77%,
          rgba(255, 255, 255, 0.5) 92%,
          rgba(255, 255, 255, 0.0) 100%
  );
}

.logoImageContainer:hover:after {
  opacity: 1;
  left: 130%;
  transition-property: left, top, opacity;
  transition-duration: 0.7s, 0.7s, 0.15s;
  transition-timing-function: ease;
}

.logoImageContainer:active:after {
  opacity: 0;
}

.logoImage {
  max-height: 50px;
  transition: max-width 0.5s;
}

.logoText {
  margin-top: 20px;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 18px;
  font-weight: 500;
  color: white;
  text-align: center;
}

.menuArea {
  overflow-y: auto;
  height: calc(100vh - 50px - 88px - 30px - 30px);
  scrollbar-face-color: $primaryThemeColor;
}

.mryLinkContainer {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 15px;
  left: 0;
  font-size: 12px;
  z-index: -1;
}

.mryLink:link, .mryLink:visited, .mryLink:active {
  color: $regularTextColor;
}

.mryLink:hover {
  color: $primaryThemeColor;
  cursor: pointer;
}

.rightSection {
  height: 100vh;
  background-color: $lightBackgroundColor;
  transition: margin-left 0.5s;
}

</style>
