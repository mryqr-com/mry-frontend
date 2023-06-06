<template>
  <div :class="$style.wrapper">
    <EditTitle>图片</EditTitle>
    <MultipleFileUploader v-model="value.images"
                          :displayCount="true"
                          :dnd="true"
                          :dndAreaHeight="36"
                          :imageOnly="true"
                          :max="5"
                          :nameEditable="true"
                          :ossRequest="appEditOssRequest"
                          :sortable="true"
                          title="上传图片，最多上传5张">
    </MultipleFileUploader>

    <EditTitle>基本设置</EditTitle>

    <el-checkbox v-model="value.showImageName"
                 class="settingMarginBottom block"
                 size="mini"
                 title="是否在图片底部显示图片名称">显示图片名称
    </el-checkbox>

    <div class="keyValueSettingContainer">
      图片间距：
      <el-input-number v-model="value.verticalMargin"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="图片间的垂直间距">
      </el-input-number>
    </div>
    <div class="keyValueSettingContainer">
      图片样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="图片样式" type="plain">图片样式...</el-button>
        <div class="keyValueSettingContainer">
          占用宽度(%)：
          <el-input-number v-model="value.widthRatio"
                           :max="100"
                           :min="20"
                           :step="1"
                           :stepStrictly="true"
                           class="rightInputWidth"
                           controls-position="right"
                           size="mini"
                           title="单张图片所占用整行宽度的比例，比例小到一定层度将使得多张图片在一行中横排并列显示">
          </el-input-number>
        </div>

        <div class="keyValueSettingContainer">
          圆角半径：
          <el-input-number v-model="value.borderRadius"
                           :max="100"
                           :min="0"
                           :step="1"
                           :stepStrictly="true"
                           class="rightInputWidth"
                           controls-position="right"
                           size="mini"
                           title="单张图片的圆角半径">
          </el-input-number>
        </div>

        <div class="singleLineTitle">边框</div>
        <BorderInput v-model="value.border"
                     class="settingMarginBottom">
        </BorderInput>

        <div class="singleLineTitle">边框阴影</div>
        <ShadowInput v-model="value.shadow"
                     class="settingMarginBottom">
        </ShadowInput>
      </el-popover>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  components: {
    MultipleFileUploader: () => import(/* webpackChunkName: "multi-file-uploader" */ '@/common/components/MultipleFileUploader'),
  },

  computed: {
    ...mapGetters(['appEditOssRequest']),
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>
