<template>
  <div :class="$style.wrapper">
    <PlateKeyValue :contentTexts="contentTexts" :control="control" :qrContent="qrContent"></PlateKeyValue>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import PlateKeyValue from '@/common/components/plate/PlateKeyValue';
import {plateFakeQrUrl} from "@/common/utils/common-utils";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control'],

  components: {
    PlateKeyValue,
  },

  computed: {
    ...appEditStore.mapGetters([
      'placeholderForPlateTextValue',
    ]),

    contentTexts() {
      return this.control.textValues.map(namedValue => {
        return {id: namedValue.id, text: this.placeholderForPlateTextValue(namedValue.value)}
      });
    },

    qrContent() {
      return plateFakeQrUrl();
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
