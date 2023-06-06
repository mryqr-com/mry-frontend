<template>
  <div v-if="files.length > 0">
    <ImageListViewer v-if="displayType === 'IMAGE_LIST'"
                     :border="presentationControl.imageAnswerStyle.border"
                     :borderRadius="presentationControl.imageAnswerStyle.borderRadius"
                     :images="imageFiles"
                     :shadow="presentationControl.imageAnswerStyle.shadow"
                     :showName="presentationControl.imageAnswerStyle.showImageName"
                     :verticalMargin="presentationControl.imageAnswerStyle.verticalMargin"
                     :widthRatio="presentationControl.imageAnswerStyle.widthRatio">
    </ImageListViewer>

    <VideoListViewer v-if="displayType === 'VIDEO_LIST'"
                     :borderRadius="presentationControl.videoAnswerStyle.borderRadius"
                     :showFileName="presentationControl.videoAnswerStyle.showFileName"
                     :videos="videoFiles">
    </VideoListViewer>

    <AudioListViewer v-if="displayType === 'AUDIO_LIST'"
                     :audios="audioFiles"
                     :borderRadius="presentationControl.audioAnswerStyle.borderRadius"
                     :showFileName="presentationControl.audioAnswerStyle.showFileName">
    </AudioListViewer>

    <FileListViewer v-if="displayType === 'FILE_LIST'"
                    :appearanceStyle="presentationControl.fileAnswerStyle.appearanceStyle"
                    :fileNameStyle="presentationControl.fileAnswerStyle.fileNameStyle"
                    :files="files"
                    @fileClicked="onFileClicked">
    </FileListViewer>
  </div>
</template>

<script>
import FileListViewer from '@/common/components/FileListViewer';
import {viewFile} from "@/common/utils/common-utils";
import {isAudio, isImage, isVideo} from '@/common/utils/mime-utils';

export default {
  props: ['refControl', 'presentationControl', 'value'],

  components: {
    FileListViewer,
    VideoListViewer: () => import(/* webpackChunkName: "video-list-player" */ '@/common/components/VideoListViewer'),
    AudioListViewer: () => import(/* webpackChunkName: "audio-list-player" */ '@/common/components/AudioListViewer'),
  },

  methods: {
    onFileClicked(file) {
      viewFile(file);
    }
  },

  computed: {
    displayType() {
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
    },

    files() {
      if (!this.value) {
        return [];
      }

      return this.value.files;
    },

    imageFiles() {
      return this.files.filter(file => {
        return isImage(file.type);
      });
    },

    videoFiles() {
      return this.files.filter(video => {
        return isVideo(video.type);
      }).map(file => {
        return {
          file: file,
          poster: null
        }
      });
    },

    audioFiles() {
      return this.files.filter(file => {
        return isAudio(file.type);
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>
