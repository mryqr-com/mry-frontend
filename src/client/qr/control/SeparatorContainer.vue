<template>
  <ControlWrapper :control="control" :index="index">
    <Separator :backgroundColor="control.backgroundColor"
               :borderWidth="control.borderWidth"
               :class="$style.separator"
               :fontStyle="control.fontStyle"
               :separatorType="control.separatorType"
               :text="control.text"
               :widthRatio="control.widthRatio">
    </Separator>
  </ControlWrapper>

</template>

<script>
import Separator from '@/common/components/Separator';

export default {
  props: ['control', 'index'],

  components: {
    Separator,
  },

}
</script>

<style lang="scss" module>
.separator {
  margin: auto;
}
</style>
