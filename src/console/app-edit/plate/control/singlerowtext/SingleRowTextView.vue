<template>
  <div :class="$style.wrapper">
    <PlateSingleRowText :control="control" :text="displayText"></PlateSingleRowText>
  </div>
</template>

<script>
import PlateSingleRowText from '@/common/components/plate/PlateSingleRowText';
import {createNamespacedHelpers} from "vuex";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control'],

  components: {
    PlateSingleRowText,
  },

  computed: {
    ...appEditStore.mapGetters([
      'placeholderForPlateTextValue',
    ]),

    displayText() {
      return this.placeholderForPlateTextValue(this.control.textValue);
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
