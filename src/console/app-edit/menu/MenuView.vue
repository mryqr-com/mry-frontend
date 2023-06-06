<template>
  <div :class="$style.wrapper">
    <MenuViewer v-if="menu.links.length > 0" :links="menu.links"></MenuViewer>
    <div v-else :class="$style.thePlaceholder">
      + 点击编辑菜单
    </div>
  </div>
</template>

<script>
import MenuViewer from '@/common/components/MenuViewer';
import {createNamespacedHelpers} from 'vuex';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    MenuViewer
  },

  computed: {
    ...mapGetters([
      'menu'
    ]),
  }
}
</script>

<style lang="scss" module>
.wrapper {
  cursor: pointer;
}

.thePlaceholder {
  background-color: #ececec;
  border-top: $primary1pxBorder;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
