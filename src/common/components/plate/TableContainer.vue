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
import PlateTable from '@/common/components/plate/PlateTable';
import {plateDisplayTextFor} from "@/common/utils/common-utils";

export default {
  props: ['control', 'qr'],

  components: {
    PlateTable,
  },

  computed: {
    headerText() {
      return plateDisplayTextFor(this.control.headerTextValue, this.qr);
    },

    contentTexts() {
      return this.control.contentTextValues.map(namedValue => {
        return {id: namedValue.id, text: plateDisplayTextFor(namedValue.value, this.qr)}
      });
    },

    qrContent() {
      return this.qr.url;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
