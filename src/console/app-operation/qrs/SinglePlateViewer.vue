<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :title="title"
             :visible.sync="visible"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)"
             @open="init">
    <div v-if="canManageGroup(qr.groupId) && homePageExplicitAllPageReferences.length > 1" :class="$style.header">
      扫描二维码所打开的页面：
      <el-select v-model="pageId"
                 placeholder="请选择需生成码牌的页面"
                 size="medium">
        <el-option v-for="page in homePageExplicitAllPageReferences"
                   :key="page.id"
                   :label="page.name"
                   :value="page.id">
        </el-option>
      </el-select>
    </div>

    <div :class="$style.printWrapper">
      <!--用于生成打印图片，显示那个被scale过，生成图片质量不行-->
      <Plate :id="qr.id" :plateSetting="plateSetting" :qr="finalQr"></Plate>

      <img v-if="imageCanvas"
           :id="printImageId"
           :class="$style.printQrImage"
           :src="imageCanvas.toDataURL()"
           alt="printImage"/>
    </div>

    <div :class="$style.plateWrapper" :style="plateWrapperStyle">
      <Plate :class="$style.thePlate"
             :plateSetting="plateSetting"
             :qr="finalQr"
             :scale="scale">
      </Plate>
    </div>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-printer"
                 size="medium"
                 type="primary"
                 @click="print">
        打印
      </el-button>

      <el-button :class="$style.footerButton"
                 icon="el-icon-download"
                 size="medium"
                 type="primary"
                 @click="download">
        下载
      </el-button>

      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="close">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Plate from '@/common/components/plate/Plate';
import {saveAs} from 'file-saver';
import {createNamespacedHelpers} from "vuex";
import {cloneDeep} from 'lodash-es';
import uuid from "short-uuid";
import {HTML2CANVAS_SCALE, qrUrlWithPage} from "@/common/utils/common-utils";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },

    qr: {
      type: Object,
      required: true,
    },

    plateSetting: {
      type: Object,
      required: true,
    },

    width: {
      type: Number,
      default: 500
    }
  },

  components: {
    Plate,
  },

  data() {
    return {
      visible: this.show,
      workingCanvas: null,
      pageId: null,
      printImageId: uuid.generate(),
      imageCanvas: null,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppHomePageId',
      'canManageGroup',
      'homePageExplicitAllPageReferences',
    ]),

    plateWrapperStyle() {
      return {
        width: this.plateWidth + 'px',
        height: this.plateHeight + 'px',
      }
    },

    plateWidth() {
      return this.scale * this.plateSetting.config.width;
    },

    plateHeight() {
      return this.scale * this.plateSetting.config.height;
    },

    scale() {
      if (this.plateSetting.config.height > this.plateSetting.config.width) {
        return this.plateSetting.config.height > 400 ? 400 / this.plateSetting.config.height : 1;
      }

      return this.plateSetting.config.width > 400 ? 400 / this.plateSetting.config.width : 1;
    },

    finalQr() {
      if (!this.pageId || this.pageId === this.currentAppHomePageId) {
        return this.qr;
      } else {
        let finalQr = cloneDeep(this.qr);
        finalQr.url = qrUrlWithPage(this.qr.plateId, this.pageId);
        return finalQr;
      }
    }
  },

  methods: {
    init() {
      this.pageId = this.currentAppHomePageId;
    },

    download() {
      let _this = this;
      import(/* webpackChunkName: "html2canvas" */ 'html2canvas').then(({default: html2canvas}) => {
        html2canvas(document.getElementById(_this.qr.id), {
          allowTaint: true,
          useCORS: true,
          scale: HTML2CANVAS_SCALE,
        }).then(canvas => {
          canvas.toBlob(blob => {
            saveAs(blob, `${this.qr.name}.png`);
          });
        });
      });
    },

    print() {
      let _this = this;
      import(/* webpackChunkName: "html2canvas" */ 'html2canvas').then(({default: html2canvas}) => {
        html2canvas(document.getElementById(_this.qr.id), {
          allowTaint: true,
          useCORS: true,
          scale: HTML2CANVAS_SCALE,
        }).then(canvas => {
          _this.imageCanvas = canvas;
          _this.$nextTick(() => {
            import(/* webpackChunkName: "print-js" */ 'print-js').then(({default: print}) => {
              print(_this.printImageId, 'html');
            });
          });
        });
      });
    },

    close() {
      this.visible = false;
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 10px;
    }

    .el-dialog__footer {
      text-align: center;
      margin-top: 10px;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  padding-bottom: 24px;
}

.printWrapper {
  position: fixed;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.printQrImage {
  max-width: 800px;
  max-height: 800px;
}

.plateWrapper {
  margin: auto;
}

.thePlate {
  transform-origin: left top !important;
  box-shadow: $imageShadow;
  overflow: hidden;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

