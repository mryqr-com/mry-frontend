<template>
  <div :class="$style.wrapper">
    <router-view :key="wholeClientRefreshKey"></router-view>
    <ErrorPage></ErrorPage>
  </div>
</template>

<script>
import ErrorPage from '@/common/components/ErrorPage';
import {mapState} from 'vuex';

export default {
  components: {
    ErrorPage
  },

  computed: {
    ...mapState(['wholeClientRefreshKey']),
  }
}

</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  min-width: 350px;
}

</style>
