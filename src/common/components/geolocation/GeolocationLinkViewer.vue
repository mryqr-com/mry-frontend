<template>
  <span v-if="geolocation"
        :class="$style.wrapper"
        class="underLinedLink"
        @click="gotoPosition">
    {{ displayValue }}
  </span>
</template>

<script>
import {displayAddress} from "@/common/utils/common-utils";
import {viewGeoLocation} from "@/common/utils/geolocation-utils";

export default {
  props: ['geolocation'],

  computed: {
    displayValue() {
      if (!this.geolocation) {
        return null;
      }
      return displayAddress(this.geolocation.address);
    },
  },

  methods: {
    gotoPosition(event) {
      event.stopPropagation();

      viewGeoLocation({
        name: this.displayValue,
        geolocation: this.geolocation
      });
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
