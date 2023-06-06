<template>
  <div :class="$style.wrapper">
    <PlateTable :contentTexts="contentTexts"
                :control="control"
                :headerText="headerText"
                :qrContent="qrContent">
    </PlateTable>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import PlateTable from '@/common/components/plate/PlateTable';
import {plateFakeQrUrl} from "@/common/utils/common-utils";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control'],

  components: {
    PlateTable,
  },

  computed: {
    ...appEditStore.mapGetters([
      'placeholderForPlateTextValue',
    ]),

    headerText() {
      return this.placeholderForPlateTextValue(this.control.headerTextValue);
    },

    contentTexts() {
      return this.control.contentTextValues.map(namedValue => {
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
