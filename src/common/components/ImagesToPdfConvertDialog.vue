<template>
  <el-dialog :close-on-click-modal="false"
             :visible.sync="visible"
             title="码牌图片转为PDF"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)"
             @open="init">
    <section :class="$style.imagesUploadSection" @dragover.prevent @drop.prevent>
      <input ref="fileInput"
             :class="$style.fileInput"
             :multiple="true"
             accept="image/png"
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
          <span>拖动多张码牌图片文件到此区域，或者点击下方按钮</span>
          <el-button :class="$style.uploadButton"
                     plain
                     size="medium"
                     type="primary"
                     @click="triggerUpload">
            添加码牌图片...
          </el-button>
        </div>
      </div>
    </section>

    <section :class="$style.imageListSection">
      <div :class="$style.fileListHeader">码牌图片列表（共{{ imageFiles.length }}个文件）</div>
      <div v-if="imageFiles.length > 0" :class="$style.imageListContainer">
        <div v-for="(file,index) in imageFiles" :class="$style.fileRow">
          <div>
            <span :class="$style.indexNumber">{{ index + 1 }}.</span>
            {{ file.name }}
          </div>
          <i :class="$style.deleteButton"
             class="el-icon-close"
             title="删除"
             @click="deleteImageFile(index)">
          </i>
        </div>
      </div>

      <div v-else :class="$style.noFileContainer">当前无文件</div>
    </section>

    <section :class="$style.settingSection">
      <div :class="$style.settingTitle">
        设置
        <el-popover placement="top"
                    trigger="hover">
          <span slot="reference" :class="$style.settingHelp">如何设置</span>
          <img :class="$style.settingImage" alt="设置" src="/images/plate2pdf.jpg"/>
        </el-popover>
      </div>
      <div :class="$style.settingRow">
        <div>
          页面左侧边距(mm)：
          <el-input-number v-model="pageLeft"
                           :class="$style.settingInput"
                           :max="50"
                           :min="0"
                           :step="0.5"
                           :stepStrictly="true"
                           controls-position="right"
                           size="mini"
                           title="页面左侧边距">
          </el-input-number>
        </div>

        <div>
          水平方向图片间距(mm)：
          <el-input-number v-model="hMargin"
                           :class="$style.settingInput"
                           :max="20"
                           :min="0"
                           :step="0.5"
                           :stepStrictly="true"
                           controls-position="right"
                           size="mini"
                           title="水平方向图片间距">
          </el-input-number>
        </div>
      </div>

      <div :class="$style.settingRow">
        <div>
          页面顶部边距(mm)：
          <el-input-number v-model="pageTop"
                           :class="$style.settingInput"
                           :max="50"
                           :min="0"
                           :step="0.5"
                           :stepStrictly="true"
                           controls-position="right"
                           size="mini"
                           title="页面顶部边距">
          </el-input-number>
        </div>

        <div>
          竖直方向图片间距(mm)：
          <el-input-number v-model="vMargin"
                           :class="$style.settingInput"
                           :max="20"
                           :min="0"
                           :step="0.5"
                           :stepStrictly="true"
                           controls-position="right"
                           size="mini"
                           title="竖直方向图片间距">
          </el-input-number>
        </div>
      </div>
    </section>

    <div slot="footer" :class=$style.footer>
      <el-checkbox v-model="isRotate"
                   size="mini"
                   title="将码牌图片旋转90度">
        图片旋转90度
      </el-checkbox>

      <div>
        <el-button :class="$style.footerButton"
                   :disabled="imageFiles.length === 0 || generatingPdf"
                   icon="el-icon-delete"
                   size="medium"
                   type="plain"
                   @click="clear">
          清空
        </el-button>

        <el-button :class="$style.footerButton"
                   :disabled="imageFiles.length === 0 || generatingPdf"
                   :icon="generatingPdf ?`el-icon-loading`:`el-icon-download`"
                   size="medium"
                   type="primary"
                   @click="convert">
          生成PDF
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {HTML2CANVAS_SCALE, PLATE_IMAGE_SCALE} from "@/common/utils/common-utils";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      generatingPdf: false,
      visible: this.show,
      isDragHover: false,
      imageFiles: [],
      pageTop: 5,
      pageLeft: 5,
      hMargin: 2,
      vMargin: 2,
      isRotate: false,
      firstUpload: true,
      defaultSettings: {
        // 'width*height':[pageLeft,hMargin,pageTop,vMargin,isRotate]
        //可以根据实际情况添加更多默认选项
        '70x50': [2, 2, 4, 3, true],
        '50x70': [2, 2, 4, 3, false],
        '60x90': [10, 5, 8, 5, false],
      },
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    init() {
      this.generatingPdf = false;
      this.firstUpload = true;
      this.pageTop = 5;
      this.pageLeft = 5;
      this.hMargin = 2;
      this.vMargin = 2;
      this.isRotate = false;
      this.imageFiles = [];
      this.isDragHover = false;
    },

    uploadFile(e) {
      this.addImageFiles(e.target.files);
    },

    triggerUpload() {
      this.$refs.fileInput.click();
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
      this.addImageFiles(e.dataTransfer.files);
    },

    addImageFiles(files) {
      this.imageFiles.push(...files);

      //first upload try guess settings
      if (this.firstUpload) {
        this.firstUpload = false;
        let firstImage = new Image();
        firstImage.src = URL.createObjectURL(this.imageFiles[0]);
        let _this = this;
        firstImage.onload = () => {
          let imageWidth = firstImage.width / (HTML2CANVAS_SCALE * PLATE_IMAGE_SCALE);
          let imageHeight = firstImage.height / (HTML2CANVAS_SCALE * PLATE_IMAGE_SCALE);

          let defaultSetting = _this.defaultSettings[`${imageWidth}x${imageHeight}`];
          if (defaultSetting) {
            _this.pageLeft = defaultSetting[0];
            _this.hMargin = defaultSetting[1];
            _this.pageTop = defaultSetting[2];
            _this.vMargin = defaultSetting[3];
            _this.isRotate = defaultSetting[4];
          }

          URL.revokeObjectURL(firstImage.src);
        };
      }
    },

    deleteImageFile(index) {
      this.imageFiles.splice(index, 1);
    },

    convert() {
      if (this.generatingPdf) {
        return;
      }

      this.generatingPdf = true;
      let images = this.imageFiles.map(file => {
        let image = new Image();
        image.src = URL.createObjectURL(file);
        return image;
      });

      let _this = this;
      images[0].onload = () => {//所有图片都按照第一张图片的尺寸进行处理
        let imageWidth = images[0].width / (HTML2CANVAS_SCALE * PLATE_IMAGE_SCALE)
        let imageHeight = images[0].height / (HTML2CANVAS_SCALE * PLATE_IMAGE_SCALE);

        _this.convertImagesToPdf(images, imageWidth, imageHeight, _this.vMargin, _this.hMargin, _this.pageTop, _this.pageLeft, _this.isRotate)
            .catch(e => {
              this.$message({
                type: 'error',
                message: e,
                center: true,
              });
            }).finally(() => {
          _this.generatingPdf = false;
        });

        setTimeout(function () {
          images.forEach(image => {
            URL.revokeObjectURL(image.src);
          });
        }, 300000);//5分钟之后回收
      };
    },

    convertImagesToPdf(images, imageWidth, imageHeight, vMargin, hMargin, pageTop, pageLeft, isRotate) {
      let realWidth = isRotate ? imageHeight : imageWidth;
      let realHeight = isRotate ? imageWidth : imageHeight;
      let xStep = realWidth + hMargin;
      let yStep = realHeight + vMargin;
      let countPerRow = 0;
      let countPerColumn = 0;

      for (let n = 1; n < 100; n++) {
        let rowWidth = 2 * pageLeft + (n - 1) * hMargin + n * realWidth;
        if (rowWidth <= 210) {
          countPerRow = n;
        }
        if (rowWidth > 210) {
          break;
        }
      }

      for (let n = 1; n < 100; n++) {
        let columnHeight = 2 * pageTop + (n - 1) * vMargin + n * realHeight;
        if (columnHeight <= 297) {
          countPerColumn = n;
        }
        if (countPerColumn > 297) {
          break;
        }
      }

      if (countPerColumn === 0 || countPerRow === 0) {
        return Promise.reject("码牌图片无法放进A4纸中！");
      }

      return import(/* webpackChunkName: "jspdf" */ 'jspdf').then(({default: jsPDF}) => {
        let doc = new jsPDF('p', 'mm', 'a4', true);
        let pageNumber = 1;
        images.forEach((image, index) => {
          if (index !== 0 && index % (countPerRow * countPerColumn) === 0) {
            doc.addPage('a4', 'p');
            pageNumber++;
          }

          let currentPageRowIndex = index % countPerRow;
          let totalColumnIndex = (index / countPerRow) | 0;
          let currentPageColumnIndex = totalColumnIndex - (pageNumber - 1) * countPerColumn;

          let x = pageLeft + currentPageRowIndex * xStep;
          let y = pageTop + currentPageColumnIndex * yStep;
          x = isRotate ? x + realWidth : x;
          y = isRotate ? y - (imageHeight - imageWidth) : y;
          doc.addImage(image, 'PNG', x, y, imageWidth, imageHeight, index, 'MEDIUM', isRotate ? 90 : 0);
        });

        doc.save("码牌图片.pdf");
      });
    },

    cancel() {
      this.visible = false;
    },

    clear() {
      this.imageFiles = [];
    },
  },
}
</script>


