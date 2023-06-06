<template>
  <div v-if="isCurrentPageFillable" :class="[$style.wrapper, {[$style.wrapperWide]: tabletView}]">
    <StyledButton :buttonStyle="submitButton.buttonStyle"
                  :class="[{[$style.theButtonWide]: tabletView}]">
      {{ submitButton.text }}
    </StyledButton>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';

const {mapState, mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    submitButton: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'isCurrentPageFillable',
    ]),

    ...mapState([
      'tabletView'
    ]),

  }
}
</script>

<style lang="scss" module>
.wrapper {
  cursor: pointer;
  padding: 36px $narrowPageVPadding 50px;
}

.wrapperWide {
  padding-right: $widePageVPadding;
  padding-left: $widePageVPadding;
  text-align: center;
}

.theButtonWide {
  width: $maxControlButtonWidth;
}

</style>
