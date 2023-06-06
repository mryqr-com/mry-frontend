<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <el-input :class="[$style.theInput,{[$style.theInputWide]: tabletView}]"
              :placeholder="control.placeholder"
              :spellcheck="false"
              :value="value"
              prefix-icon="el-icon-date"
              readonly>
    </el-input>
  </div>
</template>

<script>
import {formatDateToDate} from "@/common/utils/common-utils";

export default {
  props: ['control', 'tabletView', "controlIndex"],

  computed: {
    value() {
      return this.control.defaultToToday ? formatDateToDate(new Date()) : null;
    }
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

.theInput {
  pointer-events: none;

  :global {
    .el-input__inner {
      cursor: pointer;
    }
  }
}

.theInputWide {
  max-width: $maxControlInputWidth;
}

</style>
