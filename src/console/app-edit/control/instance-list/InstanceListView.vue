<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <InstanceListViewer :instances="instances"
                        :rowGutter="control.rowGutter"
                        :showCreatedAt="control.showCreatedAt"
                        :showCreator="control.showCreator"
                        :showSeparator="control.showSeparator">
    </InstanceListViewer>
  </div>
</template>

<script>
import InstanceListViewer from '@/common/components/InstanceListViewer';
import {createNamespacedHelpers} from 'vuex';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    InstanceListViewer,
  },

  computed: {
    ...mapGetters([
      'instanceDesignation'
    ]),

    instances() {
      let now = Date.now();
      return [
        {
          plateId: '1234',
          name: this.instanceDesignation + '1',
          creator: '张三',
          createdAt: now
        },
        {
          plateId: '2345',
          name: this.instanceDesignation + '2',
          creator: '李四',
          createdAt: now - 30 * 25 * 3600 * 1000,
        },
        {
          plateId: '3456',
          name: this.instanceDesignation + '3',
          creator: '王五',
          createdAt: now - 60 * 27 * 3600 * 1000
        },
      ].slice(0, this.control.max);
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  pointer-events: none;
}

.wrapperWide {

}
</style>
