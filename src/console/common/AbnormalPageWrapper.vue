<template>
  <div :class="$style.wrapper">
    <div :class="$style.headerSection">
      <Logo :class="$style.logo" :iconFile="tenantLogo" :name="tenantName" size="small" @click="goToHomePage"></Logo>
      <Profile v-if="isLoggedIn"></Profile>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Profile from '@/console/common/Profile';

export default {
  components: {
    Profile
  },

  methods: {
    goToHomePage() {
      this.$router.push({name: 'default-home'});
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'tenantLogo', 'tenantName']),
  }
}
</script>

<style lang="scss" module>
.wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: whitesmoke;
}

.headerSection {
  padding: 0 24px;
  height: 60px;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  border-bottom: $primary1pxBorder;
}

.logo {
  cursor: pointer;
}

</style>
