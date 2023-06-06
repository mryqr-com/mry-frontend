<template>
  <div :class="$style.wrapper">
    <EditTitle>引用控件</EditTitle>
    <div class="singleLineTitle">页面</div>
    <el-select v-model="value.pageId"
               :class="$style.selectInput"
               class="marginBottom10"
               placeholder="请选择控件所在的页面"
               size="mini"
               title="设置需要引用控件所在的页面"
               @change="clearControlSelection">
      <el-option
          v-for="page in allFillablePageSummaries"
          :key="page.id"
          :label="page.name"
          :value="page.id">
      </el-option>
    </el-select>

    <div class="singleLineTitle">控件</div>
    <el-select v-model="value.controlId"
               :class="$style.selectInput"
               placeholder="请选择需要引用的控件"
               size="mini"
               title="设置需要引用的控件">
      <el-option
          v-for="control in allFillableControls(value.pageId)"
          :key="control.id"
          :label="controlFieldName(control)"
          :value="control.id">
      </el-option>
    </el-select>

    <EditTitle>基本设置</EditTitle>
    <template v-if="complete">
      <template v-if="styleType === 'TEXT'">
        <div class="keyValueSettingContainer">
          文本样式：
          <el-popover placement="bottom"
                      trigger="click"
                      width="300">
            <el-button slot="reference" class="rightInputWidth" size="mini" title="文本样式" type="plain">文本样式...
            </el-button>
            <BoxedTextStyleInput v-model="value.textAnswerStyle.textStyle"></BoxedTextStyleInput>
          </el-popover>
        </div>
      </template>

      <template v-if="styleType === 'IMAGE_LIST'">
        <div class="keyValueSettingContainer">
          图片样式：
          <el-popover placement="bottom"
                      trigger="click"
                      width="300">
            <el-button slot="reference" class="rightInputWidth" size="mini" title="图片样式" type="plain">图片样式...
            </el-button>
            <el-checkbox v-model="value.imageAnswerStyle.showImageName" class="settingMarginBottom block"
                         size="mini" title="是否在图片底部显示图片名称">
              显示图片名称
            </el-checkbox>

            <div class="keyValueSettingContainer">
              垂直间距：
              <el-input-number v-model="value.imageAnswerStyle.verticalMargin"
                               :max="100"
                               :min="0"
                               :step="1"
                               :stepStrictly="true"
                               class="rightInputWidth"
                               controls-position="right"
                               size="mini"
                               title="图片间的垂直距离">
              </el-input-number>
            </div>

            <div class="keyValueSettingContainer">
              占用宽度(%)：
              <el-input-number v-model="value.imageAnswerStyle.widthRatio"
                               :max="100"
                               :min="20"
                               :step="1"
                               :stepStrictly="true"
                               class="rightInputWidth"
                               controls-position="right"
                               size="mini"
                               title="图片宽度所占用整行宽度的比例">
              </el-input-number>
            </div>

            <div class="keyValueSettingContainer">
              圆角半径：
              <el-input-number v-model="value.imageAnswerStyle.borderRadius"
                               :max="100"
                               :min="0"
                               :step="1"
                               :stepStrictly="true"
                               class="rightInputWidth"
                               controls-position="right"
                               size="mini"
                               title="图片圆角半径">
              </el-input-number>
            </div>

            <div class="singleLineTitle">图片边框</div>
            <BorderInput v-model="value.imageAnswerStyle.border"
                         class="settingMarginBottom">
            </BorderInput>

            <div class="singleLineTitle">边框阴影</div>
            <ShadowInput v-model="value.imageAnswerStyle.shadow"
                         class="settingMarginBottom">
            </ShadowInput>
          </el-popover>
        </div>
      </template>

      <template v-if="styleType === 'MARKDOWN'">
        <div class="keyValueSettingContainer">
          文段样式：
          <el-popover placement="bottom"
                      trigger="click"
                      width="300">
            <el-button slot="reference" class="rightInputWidth" size="mini" title="文段样式" type="plain">文段样式...
            </el-button>
            <MarkdownStyleInput v-model="value.markdownAnswerStyle.markdownStyle"></MarkdownStyleInput>
          </el-popover>
        </div>
      </template>

      <template v-if="styleType === 'FILE_LIST'">
        <div class="keyValueSettingContainer">
          文件名样式：
          <el-popover placement="bottom"
                      trigger="click"
                      width="300">
            <el-button slot="reference" class="rightInputWidth" size="mini" title="文件名样式" type="plain">文件名样式...
            </el-button>
            <BoxedTextStyleInput v-model="value.fileAnswerStyle.fileNameStyle"></BoxedTextStyleInput>
          </el-popover>
        </div>

        <div class="keyValueSettingContainer">
          外观样式：
          <el-popover placement="bottom"
                      trigger="click"
                      width="300">
            <el-button slot="reference" class="rightInputWidth" size="mini" title="外观样式" type="plain">外观样式...
            </el-button>
            <AppearanceStyleInput v-model="value.fileAnswerStyle.appearanceStyle"></AppearanceStyleInput>
          </el-popover>
        </div>
      </template>

      <template v-if="styleType === 'VIDEO_LIST'">
        <div class="keyValueSettingContainer">
          视频样式：
          <el-popover placement="bottom"
                      trigger="click"
                      width="300">
            <el-button slot="reference" class="rightInputWidth" size="mini" title="视频样式" type="plain">视频样式...
            </el-button>
            <el-checkbox v-model="value.videoAnswerStyle.showFileName" class="settingMarginBottom block" size="mini"
                         title="显示文件名">
              显示文件名
            </el-checkbox>

            <div class="keyValueSettingContainer" title="圆角半径">
              圆角半径：
              <el-input-number v-model="value.videoAnswerStyle.borderRadius"
                               :max="100"
                               :min="0"
                               :step="1"
                               :stepStrictly="true"
                               controls-position="right"
                               size="mini">
              </el-input-number>
            </div>
          </el-popover>
        </div>
      </template>

      <template v-if="styleType === 'AUDIO_LIST'">
        <div class="keyValueSettingContainer">
          音频样式：
          <el-popover placement="bottom"
                      trigger="click"
                      width="300">
            <el-button slot="reference" class="rightInputWidth" size="mini" title="音频样式" type="plain">音频样式...
            </el-button>
            <el-checkbox v-model="value.audioAnswerStyle.showFileName" class="settingMarginBottom block" size="mini"
                         title="显示文件名">
              显示文件名
            </el-checkbox>

            <div class="keyValueSettingContainer" title="圆角半径">
              圆角半径：
              <el-input-number v-model="value.audioAnswerStyle.borderRadius"
                               :max="100"
                               :min="0"
                               :step="1"
                               :stepStrictly="true"
                               controls-position="right"
                               size="mini">
              </el-input-number>
            </div>
          </el-popover>
        </div>
      </template>
    </template>

    <el-checkbox v-model="value.hideControlIfNoData" class="settingMarginBottom block" size="mini" title="无数据时隐藏控件">
      无数据时隐藏控件
    </el-checkbox>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {controlFieldName} from "@/common/utils/common-utils";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  computed: {
    ...mapGetters([
      'controlTypeOf',
      'controlOf',
      'allFillableControls',
      'allFillablePageSummaries',
    ]),

    refControlType() {
      if (this.value.controlId) {
        return this.controlTypeOf(this.value.controlId);
      }
    },

    refControl() {
      if (this.value.controlId) {
        return this.controlOf(this.value.controlId);
      }
    },

    complete() {
      return this.value.pageId && this.value.controlId;
    },

    styleType() {
      if (this.refControlType === 'IMAGE_UPLOAD') {
        return 'IMAGE_LIST';
      }

      if (this.refControlType === 'MULTI_LINE_TEXT') {
        return 'MARKDOWN';
      }

      if (this.refControlType === 'RICH_TEXT_INPUT') {
        return 'RICH_TEXT';
      }

      if (this.refControlType === 'SIGNATURE') {
        return 'SIGNATURE';
      }

      if (this.refControlType === 'FILE_UPLOAD') {
        if (this.refControl.category === 'IMAGE') {
          return 'IMAGE_LIST';
        }

        if (this.refControl.category === 'VIDEO') {
          return 'VIDEO_LIST';
        }

        if (this.refControl.category === 'AUDIO') {
          return 'AUDIO_LIST';
        }

        return 'FILE_LIST';
      }

      return 'TEXT';
    },
  },

  methods: {
    controlFieldName,
    clearControlSelection() {
      this.value.controlId = null;
    },
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

.selectInput {
  width: 100%;
}

.rowSettingContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.widthInput {
  flex-grow: 1;
  margin-right: 5px;
}

</style>
