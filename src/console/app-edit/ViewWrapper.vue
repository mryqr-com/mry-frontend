<template>
  <div :class="[activeClass, $style.wrapper]" @click.stop="activateMe">
    <slot></slot>
  </div>
</template>

<script>
import ACTIONS from '@/console/app-edit/store/app-edit-actions';
import {createNamespacedHelpers} from 'vuex';

const {mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    controlType: {
      type: String,
      required: true
    },

    controlId: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'currentControlId',
    ]),

    activeClass() {
      return this.controlId === this.currentControlId ? this.$style.active : null;
    }
  },
  methods: {
    ...mapActions([
      ACTIONS.SET_CURRENT_CONTROL,
    ]),

    activateMe() {
      this[ACTIONS.SET_CURRENT_CONTROL]({
        currentEditType: this.controlType,
        currentControlId: this.controlId
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  background-color: transparent;
}

.wrapper:hover {
  border-top: 1px dashed $primaryThemeColor;
  border-bottom: 1px dashed $primaryThemeColor;
  background-color: rgba(235, 238, 245, 0.4);
}

.active {
  position: relative;
  z-index: 100;
  background-color: rgba(235, 238, 245, 0.4);
  border-top: 2px dashed $primaryThemeColor !important;
  border-bottom: 2px dashed $primaryThemeColor !important;
}

</style>
