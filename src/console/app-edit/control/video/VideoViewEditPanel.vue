<template>
  <div :class="$style.wrapper">
    <EditTitle>视频文件</EditTitle>
    <MultipleFileUploader v-model="value.videos"
                          :acceptTypes="videoTypes"
                          :displayCount="false"
                          :dnd="true"
                          :dndAreaHeight="36"
                          :max="1"
                          :ossRequest="appEditOssRequest"
                          :perMaxSize="100"
                          :sortable="false"
                          dndAreaText="选择或拖拽上传视频文件"
                          title="上传视频文件，最多上传一个文件">
    </MultipleFileUploader>

    <EditTitle>基本设置</EditTitle>
    <div class="singleLineTitle">预览图</div>
    <SingleFileUploader v-model="value.poster"
                        :dnd="true"
                        :dndAreaHeight="36"
                        :imageOnly="true"
                        :ossRequest="appEditOssRequest"
                        class="settingMarginBottom"
                        dndAreaText="上传视频预览图"
                        title="设置视频预览图">
    </SingleFileUploader>

    <div class="keyValueSettingContainer" title="圆角半径">
      圆角半径：
      <el-input-number v-model="value.borderRadius"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini">
      </el-input-number>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {accept} from '@/common/utils/mime-utils'
import SingleFileUploader from '@/common/components/SingleFileUploader';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    SingleFileUploader,
    MultipleFileUploader: () => import(/* webpackChunkName: "multi-file-uploader" */ '@/common/components/MultipleFileUploader'),
  },

  computed: {
    ...mapGetters(['appEditOssRequest']),

    videoTypes() {
      return accept.VIDEO;
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>
