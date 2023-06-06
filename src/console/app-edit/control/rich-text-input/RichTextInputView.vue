<template>
  <div :class="$style.wrapper">
    <RichTextInput v-model="value"
                   :ossRequest="ossRequest"
                   :placeholder="control.placeholder">
    </RichTextInput>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    RichTextInput: () => import(/* webpackChunkName: "rich-text-input" */ '@/common/components/RichTextInput'),
  },

  data() {
    return {
      value: null,
      ossRequest: {},
    };
  },

}
</script>

<style lang="scss" module>
.wrapper {
  pointer-events: none;
}

</style>
