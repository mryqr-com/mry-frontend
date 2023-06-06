<template>
  <div :class="$style.wrapper">
    <button :class="$style.navButton"
            class="marginBottom6"
            title="页面设置"
            @click.stop="activatePageConfig">
      <icon icon="tools"/>
    </button>

    <button :class="[{[$style.active]:!tabletView},$style.navButton]"
            class="marginBottom6"
            title="手机屏幕"
            @click.stop="toggleTablet(false)">
      <icon icon="mobile-alt"/>
    </button>

    <button :class="[{[$style.active]:tabletView},$style.navButton]"
            title="平板/电脑屏幕"
            @click.stop="toggleTablet(true)">
      <icon icon="desktop"/>
    </button>

  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';

const {mapState, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  data() {
    return {
      current: 'mobile'
    }
  },
  computed: {
    ...mapState([
      'tabletView'
    ])
  },
  methods: {
    ...mapActions([
      ACTIONS.TOGGLE_TABLET_VIEW,
      ACTIONS.ACTIVATE_PAGE_CONFIG
    ]),

    toggleTablet(isTabletView) {
      this[ACTIONS.TOGGLE_TABLET_VIEW](isTabletView);
    },

    activatePageConfig() {
      this[ACTIONS.ACTIVATE_PAGE_CONFIG]();
    },

  }
}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
}

.navButton {
  outline: none;
  text-decoration: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #b1b1b1;
  background-color: transparent;
  border: none;
}

.active {
  color: dimgray;
}

.navButton:hover {
  color: dimgray;
}

</style>
