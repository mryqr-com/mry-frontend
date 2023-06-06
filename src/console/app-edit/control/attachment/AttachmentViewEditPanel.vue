<template>
  <div :class="$style.wrapper">
    <EditTitle>附件</EditTitle>
    <MultipleFileUploader v-model="value.attachments"
                          :acceptTypes="acceptTypes"
                          :dnd="true"
                          :dndAreaHeight="36"
                          :max="5"
                          :nameEditable="true"
                          :ossRequest="appEditOssRequest"
                          :perMaxSize="100"
                          :sortable="true"
                          title="上传附件文件，最多可以上传5个文件">
    </MultipleFileUploader>

    <EditTitle>基本设置</EditTitle>
    <div class="keyValueSettingContainer">
      文件名样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="文件名样式" type="plain">文件名样式...
        </el-button>
        <BoxedTextStyleInput v-model="value.fileNameStyle"></BoxedTextStyleInput>
      </el-popover>
    </div>

    <div class="keyValueSettingContainer">
      外观样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="外观样式" type="plain">外观样式...
        </el-button>
        <AppearanceStyleInput v-model="value.appearanceStyle"></AppearanceStyleInput>
      </el-popover>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import {accept} from "@/common/utils/mime-utils";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    MultipleFileUploader: () => import(/* webpackChunkName: "multi-file-uploader" */ '@/common/components/MultipleFileUploader'),
  },

  computed: {
    ...mapGetters(['isVideoAudioAllowed']),
    ...appEditStore.mapGetters(['appEditOssRequest']),

    acceptTypes() {
      return this.isVideoAudioAllowed ?
          [...accept.VIDEO, ...accept.AUDIO, ...accept.IMAGE, ...accept.DOCUMENT] :
          [...accept.IMAGE, ...accept.DOCUMENT]
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