<style lang="scss" module>
.wrapper {
}

.imagesUploadSection {

}

.fileInput {
  display: none;
}

.dragSection {
  border: 2px dashed $primaryBorderColor;
  width: 100%;
  height: 120px;
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

.imageListSection {
  border: $primary1pxBorder;
  margin-top: 24px;
}

.fileListHeader {
  padding: 12px;
  background-color: $primaryBackgroundColor;
  font-weight: 500;
  color: $primaryTextColor;
  border-bottom: $primary1pxBorder;
}

.imageListContainer {
  overflow-y: auto;
  height: 200px;
}

.noFileContainer {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fileRow {
  border-bottom: $primary1pxBorder;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fileRow:last-child {
  border-bottom: none;
}

.fileRow:hover {
  background-color: $lightBackgroundColor;
}

.indexNumber {
  padding-right: 10px;
}

.settingSection {
  margin-top: 12px;
}

.settingTitle {
  font-size: 15px;
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 5px;
}

.settingHelp {
  font-size: 12px;
  color: $primaryThemeColor;
  font-weight: 400;
  text-decoration: underline;
  float: right;
}

.settingHelp:hover {
  cursor: pointer;
}

.settingImage {
  width: 500px;
}

.settingRow {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.settingInput {
  width: 100px;
}

.deleteButton {
  cursor: pointer;
  margin-right: 5px;
  font-size: 16px;
  font-weight: 500;
}

.deleteButton:hover {
  color: $rejectRed;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

