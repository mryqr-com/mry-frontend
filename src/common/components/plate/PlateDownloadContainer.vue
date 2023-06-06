<template>
  <div :class="$style.wrapper">
    <Plate v-for="qr in qrs"
           :id="qr.plateId"
           :key="qr.plateId"
           :plate-setting="plateSetting"
           :qr="qr">
    </Plate>

    <ProgressBar :max="progressMax"
                 :show.sync="progressBarVisible"
                 :step="progressStep"
                 :text="progressText"
                 title="下载码牌">
    </ProgressBar>
  </div>
</template>

<script>
import Plate from '@/common/components/plate/Plate';
import {saveAs} from 'file-saver';
import plateSizeTypes from "@/common/utils/plate-size-types";
import {HTML2CANVAS_SCALE} from "@/common/utils/common-utils";

export default {
  props: {
    qrs: {
      type: Array,
      required: true,
    },

    plateSetting: {
      type: Object,
      required: true,
    },

    fileName: {
      type: String,
      required: '码牌',
    }
  },

  components: {
    Plate,
  },

  data() {
    return {
      loading: null,
      workingElements: [],
      workingPromises: [],
      progressBarVisible: false,
      progressStep: 1,
      progressMax: 100,
      progressText: null
    }
  },

  computed: {
    sizeText() {
      return plateSizeTypes.find(aSize => aSize.key === this.plateSetting.config.size).name;
    }
  },

  methods: {
    downloadPlates: function (type = 'image') {
      this.$nextTick(() => {
        this.progressBarVisible = true;
        this.progressStep = 1;
        this.progressText = `正在生成码牌...`

        this.workingElements = this.qrs.map(qr => {
          return {
            id: qr.plateId,
            element: document.getElementById(qr.plateId),
          }
        });

        this.progressMax = this.workingElements.length;
        this.workingPromises = [];

        //通过递归setTimeout间隙地让出时间片，以使页面不至于卡顿
        let _this = this;
        setTimeout(function () {
          _this.doDownload(type);
        }, 25);
      });
    },

    doDownload(type) {
      this.progressText = `正在生成码牌(${this.progressStep}/${this.progressMax})...`
      let _this = this;

      import(/* webpackChunkName: "html2canvas" */ 'html2canvas').then(({default: html2canvas}) => {
        let anElement = _this.workingElements.shift();
        _this.workingPromises.push(html2canvas(anElement.element, {
          allowTaint: true,
          useCORS: true,
          scale: HTML2CANVAS_SCALE,
        }).then(canvas => {
          canvas.id = anElement.id;
          return canvas;
        }));

        if (_this.workingElements.length > 0) {
          _this.progressStep = _this.progressStep + 1;
          setTimeout(function () {
            _this.doDownload(type);
          }, 25);
        } else {
          Promise.all(_this.workingPromises).then(canvases => {
            if (type === 'image') {
              import(/* webpackChunkName: "jszip" */ 'jszip').then(({default: JSZip}) => {
                let zip = new JSZip();
                let imgFolder = zip.folder(_this.fileName);

                for (const canvas of canvases) {
                  let imageDataUrl = canvas.toDataURL().split(';base64,')[1];
                  imgFolder.file(`${canvas.id}.png`, imageDataUrl, {base64: true});
                }

                zip.generateAsync({type: "blob"}).then(content => {
                  _this.progressBarVisible = false;
                  let suffix = _this.sizeText.replace('*', 'x');
                  saveAs(content, `${_this.fileName}(${suffix}).zip`);
                });
              });
            } else if (type === 'pdf') {
              //以下用于生成pdf文件，当前不提供该功能，因此只留了一个架子
              // import(/* webpackChunkName: "jspdf" */ 'jspdf').then(({default: jsPDF}) => {
              //   const doc = new jsPDF();
              //   doc.addImage(canvases[0], 'PNG', 0, 0, 100, 100);
              //   doc.save("a4.pdf");
              // });
            }
          }).finally(() => {
            _this.progressBarVisible = false;
          });
        }
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  position: fixed;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
