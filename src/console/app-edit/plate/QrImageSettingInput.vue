<template>
  <div :class="$style.wrapper">
    <div class="keyValueSettingContainer">
      二维码宽度：
      <el-input-number v-model="value.width"
                       :max="800"
                       :min="100"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="二维码宽度">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      边缘空白边距：
      <el-input-number v-model="value.margin"
                       :max="4"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="二维码边缘空白边距">
      </el-input-number>
    </div>

    <div class="singleLineTitle marginTop10">二维码Logo</div>
    <SingleFileUploader v-model="value.logo"
                        :dnd="true"
                        :dndAreaHeight="36"
                        :imageOnly="true"
                        :ossRequest="appEditOssRequest"
                        class="settingMarginBottom"
                        dndAreaText="上传Logo图片"
                        title="二维码中央Logo图片">
    </SingleFileUploader>

    <div class="keyValueSettingContainer">
      二维码颜色：
      <MryColorPicker v-model="value.color" :showAlpha="false" title="二维码颜色"></MryColorPicker>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import SingleFileUploader from '@/common/components/SingleFileUploader';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    SingleFileUploader,
  },

  computed: {
    ...appEditStore.mapGetters(['appEditOssRequest']),
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>
