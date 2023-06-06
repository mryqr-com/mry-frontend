<template>
  <div :class="$style.wrapper">
    <component :is="currentPlateControlEditType"/>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import PlateConfigEditPanel from '@/console/app-edit/plate/PlateConfigEditPanel';
import PlateControlEditPanelWrapper from '@/console/app-edit/plate/PlateControlEditPanelWrapper';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    PLATE_CONFIG: PlateConfigEditPanel,
    PLATE_CONTROL: PlateControlEditPanelWrapper,
  },

  computed: {
    ...appEditStore.mapGetters([
      'currentPlateControlEditType'
    ])
  },

}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
