<template>
  <div :class="$style.wrapper">
    <vue-editor :key="placeholder"
                v-model="theContent"
                :editor-toolbar="customToolbar"
                :placeholder="placeholder"
                :style="{'--css-position': cssPosition,'--sticky-top':stickyTop}"
                :useCustomImageHandler="true"
                @image-added="handleImageAdded">
    </vue-editor>
  </div>
</template>

<script>
import {VueEditor} from "vue2-editor";
import {createOssClient, getOssToken} from "@/common/utils/aliyun-utils";
import {mimeFor} from "@/common/utils/mime-utils";
import {imageCompressable} from "@/common/utils/image-utils";
import uuid from "short-uuid";

export default {
  props: {
    value: {
      type: String,
    },

    ossRequest: {
      type: Object,
      required: true,
    },

    placeholder: {
      type: String,
    },

    stickyHeader: {
      type: Boolean,
      default: false,
    },

    stickyTop: {
      type: String,
      default: '0',
    },
  },

  components: {
    VueEditor,
  },

  data() {
    let allColors = [
      '#FFFFFF',
      '#D3D3D3',
      '#C0C4CC',
      '#A9A9A9',
      '#888888',
      '#606266',
      '#404040',
      '#202020',
      '#303133',
      '#000000',
      '#F0F8FF',
      '#6CB4EE',
      '#7FFFD4',
      '#89CFF0',
      '#7CB9E8',
      '#72A0C1',
      '#6699CC',
      '#007FFF',
      '#1F75FE',
      '#0CAFFF',
      '#00BFFF',
      '#318CE7',
      '#0070BB',
      '#0066b2',
      '#3457D5',
      '#1034A6',
      '#004687',
      '#00308F',
      '#002244',
      '#1F305E',
      '#76FF7A',
      '#9ACD32',
      '#32CD32',
      '#55DD33',
      '#32de84',
      '#50C878',
      '#00AB66',
      '#228B22',
      '#018749',
      '#006A4E',
      '#fd5c63',
      '#E25822',
      '#FF007F',
      '#FF004F',
      '#FF033E',
      '#F2003C',
      '#e41c38',
      '#DE3163',
      '#D2122E',
      '#AA0000',
      '#FFFF00',
      '#F0E68C',
      '#FFD700',
      '#FFC72C',
      '#FEBE10',
      '#FFC0CB',
      '#FF69B4',
      '#F9629F',
      '#FF00FF',
      '#FF00BF',
      '#FEA500',
      '#EE178C',
      '#FE4400',
      '#E64402',
      '#8F00F8',
      '#C30000',
      '#44D144',
      '#00C300',
      '#00BEFE',
      '#1D88EA'];
    return {
      customToolbar: [
        [{header: [false, 1, 2, 3, 4, 5, 6]}],
        ["bold", "italic", "underline", "strike"],
        [
          {align: ""},
          {align: "center"},
          {align: "right"},
          {align: "justify"}
        ],
        ["blockquote", "code-block"],
        [{list: "ordered"}, {list: "bullet"}, {list: "check"}],
        [{indent: "-1"}, {indent: "+1"}],
        [{
          color: allColors
        }, {
          background: allColors
        }],
        ["link", "image"],
        ["clean"],
      ]
    }
  },

  created() {
    this.$nextTick(() => {
      this.$el.querySelector('.ql-bold').setAttribute('title', '粗体');
      this.$el.querySelector('.ql-italic').setAttribute('title', '斜体');
      this.$el.querySelector('.ql-underline').setAttribute('title', '下划线');
      this.$el.querySelector('.ql-strike').setAttribute('title', '中划线');
      this.$el.querySelector('.ql-align[value=""]').setAttribute('title', '左对齐');
      this.$el.querySelector('.ql-align[value="center"]').setAttribute('title', '居中');
      this.$el.querySelector('.ql-align[value="right"]').setAttribute('title', '右对齐');
      this.$el.querySelector('.ql-align[value="justify"]').setAttribute('title', '两端对齐');
      this.$el.querySelector('.ql-blockquote').setAttribute('title', '文段引用');
      this.$el.querySelector('.ql-code-block').setAttribute('title', '代码段');
      this.$el.querySelector('.ql-list[value="ordered"]').setAttribute('title', '编号列表');
      this.$el.querySelector('.ql-list[value="bullet"]').setAttribute('title', 'Bullet列表');
      this.$el.querySelector('.ql-list[value="check"]').setAttribute('title', 'Checkbox列表');
      this.$el.querySelector('.ql-indent[value="-1"]').setAttribute('title', '左缩进');
      this.$el.querySelector('.ql-indent[value="+1"]').setAttribute('title', '右缩进');
      this.$el.querySelector('.ql-color').setAttribute('title', '文本颜色');
      this.$el.querySelector('.ql-background').setAttribute('title', '文本背景色');
      this.$el.querySelector('.ql-link').setAttribute('title', '网页链接');
      this.$el.querySelector('.ql-image').setAttribute('title', '插入图片');
      this.$el.querySelector('.ql-clean').setAttribute('title', '清空样式');
    });
  },

  computed: {
    theContent: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit('input', value);
      }
    },

    cssPosition() {
      return this.stickyHeader ? 'sticky' : 'static';
    }
  },

  methods: {
    handleImageAdded(aFile, Editor, cursorLocation, resetUploader) {
      return mimeFor(aFile).then(type => {
        let compressOptions = {
          maxSizeMB: 0.3,
        };

        if (!imageCompressable(type.mime) || aFile.size < compressOptions.maxSizeMB * 1024 * 1024) {
          return this.uploadFileToOss(aFile, Editor, cursorLocation, resetUploader);
        }

        return import(/* webpackChunkName: "browser-image-compression" */ 'browser-image-compression').then(({default: compress}) => {
          return compress(aFile, compressOptions).then((compressed) => {
            return this.uploadFileToOss(compressed, Editor, cursorLocation, resetUploader);
          });
        });

      });
    },

    uploadFileToOss(file, Editor, cursorLocation, resetUploader) {
      return getOssToken(this.ossRequest).then(token => {
        return createOssClient(token).then(client => {
          let id = uuid.generate();
          let key = `${token.folder}/${id}-${file.name}`;
          return client.put(key, file);
        });
      }).then(result => {
        Editor.insertEmbed(cursorLocation, "image", result.url);
        resetUploader();
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  background-color: white;

  :global {
    .ql-container {
      font-size: inherit;
    }

    .ql-editor {
      font-size: inherit;
      line-height: 1.6;
    }

    .ql-toolbar {
      z-index: 1000;
      background-color: white;
      position: var(--css-position);
      top: var(--sticky-top)
    }

    .ql-toolbar button svg {
      height: 18px !important;
      width: 18px !important;
    }
  }
}
</style>
