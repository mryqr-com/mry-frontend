<template>
  <div :class="$style.wrapper" @dragover.prevent @drop.prevent>
    <input ref="fileInput"
           :accept="accept"
           :class="$style.fileInput"
           :multiple="false"
           type="file"
           @change="uploadFile"
           @click="$refs.fileInput.value=null"/>

    <div :class="[$style.dragSection,{[$style.dragHover]:isDragHover}]"
         @dragend="onDragEnd"
         @dragenter="onDragEnter"
         @dragleave="onDragLeave"
         @dragover="onDragOver"
         @drop="onDrop">
      <div :class="$style.dragContent">
        <i :class="$style.uploadIcon" class="el-icon-upload"></i>
        <span>拖动文件到此区域，或者点击下方按钮</span>
        <el-button :class="$style.uploadButton"
                   size="small"
                   @click="triggerUpload">
          选择文件...
        </el-button>
        <div v-if="value" :class="$style.fileNameContainer">
          所选择文件：<span :class="$style.fileName">{{ fileName }}</span>
        </div>
        <div v-if="showFormatError" :class="$style.errorMessage">无法上传，文件格式不正确！</div>
        <div v-if="showMaxError" :class="$style.errorMessage">无法上传，文件大小不能超过{{ maxSize }}M！</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: File,
    },

    acceptTypes: {
      type: Array,
      default: ['*']
    },

    maxSize: {
      type: Number,
      default: 10,//in MB
    },
  },

  data() {
    return {
      showFormatError: false,
      showMaxError: false,
      isDragHover: false,
    }
  },

  computed: {
    fileName() {
      return this.value ? this.value.name : null;
    },

    accept() {
      return this.acceptTypes.join(',');
    },
  },

  methods: {
    uploadFile(e) {
      this.emitInput(e.target.files[0]);
    },

    onDragEnter() {
      this.isDragHover = true;
    },

    onDragEnd() {
      this.isDragHover = false;
    },

    onDragLeave() {
      this.isDragHover = false;
    },

    onDragOver() {
      this.isDragHover = true;
    },

    onDrop(e) {
      this.isDragHover = false;
      this.emitInput(e.dataTransfer.files[0]);
    },

    emitInput(file) {
      this.showMaxError = false;
      this.showFormatError = false;

      if (!file) {
        this.$emit("input", null);
        return;
      }

      if (!this.acceptTypes.includes(file.type)) {
        this.showFormatError = true;
        this.$emit("input", null);
        return;
      }

      if (file.size > this.maxSize * 1024 * 1024) {
        this.showMaxError = true;
        this.$emit("input", null);
        return;
      }

      this.$emit("input", file);
    },

    triggerUpload() {
      this.$refs.fileInput.click();
    }
  },

}
</script>

<style lang="scss" module>
.wrapper {

}

.fileInput {
  display: none;
}

.dragSection {
  border: 2px dashed $primaryBorderColor;
  width: 100%;
  aspect-ratio: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dragHover {
  background-color: #eaf8ff;
  cursor: pointer;
}

.dragContent {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.uploadIcon {
  font-size: 24px;
  margin-bottom: 10px;
}

.uploadButton {
  width: $pageButtonWidth;
  margin-top: 10px;
  margin-bottom: 15px;
}

.fileNameContainer {
  padding-left: 10px;
  padding-right: 10px;
  font-size: 13px;
  line-height: 1.3em;
}

.fileName {
  font-weight: 500;
  color: $primaryTextColor;
}

.errorMessage {
  color: $rejectRed;
  font-size: 13px;
}
</style>
