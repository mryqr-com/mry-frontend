<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :close-on-click-modal="false"
             :destroy-on-close="true"
             :modal-append-to-body="true"
             :title="title"
             :visible.sync="visible"
             :width="width+'px'"
             top="60px"
             @close="$emit('update:show', false)"
             @open="initDialog">
    <MavonEditor ref="md"
                 v-model="localValue"
                 :boxShadow="false"
                 :class="$style.mavonEditor"
                 :editable="!imageUploading"
                 :externalLink="false"
                 :imageClick="imageClickCallback"
                 :toolbars="toolbars"
                 :xssOptions="false"
                 @imgAdd="onImageAdded"
                 @imgDel="onImageDeleted">
    </MavonEditor>
    <div slot="footer">
      <el-button :class="$style.footerButton"
                 :disabled="imageUploading"
                 icon="el-icon-close"
                 type="plain"
                 @click="cancelEdit">
        取消
      </el-button>
      <el-button :class="$style.footerButton"
                 :disabled="imageUploading"
                 :icon="imageUploading?null:'el-icon-check'"
                 type="primary"
                 @click="confirmEdit">
        {{ confirmButtonText }}
        <i v-show="imageUploading" :class="$style.loadingIcon" class="el-icon-loading"></i>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {cloneDeep} from 'lodash-es';
import {createOssClient, getOssToken} from '@/common/utils/aliyun-utils';
import uuid from 'short-uuid';
import {imageCompressable} from '@/common/utils/image-utils';
import {isImage, mimeFor} from '@/common/utils/mime-utils';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

const markdownIt = mavonEditor.mavonEditor.getMarkdownIt()
markdownIt.use(require("markdown-it-anchor").default);
markdownIt.use(require("markdown-it-table-of-contents"), {
  includeLevel: [1, 2, 3],
  listType: 'ul',
});

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: '编辑',
    },

    value: {
      type: String,
    },

    ossRequest: {
      type: Object,
      required: true
    },

    width: {
      type: Number,
      default: 1000
    }

  },

  components: {
    'MavonEditor': mavonEditor.mavonEditor
  },

  data() {
    return {
      visible: this.show,
      localValue: '',
      localImageCache: new Map(),
      imageUploading: false,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    confirmButtonText() {
      if (this.imageUploading) {
        return '正在上传图片';
      }
      return '完成编辑';
    },

    toolbars() {
      return {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        ol: true, // 有序列表
        ul: true, // 无序列表
        imagelink: true, // 图片链接
        table: true, // 表格
        undo: true, // 上一步
        redo: true, // 下一步
        subfield: true, // 单双栏模式
      }
    }
  },

  methods: {
    onImageAdded(pos, image) {
      this.localImageCache.set(pos, image);
    },

    onImageDeleted(fileInfo) {
      this.localImageCache.delete(fileInfo[0]);
    },

    imageClickCallback() {
      //override default(open the image), do nothing
    },

    initDialog() {
      this.localValue = this.value ? cloneDeep(this.value) : '';
      this.imageUploading = false;
    },

    confirmEdit() {
      if (this.imageUploading) {
        return;
      }

      if (this.localImageCache.size < 1) {
        this.$emit('input', this.localValue);
        this.visible = false;
        return;
      }

      this.imageUploading = true;
      return getOssToken(this.ossRequest).then(token => {
        return createOssClient(token).then(client => {
          let promises = [];
          this.localImageCache.forEach((file, key) => {
            if (this.localValue.match(new RegExp(`\\!\\[.*?\\]\\(${key}\\)`, "g"))) {//文本中是否包含对文件的引用

              let promise = mimeFor(file).then(type => {
                let compressOptions = {
                  maxSizeMB: 0.3,
                };

                if (!isImage(type.mime)) {
                  return;
                }

                if (!imageCompressable(type.mime) || file.size < compressOptions.maxSizeMB * 1024 * 1024) {
                  return this.uploadFile(client, file, file._name, key, token);
                }

                return import(/* webpackChunkName: "browser-image-compression" */ 'browser-image-compression').then(({default: compress}) => {
                  return compress(file, compressOptions).then((compressed) => {
                    return this.uploadFile(client, compressed, file._name, key, token);
                  });
                });
              });

              promises.push(promise);
            }
          });

          return Promise.all(promises)
              .finally(() => {
                this.$emit('input', this.localValue);
                this.visible = false;
              });
        });
      }).finally(() => {
        this.imageUploading = false;
      });
    },

    uploadFile(client, file, fileName, key, token) {
      let id = uuid.generate();
      let fileKey = `${token.folder}/${id}-${fileName}`;
      return client.put(fileKey, file).then(result => {
        this.$refs.md.$img2Url(key, result.url);
      });
    },

    cancelEdit() {
      if (this.imageUploading) {
        return;
      }

      this.visible = false;
    }

  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog {
      margin-top: 0;
      margin-bottom: 0;
    }

    .el-dialog__body {
      padding-bottom: 10px;
      height: calc(100vh - 60px - 60px - 66px - 54px);
    }
  }
}

