<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <PointChecker v-for="(item,index) in control.options"
                  :key="item.id"
                  v-model="fake"
                  :class="$style.checker">
      {{ index + 1 }}.&nbsp;{{ item.name }}
    </PointChecker>
  </div>
</template>

<script>
import PointChecker from '@/common/components/PointChecker';

export default {
  props: ['control', 'tabletView', "controlIndex"],
  data() {
    return {
      fake: 'NONE'
    };
  },

  components: {
    PointChecker
  },
}
</script>

<style lang="scss" module>
.wrapper {
  pointer-events: none;
  border: $primary1pxBorder;
}

.wrapperWide {
  max-width: $maxControlContentWidth;
}

.checker {
  border-bottom: $primary1pxBorder;
}

.checker:last-child {
  border-bottom: none;
}

</style>
