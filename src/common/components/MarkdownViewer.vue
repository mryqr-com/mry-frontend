<template>
  <div v-if="value" ref="theViewer" :class="$style.wrapper" :style="theStyle" v-html="parsed">
  </div>
</template>

<script>
import Vue from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import {fontStyles, isMobileBrowser} from "@/common/utils/common-utils";
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

Vue.use(VueViewer);

const markDownIt = new MarkdownIt("default", {
  linkify: true,
  html: true,
  breaks: true,//编辑时的单次换行显示时也为换行，否则两个空行才能显示为一个空行
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, {language: lang}).value;
      } catch (__) {
      }
    }

    return ''; // use external default escaping
  }
});

markDownIt.use(require("markdown-it-anchor").default);
markDownIt.use(require("markdown-it-table-of-contents"), {
  includeLevel: [1, 2, 3],
  listType: 'ul',
});

export default {
  props: {
    value: {
      type: String,
    },

    markdownStyle: {
      type: Object,
      default: function () {
        return {
          fontStyle: {
            fontFamily: "默认",
            fontSize: 14,
            bold: false,
            italic: false,
            color: 'rgba(68, 68, 68, 1)',
          },
          lineHeight: 1.8
        }
      }
    },
  },

  mounted() {
    let theViewerElement = this.$refs.theViewer;
    if (theViewerElement) {
      let links = theViewerElement.getElementsByTagName('a');
      let len = links.length;
      for (let i = 0; i < len; i++) {
        links[i].target = "_blank";
      }
    }

    //toc的链接不能有'_blank'，否则无法页内跳转
    let tocElement = document.querySelector('.table-of-contents');
    if (tocElement) {
      let tocLinks = tocElement.getElementsByTagName('a');
      let tocLinksLength = tocLinks.length;
      for (let i = 0; i < tocLinksLength; i++) {
        tocLinks[i].target = '';
      }
    }

    this.$nextTick(() => {
      let images = this.$el.getElementsByTagName('img');
      for (let image of images) {
        image.addEventListener("click", this.preImage);
      }
    });
  },

  computed: {
    theStyle() {
      return {
        ...fontStyles(this.markdownStyle.fontStyle),
        lineHeight: this.markdownStyle.lineHeight + 'em',
      }
    },

    parsed() {
      return markDownIt.render(this.value);
    }
  },

  methods: {
    preImage(event) {
      let src = event.target.src;
      if (!src.includes('?')) {
        src = `${src}?x-oss-process=image/auto-orient,1`;
      }

      this.$viewerApi({
        images: [src],
        options: {
          toolbar: false,
          navbar: false,
          title: false,
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
    }
  }

}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .table-of-contents ul {
      margin-bottom: 0 !important;
    }

    img:hover {
      cursor: zoom-in;
    }
  }

  overflow-wrap: break-word;

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

  h1, h2, h3, h4 {
    scroll-margin-top: 60px;
  }

  p {
    margin-top: 0;
    margin-bottom: 8px;
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
</style>
