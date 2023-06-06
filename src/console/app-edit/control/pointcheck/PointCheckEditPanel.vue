<template>
  <div :class="$style.wrapper">
    <OptionSelector v-model="value.options"></OptionSelector>
  </div>
</template>

<script>
import OptionSelector from '@/console/app-edit/components/OptionSelector';

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    OptionSelector,
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>
