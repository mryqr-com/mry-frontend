<template>
  <router-view :key="wholeConsoleRefreshKey"></router-view>
</template>

<script>
import {mapState} from "vuex";

export default {

  computed: {
    ...mapState(['wholeConsoleRefreshKey'])
  }
}
</script>

<style module lang="scss">

</style>
