<template>
  <div :class="$style.wrapper" @dragover.prevent @drop.prevent>
    <input ref="fileInput"
           :accept="accept"
           :capture="capture"
           :class="$style.fileInput"
           :multiple="this.max > 1"
           type="file"
           @change="onSelectFile"
           @click="$refs.fileInput.value=null"/>

    <div v-if="viewOnly && localFiles.length ===0">无数据</div>

    <draggable v-if="localFiles.length > 0"
               v-model="localFiles"
               :class="$style.theDragWrapper"
               :disabled="!sortable || viewOnly"
               :handle="'.' + $style.dragHandle"
               animation="200"
               tag="div">
      <div v-for="(aFile) in localFiles" :key="aFile.id" :class="$style.itemWrapper">
        <div :class="$style.itemRow">
          <ThreeBarIcon v-if="shouldShowHandle"
                        :class="$style.dragHandle"
                        title="上下拖动移位">
          </ThreeBarIcon>

          <div :class="[$style.iconWrapper,{[$style.viewable]:fileViewable(aFile)}]"
               :style="iconStyle(aFile)"
               @click="previewFile($event,aFile)">
          </div>

          <el-input v-if="fileNameEditable"
                    v-model="aFile.name"
                    :class="$style.nameInput"
                    :clearable="true"
                    :maxlength="200"
                    :spellcheck="false"
                    size="mini">
          </el-input>

          <div v-else
               :class="[$style.fileName, {[$style.viewable]:fileViewable(aFile)}]"
               @click="previewFile($event,aFile)">
            {{ aFile.name }}
          </div>

          <i v-if="!viewOnly"
             :class="$style.deleteButton"
             class="el-icon-delete"
             title="删除"
             @click="deleteFile(aFile)">
          </i>
        </div>
      </div>
    </draggable>

    <StyledButton v-if="shouldShowButton"
                  :buttonStyle="buttonStyle"
                  :class="[{[$style.marginTop8]:hasFiles}]"
                  :disabled="shouldDisableUpload"
                  @click="triggerUpload">
      <i :class="$style.icon" class="el-icon-plus"></i>&nbsp;{{ buttonName }}&nbsp;
      <i v-show="loading" :class="$style.icon" class="el-icon-loading"></i>
    </StyledButton>

    <div v-if="shouldShowDndArea"
         :class="[$style.dragSection,
         {[$style.dragHover]:isDragHover},
         {[$style.marginTop8]:hasFiles},
         {[$style.dndDisabled]:shouldDisableUpload}]"
         :style="dragSectionStyle"
         @click="triggerUpload"
         @dragend="isDragHover=false"
         @dragenter="isDragHover = true"
         @dragleave="isDragHover = false"
         @dragover="isDragHover = true"
         @drop="onDrop">
      <i :class="$style.icon" class="el-icon-plus"></i>&nbsp;{{ dndAreaName }}&nbsp;
      <i v-show="loading" :class="$style.icon" class="el-icon-loading"></i>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import uuid from 'short-uuid';
import {accept, iconFor, isImage, mimeFor} from "@/common/utils/mime-utils";
import {imageCompressable, imageDisplayUrl, imageThumbnailUrl} from "@/common/utils/image-utils";
import {createOssClient, getOssToken} from "@/common/utils/aliyun-utils";
import ThreeBarIcon from '@/common/components/ThreeBarIcon';
import draggable from 'vuedraggable';
import {canViewFile, isMobileBrowser, viewFile} from "@/common/utils/common-utils";
import {cloneDeep} from 'lodash-es';
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

Vue.use(VueViewer);

