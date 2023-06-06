<template>
  <ControlWrapper v-if="control.attachments.length > 0" :control="control" :index="index">
    <FileListViewer :appearanceStyle="control.appearanceStyle"
                    :fileNameStyle="control.fileNameStyle"
                    :files="control.attachments"
                    @fileClicked="onFileClicked">
    </FileListViewer>
  </ControlWrapper>
</template>

<script>
import FileListViewer from '@/common/components/FileListViewer';
import {viewFile} from "@/common/utils/common-utils";

export default {
  props: ['control', 'index'],
  components: {FileListViewer},

  methods: {
    onFileClicked(file) {
      viewFile(file);
    }
  }
}
</script>

<style lang="scss" module>

</style>
