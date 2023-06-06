<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <div v-if="isComplete" :title="theTitle">
      <BoxedTextViewer v-if="displayType === 'TEXT'"
                       :textStyle="control.textAnswerStyle.textStyle">
        此处将显示实际填值
      </BoxedTextViewer>

      <ImageListViewer v-if="displayType === 'IMAGE_LIST'"
                       :border="control.imageAnswerStyle.border"
                       :borderRadius="control.imageAnswerStyle.borderRadius"
                       :images="placeholderImages"
                       :shadow="control.imageAnswerStyle.shadow"
                       :showName="control.imageAnswerStyle.showImageName"
                       :verticalMargin="control.imageAnswerStyle.verticalMargin"
                       :widthRatio="control.imageAnswerStyle.widthRatio">
      </ImageListViewer>

      <MarkdownViewer v-if="displayType === 'MARKDOWN'"
                      :class="$style.placeholderMarkdown"
                      :markdownStyle="control.markdownAnswerStyle.markdownStyle"
                      :value="`此处将显示实际填值。引用页面：${refPageName}；引用控件：${refControlName}`">
      </MarkdownViewer>

      <RichTextViewer v-if="displayType === 'RICH_TEXT'"
                      :class="$style.placeholderRichText"
                      :content="`此处将显示实际填值。引用页面：${refPageName}；引用控件：${refControlName}`">
      </RichTextViewer>

      <VideoListViewer v-if="displayType === 'VIDEO_LIST'"
                       :borderRadius="control.videoAnswerStyle.borderRadius"
                       :disableClickToPlay="true"
                       :showFileName="control.videoAnswerStyle.showFileName"
                       :transcode="false"
                       :videos="placeholderVideos">
      </VideoListViewer>

      <AudioListViewer v-if="displayType === 'AUDIO_LIST'"
                       :audios="placeholderAudios"
                       :borderRadius="control.audioAnswerStyle.borderRadius"
                       :class="$style.audioViewer"
                       :showFileName="control.audioAnswerStyle.showFileName">
      </AudioListViewer>

      <FileListViewer v-if="displayType === 'FILE_LIST'"
                      :appearanceStyle="control.fileAnswerStyle.appearanceStyle"
                      :fileNameStyle="control.fileAnswerStyle.fileNameStyle"
                      :files="placeholderFiles">
      </FileListViewer>

      <div v-if="displayType === 'SIGNATURE'" :class="$style.signaturePlaceholder">
        <icon :class="$style.signatureIcon" icon="file-signature"></icon>
        此处将显示签名
      </div>
    </div>

    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请设置引用控件</i>
    </div>
  </div>
</template>

<script>
import placeholderPicture from "@/common/static/picture.svg";

import {createNamespacedHelpers} from 'vuex';
import uuid from "short-uuid";
import FileListViewer from '@/common/components/FileListViewer';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],
  components: {
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
    RichTextViewer: () => import(/* webpackChunkName: "rich-text-viewer" */ '@/common/components/RichTextViewer'),
    VideoListViewer: () => import(/* webpackChunkName: "video-list-player" */ '@/common/components/VideoListViewer'),
    AudioListViewer: () => import(/* webpackChunkName: "audio-list-player" */ '@/common/components/AudioListViewer'),
    FileListViewer,
  },

  computed: {
    ...mapGetters([
      'pageNameOf',
      'controlOf',
      'controlTypeOf',
      'instanceDesignation'
    ]),

    refControl() {
      return this.controlOf(this.control.controlId);
    },

    refControlType() {
      return this.controlTypeOf(this.control.controlId);
    },

    refControlName() {
      return this.refControl.name;
    },

    refPageName() {
      return this.pageNameOf(this.control.pageId);
    },

    theTitle() {
      if (this.refControl) {
        return `引用页面：${this.refPageName}\n引用控件：${this.refControlName}`;
      }
    },

    isComplete() {
      return this.control.pageId && this.control.controlId;
    },

    displayType() {
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

    placeholderImages() {
      return [
        {
          id: uuid.generate(),
          name: '示例图片',
          type: 'image/svg+xml',
          fileUrl: placeholderPicture,
          ossKey: uuid.generate(),
          size: 234564,
        },
      ]
    },

    placeholderVideos() {
      return [{
        file: {
          id: uuid.generate(),
          name: '示例视频',
          type: 'video/mp4',
          fileUrl: 'https://mry-static.oss-cn-hangzhou.aliyuncs.com/sample-video-3-seconds.mp4',
          ossKey: uuid.generate(),
          size: 234564,
        },
        poster: {
          id: uuid.generate(),
          name: '示例视频预览图',
          type: 'image/jpeg',
          fileUrl: 'https://mry-static.oss-cn-hangzhou.aliyuncs.com/sample-video-poster.jpeg',
          ossKey: uuid.generate(),
          size: 234564,
        }
      }]
    },

    placeholderAudios() {
      return [
        {
          id: uuid.generate(),
          name: '示例音频.mp3',
          type: 'audio/mpeg',
          fileUrl: 'http://www.thisisfake.com/example.mp3',
          ossKey: uuid.generate(),
          size: 234564,
        }
      ];
    },

    placeholderFiles() {
      return [
        {
          id: uuid.generate(),
          name: '示例文件1.pdf',
          type: 'application/pdf',
          fileUrl: 'http://thisisfake.com/file.pdf',
          ossKey: uuid.generate(),
          size: 234564,
        },
        {
          id: uuid.generate(),
          name: '示例文件2.mp4',
          type: 'video/mp4',
          fileUrl: 'http://thisisfake.com/file.mp4',
          ossKey: uuid.generate(),
          size: 234564,
        }
      ];
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.wrapperWide {
}

.placeholderMarkdown {
  border: 2px dashed $primaryBorderColor;
  padding: 15px;
}

.placeholderRichText {
  border: 2px dashed $primaryBorderColor;
  padding: 15px;
}

.audioViewer {
  pointer-events: none;
}

.signaturePlaceholder {
  border: 2px dashed $primaryBorderColor;
  padding: 36px 10px;
  color: $secondaryTextColor;
  background-color: white;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.signatureIcon {
  font-size: 24px;
  margin-bottom: 15px;
  color: $primaryTextColor;
}

.placeholderText {
  color: $warningYellow;
}
</style>
