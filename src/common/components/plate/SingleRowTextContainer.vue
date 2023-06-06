<template>
  <div :class="$style.wrapper">
    <PlateSingleRowText :control="control" :text="displayText"></PlateSingleRowText>
  </div>
</template>

<script>
import PlateSingleRowText from '@/common/components/plate/PlateSingleRowText';
import {plateDisplayTextFor} from "@/common/utils/common-utils";

export default {
  props: ['control', 'qr'],

  components: {
    PlateSingleRowText,
  },

  computed: {
    displayText() {
      return plateDisplayTextFor(this.control.textValue, this.qr);
    }
  },

}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
