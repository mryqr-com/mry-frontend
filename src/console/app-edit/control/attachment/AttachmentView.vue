<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <FileListViewer v-if="control.attachments.length > 0"
                    :appearanceStyle="control.appearanceStyle"
                    :fileNameStyle="control.fileNameStyle"
                    :files="control.attachments">
    </FileListViewer>

    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请添加附件</i>
    </div>
  </div>
</template>

<script>
import FileListViewer from '@/common/components/FileListViewer';

export default {
  props: ['control', 'tabletView', "controlIndex"],
  components: {FileListViewer},
}
</script>

<style lang="scss" module>
.wrapper {
}

.wrapperWide {
}

.placeholderText {
  color: $warningYellow;
}

</style>
