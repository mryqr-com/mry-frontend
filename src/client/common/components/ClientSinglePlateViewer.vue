<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :customClass="$style.elDialog"
             :title="title"
             :visible.sync="visible"
             top="0"
             width="100%"
             @close="$emit('update:show', false)"
             @open="init">
    <div v-if="canManageGroup(qr.groupId) && homePageExplicitAllPageReferences.length > 1" :class="$style.header">
      <div :class="$style.pageSelectTitle"> 扫描二维码所打开的页面：</div>
      <el-select v-model="pageId"
                 :class="$style.pageSelect"
                 placeholder="请选择需生成码牌的页面"
                 size="medium"
                 @change="onPageIdChanged">
        <el-option v-for="page in homePageExplicitAllPageReferences"
                   :key="page.id"
                   :label="page.name"
                   :value="page.id">
        </el-option>
      </el-select>
    </div>

    <div :class="$style.printWrapper">
      <Plate :id="qr.id" :plateSetting="plateSetting" :qr="finalQr"></Plate>
    </div>

    <div v-if="imageCanvas" :class="$style.plateWrapper">
      <img :class="$style.printQrImage"
           :src="imageCanvas.toDataURL()"
           alt="码牌"/>
      <div :class="$style.imageNote">长按可保存为图片</div>
    </div>

    <div v-else :class="$style.loadingWrapper">
      <i :class="$style.loadingIcon" class="el-icon-loading"></i>
    </div>

    <div slot="footer">
      <el-button v-if="imageCanvas"
                 :class="$style.footerButton"
                 icon="el-icon-close"
                 type="primary"
                 @click="close">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Plate from '@/common/components/plate/Plate';
import {createNamespacedHelpers} from "vuex";
import {cloneDeep} from 'lodash-es';
import {HTML2CANVAS_SCALE, qrUrlWithPage} from "@/common/utils/common-utils";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

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
  },

  components: {
    Plate,
  },

  data() {
    return {
      visible: this.show,
      pageId: null,
      imageCanvas: null,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'appHomePageId',
      'canManageGroup',
      'homePageExplicitAllPageReferences',
    ]),

    finalQr() {
      if (!this.pageId || this.pageId === this.appHomePageId) {
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
      this.pageId = this.appHomePageId;
      this.generateImage();
    },

    generateImage() {
      this.imageCanvas = null;
      let _this = this;

      import(/* webpackChunkName: "html2canvas" */ 'html2canvas').then(({default: html2canvas}) => {
        setTimeout(() => {
          html2canvas(document.getElementById(_this.qr.id), {
            allowTaint: true,
            useCORS: true,
            scale: HTML2CANVAS_SCALE,
          }).then(canvas => {
            _this.imageCanvas = canvas;
          });
        }, 500);
      });
    },

    onPageIdChanged() {
      this.generateImage();
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
    .el-dialog {
      margin-top: 0;
      margin-bottom: 0;
    }

    .el-dialog__body {
      padding-bottom: 20px;
    }

    .el-dialog__footer {
      text-align: center;
    }
  }
}

.elDialog {
  max-width: 600px;
  height: 100%;
}

.header {
}

.pageSelectTitle {
  margin-bottom: 5px;
}

.pageSelect {
  width: 100%;
}

.printWrapper {
  position: fixed;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.plateWrapper {
  padding-top: 24px;
}

.imageNote {
  margin-top: 15px;
  text-align: center;
}

.printQrImage {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
  display: block;
  margin: auto;
}

.loadingWrapper {
  text-align: center;
  padding-top: 100px;
  padding-bottom: 100px;
}

.loadingIcon {
  font-size: 20px;
  font-weight: 600;
}

.footerButton {
  width: 100%;
}

</style>

