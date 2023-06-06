<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <IconPageLinkViewer :control="control" :links="control.links" :showWarning="true"></IconPageLinkViewer>

    <div v-if="!control.links || control.links.length === 0" :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请添加链接项</i>
    </div>
  </div>
</template>

<script>
import IconPageLinkViewer from '@/common/components/IconPageLinkViewer';

export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    IconPageLinkViewer,
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.placeholderText {
  color: $warningYellow;
}
</style>