export default {
  props: {
    value: {//v-model
      type: Array,
      required: true,
    },

    acceptTypes: {//接收的MIME类型
      type: Array,
      default: function () {
        return ['*'];
      },
    },

    imageOnly: {//是否只用于上传图片
      type: Boolean,
      default: false,
    },

    dnd: {//是否采用拖拽方式
      type: Boolean,
      default: false,
    },

    dndAreaHeight: {//拖拽区域高度
      type: Number,
      default: 50
    },

    dndAreaText: {//拖拽区域文本
      type: String,
    },

    buttonText: {//按钮文本
      type: String,
    },

    buttonStyle: {//按钮样式
      type: Object,
    },

    max: {//最大可上传文件数
      type: Number,
      default: 1,
    },

    perMaxSize: {//单个文件最大M
      type: Number,
      default: 10,
    },

    nameEditable: {//文件名是否可编辑
      type: Boolean,
      default: false
    },

    sortable: {//文件列表是否可排序
      type: Boolean,
      default: false
    },

    ossRequest: {//OSS请求类型
      type: Object,
      required: true
    },

    hideButtonWhenMax: {//文件满时，是否因此按钮，对dndArea无效
      type: Boolean,
      default: false
    },

    viewOnly: {//是否为只浏览模式
      type: Boolean,
      default: false
    },

    onlyOnSite: {//是否现场拍照
      type: Boolean,
      default: false
    },

    compressType: {//图片压缩级别
      type: String,
      default: 'MEDIUM'
    },

    displayCount: {//是否显示count
      type: Boolean,
      default: true
    },
  },

  components: {
    draggable,
    ThreeBarIcon,
  },

  data() {
    return {
      isDragHover: false,
      loading: false,
      localFiles: [],
    }
  },

  created() {
    this.localFiles = cloneDeep(this.value);

    this.$watch('localFiles', function () {
          this.$emit('input', cloneDeep(this.localFiles));
        },
        {
          deep: true,
        });
  },

  computed: {
    finalAcceptTypes() {
      return this.imageOnly ? accept.IMAGE : this.acceptTypes;
    },

    accept() {
      return this.finalAcceptTypes.join(',');
    },

    capture() {
      if (this.imageOnly && this.onlyOnSite) {
        return 'environment'
      }

      return false;
    },

    hasFiles() {
      return this.localFiles.length > 0;
    },

    isFull() {
      return this.localFiles.length >= this.max;
    },

    shouldShowHandle() {
      return this.sortable && this.max > 1 && !this.viewOnly;
    },

    shouldDisableUpload() {
      return this.loading || this.isFull;
    },

    buttonName() {
      let count = '';
      if (this.displayCount) {
        count = `（${this.localFiles.length}/${this.max}）`;
      }

      let defaultText = this.imageOnly ? '添加图片' : '添加文件';
      let theText = this.buttonText ? this.buttonText : defaultText;
      return theText + count;
    },

    dndAreaName() {
      let count = '';
      if (this.displayCount) {
        count = `（${this.localFiles.length}/${this.max}）`;
      }

      let defaultText = this.imageOnly ? '选择或拖拽上传图片' : '选择或拖拽上传文件';
      let theText = this.dndAreaText ? this.dndAreaText : defaultText;
      return theText + count;
    },

    shouldShowButton() {
      if (this.dnd) {
        return false;
      }

      if (this.viewOnly) {
        return false;
      }

      if (this.isFull) {
        return !this.hideButtonWhenMax;
      }

      return true;
    },

    shouldShowDndArea() {
      if (this.isFull) {
        return false;
      }

      if (this.viewOnly) {
        return false;
      }

      return this.dnd;
    },

    dragSectionStyle() {
      return {
        height: this.dndAreaHeight + 'px',
      }
    },

    fileNameEditable() {
      return this.nameEditable && !this.viewOnly;
    },
  },

  methods: {
    onSelectFile(e) {
      let files = this.$refs.fileInput.files;
      if (files && files.length > 0) {
        this.uploadFiles([...files]);
      }
    },

    onDrop(e) {
      this.isDragHover = false;
      let files = e.dataTransfer.files;
      if (files && files.length > 0) {
        this.uploadFiles([...files]);
      }
    },

    triggerUpload() {
      this.$refs.fileInput.click();
    },

    fileViewable(file) {
      return this.viewOnly && canViewFile(file);
    },

    previewFile(event, file) {
      if (isImage(file.type)) {
        event.stopPropagation();

        this.$viewerApi({
          images: [file].map(image => imageDisplayUrl(image)),
          options: {
            toolbar: false,
            title: false,
            navbar: false,
            initialViewIndex: 0,
            zIndexInline: 10000,
            zIndex: 10000,
            viewed() {
              if (isMobileBrowser()) {
                return;
              }

              const _this = this;
              const images = document.querySelectorAll('.viewer-canvas');
              images.forEach(image => {
                image.addEventListener('click', (event) => {
                  _this.viewer.hide();
                });
              });
            },
          },
        });
        return;
      }

      if (canViewFile(file)) {
        viewFile(file);
      }
    },

    iconStyle(file) {
      if (isImage(file.type)) {
        return {
          backgroundImage: `url('${imageThumbnailUrl(file)}')`,
        }
      } else {
        return {
          backgroundImage: `url('/file-icon/${iconFor(file.type)}')`,
        }
      }
    },

    uploadFiles(files) {
      if (!this.finalAcceptTypes.includes('*')) {
        let formatErrorFile = files.find(file => {
          return !this.finalAcceptTypes.includes(file.type);
        });

        if (formatErrorFile) {
          this.$message({
            type: 'error',
            message: `上传失败，文件（${formatErrorFile.name}）格式错误。`,
            center: true
          });
          return;
        }
      }

      let sizeExceedFile = files.find(file => {
        return file.size > this.perMaxSize * 1024 * 1024;
      });

      if (sizeExceedFile) {
        this.$message({
          type: 'error',
          message: `上传失败，文件（${sizeExceedFile.name}）大小超过最大限制（${this.perMaxSize}M）。`,
          center: true
        });
        return;
      }

      if (this.localFiles.length + files.length > this.max) {
        this.$message({
          type: 'error',
          message: `上传失败，文件数量超过最大限制（${this.max}个）。`,
          center: true
        });
        return;
      }

      this.loading = true;

      let promises = files.map(aFile => {
        return mimeFor(aFile).then(type => {
          if (!this.imageOnly) {
            return this.uploadFileToOss(aFile, type.mime);
          }

          let compressionType = {
            VERY_HIGH: 1.5,
            HIGH: 0.8,
            MEDIUM: 0.3,
            LOW: 0.15
          };

          let compressOptions = {
            maxSizeMB: compressionType[this.compressType],
          };

          if (!imageCompressable(type.mime) || aFile.size < compressOptions.maxSizeMB * 1024 * 1024) {
            return this.uploadFileToOss(aFile, type.mime);
          }

          return import(/* webpackChunkName: "browser-image-compression" */ 'browser-image-compression').then(({default: compress}) => {
            return compress(aFile, compressOptions).then((compressed) => {
              return this.uploadFileToOss(compressed, type.mime);
            });
          });

        });
      });

      return Promise.all(promises).finally(() => {
        this.loading = false;
      })
    },

    uploadFileToOss(file, type) {
      return getOssToken(this.ossRequest).then(token => {
        return createOssClient(token).then(client => {
          let id = uuid.generate();
          let key = `${token.folder}/${id}-${file.name}`;
          return client.put(key, file).then(result => {
            this.localFiles.push({
              id: id,
              name: file.name,
              ossKey: key,
              fileUrl: result.url,
              type: type,
              size: file.size,
            });
          });
        });
      });
    },

    deleteFile(file) {
      this.localFiles.splice(this.localFiles.findIndex(i => i.id === file.id), 1);

      //图片文件当前不从OSS删除
      if (isImage(file.type)) {
        return;
      }

      //由前端直接删除OSS上的资源，如果不删除请注释掉
      if (file.ossKey) {
        getOssToken(this.ossRequest).then(token => {
          createOssClient(token).then(client => {
            client.delete(file.ossKey);
          });
        });
      }
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-input__inner {
      border-color: rgb(220, 223, 230) !important; //验证出错时，统一不显示红色边框，有红色文本即可
    }
  }
}

.fileInput {
  display: none;
}

.theDragWrapper {
  background-color: white;
  border: $primary1pxBorder;
}

.itemWrapper {
  border-bottom: $primary1pxBorder;
}

.itemWrapper:last-child {
  border-bottom: none;
}

.itemRow {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dragHandle {
  flex-shrink: 0;
  cursor: move;
  margin-right: 10px;
  margin-left: 2px;
}

.iconWrapper {
  background-position: center center;
  background-size: cover;
  border: $primary1pxBorder;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  margin-right: 5px;
  flex-grow: 0;
  pointer-events: none;
  background-color: white;
}

.fileName {
  flex-grow: 1;
  font-size: 13px;
  overflow: hidden;
  pointer-events: none;
}

.nameInput {
}

.viewable {
  pointer-events: initial;
  cursor: pointer;
}

.deleteButton {
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;
  font-size: 16px;
  padding-left: 10px;
  padding-right: 5px;
}

.deleteButton:hover {
  color: $primaryThemeColor;
}

.icon {
  font-weight: 600;
}

.marginTop8 {
  margin-top: 8px;
}

.dndDisabled {
  cursor: not-allowed;
  pointer-events: none;
}

.dragSection {
  background-color: white;
  border: 1px dashed $placeholderTextColor;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dragSection:hover {
  background-color: #eaf8ff;
  cursor: pointer;
}

.dragHover {
  background-color: #eaf8ff;
  cursor: pointer;
}
</style>