.mavonEditor {
  height: 100%;

  :global {
    .op-image {
      .dropdown-item:first-child {
        display: none;
      }
    }

    .dropdown-images {
      display: none;
    }

    .table-of-contents {
      pointer-events: none;
    }

    .table-of-contents ul {
      margin-bottom: 0 !important;
    }
  }
}

:global {
  .scroll-style::-webkit-scrollbar {
    width: 2px !important;
  }

  .v-show-content {
    font-size: 14px;
    overflow-wrap: break-word;
    color: $regularTextColor;
    line-height: 1.6em;

    h1 {
      padding-bottom: 0 !important;
      margin-top: 18px !important;
      margin-bottom: 14px !important;
      border-bottom: none !important;
      color: $primaryTextColor;
    }

    h2 {
      padding-bottom: 0 !important;
      margin-top: 16px !important;
      margin-bottom: 12px !important;
      border-bottom: none !important;
      color: $primaryTextColor;
    }

    h3 {
      padding-bottom: 0 !important;
      margin-top: 14px !important;
      margin-bottom: 10px !important;
      border-bottom: none !important;
      color: $primaryTextColor;
    }

    h4 {
      padding-bottom: 0 !important;
      margin-top: 12px !important;
      margin-bottom: 8px !important;
      border-bottom: none !important;
      color: $primaryTextColor;
    }

    h5 {
      padding-bottom: 0 !important;
      margin-top: 10px !important;
      margin-bottom: 6px !important;
      border-bottom: none !important;
      color: $primaryTextColor;
    }

    h6 {
      padding-bottom: 0 !important;
      margin-top: 8px !important;
      margin-bottom: 4px !important;
      border-bottom: none !important;
      color: $primaryTextColor;
    }

    p {
      margin-top: 0 !important;
      margin-bottom: 8px !important;
    }

    p:last-child {
      margin-bottom: 0;
    }

    hr {
      border: 0;
      border-top: 1px solid $placeholderTextColor;
    }

    img {
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }

    table {
      display: table !important;
      table-layout: auto;
      border-collapse: collapse;
      width: 100%;
      margin: 0 auto 20px;
      overflow-x: auto;
    }

    table td, table th {
      border: 1px solid $placeholderTextColor;
      padding: 6px;
      word-wrap: break-word;
      text-align: left;
    }

    table th {
      padding-top: 6px;
      padding-bottom: 6px;
      font-weight: 500;
    }

    ul {
      list-style-type: square;
      list-style-position: inside;
      margin-left: 20px;
      margin-bottom: 20px;
      margin-top: 0;
    }

    ol {
      list-style-type: decimal;
      list-style-position: inside;
      margin-left: 20px;
      margin-bottom: 20px;
      margin-top: 0;
    }

    blockquote {
      padding-left: 10px;
      border-left: 5px solid $primaryThemeColor;
      margin-bottom: 20px;
      margin-top: 0;
      margin-left: 20px;
    }

    pre {
      overflow-y: auto;
      margin-bottom: 20px;
      margin-top: 0;
      background-color: #ecf1f3;
      padding: 10px;
    }

    code {
      padding: 2px 4px;
      font-size: 90%;
      border-radius: 3px;
      color: #318CE7;
      background-color: rgba(49, 140, 231, 0.1);
    }

    a:link, a:visited, a:hover, a:active {
      color: $primaryThemeColor;
    }

    table, thead, tbody, th, tr, td, a, ul, ol, li {
      font: inherit;
    }

  }
}

.loadingIcon {
  margin-left: 2px;
  color: white;
}

.footerButton {
  width: 150px;
}


</style>
