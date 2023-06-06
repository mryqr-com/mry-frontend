<template>
  <Separator :backgroundColor="control.backgroundColor"
             :borderWidth="control.borderWidth"
             :class="$style.wrapper"
             :fontStyle="control.fontStyle"
             :separatorType="control.separatorType"
             :text="control.text"
             :widthRatio="control.widthRatio">
  </Separator>
</template>

<script>
import Separator from '@/common/components/Separator';

export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    Separator,
  },

}
</script>

<style lang="scss" module>
.wrapper {
  margin: auto;
}
</style>
