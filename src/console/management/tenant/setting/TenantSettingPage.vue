<template>
  <div :class="$style.wrapper">
    <div :class="$style.menu">
      <ul :class="$style.menuUl">
        <li :class="$style.menuLi">
          <router-link :class="$style.link"
                       :to="{name:'tenant-info'}"
                       tag="div">
            账户信息
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="$style.link"
                       :to="{name:'tenant-base-setting'}"
                       tag="div">
            基本设置
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="$style.link"
                       :to="{name:'tenant-logo-setting'}"
                       tag="div">
            品牌Logo
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="$style.link"
                       :to="{name:'tenant-subdomain-setting'}"
                       tag="div">
            域名设置
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="$style.link"
                       :to="{name:'tenant-invoice-setting'}"
                       tag="div">
            发票抬头
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="$style.link"
                       :to="{name:'tenant-consignee-setting'}"
                       tag="div">
            收货地址
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="$style.link"
                       :to="{name:'api-setting'}"
                       tag="div">
            API集成
          </router-link>
        </li>

      </ul>
    </div>

    <div :class="$style.content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {

  created() {
    document.title = `账户设置 - ${this.tenantName}`;
  },

  computed: {
    ...mapGetters(['tenantName']),
  }
}
</script>


<style lang="scss" module>
$content-margin: 24px;

.wrapper {
  background-color: white;
  height: calc(100vh - #{$consoleTopBarHeight} - #{$content-margin} - #{$content-margin});
  margin: $content-margin;
  display: flex;
}

.menu {
  padding-top: 12px;
  flex-basis: 150px;
  border-right: $primary1pxBorder;
}

.menuUl {
  color: $primaryTextColor;
}

.menuLi:hover {
  color: $primaryThemeColor;
}

.menuLi {
  :global {
    .router-link-active {
      color: $primaryThemeColor;
    }
  }
}

.link {
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.content {
  flex-grow: 1;
  padding: 24px;
}

</style>
