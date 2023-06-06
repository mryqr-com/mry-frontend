<template>
  <LeftNavedPageWrapper>
    <template v-slot:menu="{fold}">
      <ul>
        <li :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'my-app-list'}"
                       tag="div"
                       title="我的应用">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="tablet-alt"/></span>
            <span v-if="!fold">我的应用</span>
          </router-link>
        </li>

        <li v-if="isTenantAdmin" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'member-list'}"
                       tag="div"
                       title="成员管理">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="user-friends"/></span>
            <span v-if="!fold">成员管理</span>
          </router-link>
        </li>

        <li v-if="hasManagedApps" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'app-list'}"
                       tag="div"
                       title="应用管理">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="cubes"/></span>
            <span v-if="!fold">应用管理</span>
          </router-link>
        </li>
        <!--free-version-->
        <!--        <li v-if="isTenantAdmin" :class="$style.menuLi">-->
<!--          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"-->
<!--                       :to="{name:'tenant-order-list'}"-->
<!--                       tag="div"-->
<!--                       title="订单管理">-->
<!--            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="shopping-cart"/></span>-->
<!--            <span v-if="!fold">订单管理</span>-->
<!--          </router-link>-->
<!--        </li>-->

        <li v-if="isTenantAdmin" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'tenant-settings'}"
                       tag="div"
                       title="账户设置">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="tools"/></span>
            <span v-if="!fold">账户设置</span>
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'personal-settings'}"
                       tag="div"
                       title="个人设置">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="user-cog"/></span>
            <span v-if="!fold">个人设置</span>
          </router-link>
        </li>
      </ul>
    </template>

    <div>
      <ManagementTopBar></ManagementTopBar>
      <router-view :key="managementPageRefreshKey"></router-view>
    </div>
  </LeftNavedPageWrapper>
</template>

<script>
import ManagementTopBar from '@/console/management/ManagementTopBar';
import {mapGetters, mapState} from 'vuex';
import LeftNavedPageWrapper from '@/console/common/LeftNavedPageWrapper';

export default {
  components: {
    ManagementTopBar,
    LeftNavedPageWrapper
  },

  computed: {
    ...mapState(['managementPageRefreshKey']),
    ...mapGetters([
      'isTenantAdmin',
      'hasManagedApps',
    ]),
  },

}
</script>


<style lang="scss" module>

.menuLi:hover {
  background-color: $leftBarBackgroundColor;
}

.menuLi {
  :global {
    .router-link-active {
      color: white;
      background-color: $primaryThemeColor;
    }
  }
}

.link {
  display: flex;
  align-items: center;
  color: $leftBarTextColor;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 30px;
  font-size: 15px;
  cursor: pointer;
}

.foldedLink {
  justify-content: center;
  padding-left: 0;
}

.icon {
  width: 30px;
}

.foldedIcon {
  width: auto;
}

</style>
