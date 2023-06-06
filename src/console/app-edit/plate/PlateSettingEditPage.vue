<template>
  <div :class="$style.wrapper" tabindex="0">
    <PlateControlBox :class="$style.controlBox"></PlateControlBox>

    <section id="consolePlateEditSection" :class="$style.viewSection" @click.self="activatePlateConfig">
      <div :class="$style.plateCanvas" :style="plateCanvasStyle" @click.self="activatePlateConfig">
        <div id="consolePlateEditViewer"
             :class="$style.plateWrapper"
             :style="plateWrapperStyle">
          <draggable v-model="controls"
                     :chosenClass="$style.chosenClass"
                     :dragClass="$style.dragClass"
                     :emptyInsertThreshold="500"
                     :forceFallback="true"
                     :ghostClass="$style.ghostClass"
                     :group="{ name: 'plateControls', pull: true, put: true}"
                     animation="200"
                     tag="ul"
                     @add="onDragAdded"
                     @end="isDragging = false"
                     @start="isDragging = true">
            <transition-group :enter-active-class="!isDragging ? $style.enterActive:null"
                              :enter-class="!isDragging ? $style.enterClass : null"
                              :leave-active-class="!isDragging ? $style.leaveActive:null"
                              :leave-to-class="!isDragging ? $style.leaveTo:null"
                              :move-class="!isDragging ? $style.flipListMove:null"
                              type="transition">
              <li v-for="(control,index) in controls" :key="control.id">
                <PlateControlViewWrapper :control="control"
                                         :index="index"
                                         :style="controlStyle(index)">
                </PlateControlViewWrapper>
              </li>
            </transition-group>
          </draggable>
        </div>
      </div>

      <div :class="$style.zoomSection">
        <button :class="$style.zoomButton"
                class="marginBottom6"
                title="码牌基本设置"
                @click.stop="activatePlateConfig">
          <icon icon="tools"/>
        </button>

        <button :class="$style.zoomButton"
                class="marginBottom6"
                title="将码牌置于可见区域中央"
                @click.stop="scrollPlateIntoView('smooth',false,100)">
          <icon icon="crosshairs"/>
        </button>

        <button :class="$style.zoomButton"
                class="marginBottom6"
                title="放大"
                @click.stop="zoomIn">
          <icon icon="plus"/>
        </button>

        <button :class="$style.zoomButton"
                class="marginBottom6"
                title="缩小"
                @click.stop="zoomOut">
          <icon icon="minus"/>
        </button>
        <div>{{ scale }}%</div>
      </div>
    </section>

    <PlateSettingEditPanelWrapper :key="plateSettingEditPanelKey" :class="$style.editPanel">
    </PlateSettingEditPanelWrapper>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

import PlateControlBox from '@/console/app-edit/plate/PlateControlBox';
import PlateSettingEditPanelWrapper from '@/console/app-edit/plate/PlateSettingEditPanelWrapper';
import {createNamespacedHelpers} from "vuex";
import {zoom} from '@/common/utils/common-utils';
import ACTIONS from "@/console/app-edit/store/app-edit-actions";
import {imageDisplayUrl} from "@/common/utils/image-utils";
import eventBus from "@/common/utils/event-bus";
import PlateControlViewWrapper from '@/console/app-edit/plate/PlateControlViewWrapper';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    draggable,
    PlateControlBox,
    PlateSettingEditPanelWrapper,
    PlateControlViewWrapper,
  },

  data() {
    return {
      scale: 100,
      isDragging: false
    }
  },

  created() {
    this.activatePlateConfig();
    eventBus.$on('plateSizeTypeChanged', this.onPlateSizeTypeChanged);
    eventBus.$on('plateCustomSizeChanged', this.onPlateCustomSizeChanged);
    eventBus.$on('plateTemplateApplied', this.onPlateTemplateApplied);
    this.$nextTick(() => {
      this.$el.addEventListener('keydown', this.onKeyDown);
    });
  },

  mounted() {
    this.scrollPlateIntoView('auto', true, 100);
  },

  beforeDestroy() {
    eventBus.$off('plateSizeTypeChanged');
    eventBus.$off('plateTemplateApplied');
    eventBus.$off('plateCustomSizeChanged');
    this.$el.removeEventListener('keydown', this.onKeyDown);
  },

  computed: {
    ...appEditStore.mapGetters([
      'plateSetting',
      'plateConfig',
      'plateSettingEditPanelKey',
    ]),

    controls: {
      get() {
        return this.plateSetting.controls;
      },

      set(controls) {
        this[ACTIONS.DRAG_PLATE_CONTROLS](controls);
      }
    },

    plateWrapperStyle() {
      return {
        width: this.plateConfig.width + 'px',
        height: this.plateConfig.height + 'px',
        borderRadius: this.plateConfig.borderRadius + 'px',
        padding: this.plateConfig.padding + 'px',
        backgroundColor: !this.plateConfig.backgroundImage && this.plateConfig.backgroundColor ?
            this.plateConfig.backgroundColor : 'white',
        backgroundImage: this.plateConfig.backgroundImage ?
            `url('${imageDisplayUrl(this.plateConfig.backgroundImage)}')` : 'none'
      }
    },

    plateCanvasStyle() {
      return {
        width: this.plateConfig.width * 5 + 100 + 'px',
        height: this.plateConfig.height * 5 + 100 + 'px',
      }
    },
  },

  methods: {
    ...appEditStore.mapActions([
      ACTIONS.DRAG_PLATE_CONTROLS,
      ACTIONS.SET_CURRENT_PLATE_CONTROL,
      ACTIONS.ACTIVATE_PLATE_CONFIG,
    ]),

    onPlateCustomSizeChanged() {
      this.scrollPlateIntoView('auto', false, 0);
    },

    onPlateSizeTypeChanged() {
      this.scrollPlateIntoView('auto', true, 100);
    },

    onPlateTemplateApplied() {
      this.scrollPlateIntoView('auto', true, 1000);
    },

    scrollPlateIntoView(behavior = 'smooth', zoom = true, wait = 100) {
      let _this = this;
      setTimeout(function () {
        _this.$nextTick(() => {
          if (zoom) {
            let vScale = Math.round(400 / _this.plateConfig.height * 100);
            let hScale = Math.round(400 / _this.plateConfig.width * 100);
            _this.scale = Math.min(vScale, hScale);
            _this.zoom();
          }

          document.getElementById('consolePlateEditViewer').scrollIntoView({
            behavior: behavior,
            block: 'center',
            inline: 'center'
          });
        });
      }, wait);
    },

    activatePlateConfig() {
      this[ACTIONS.ACTIVATE_PLATE_CONFIG]();
    },

    onKeyDown(e) {
      if (e.keyCode === 27) {//esc
        this[ACTIONS.ACTIVATE_PLATE_CONFIG]();
      }
    },

    zoomIn() {
      this.scale = this.scale + 1;
      if (this.scale > 200) {
        this.scale = 200;
      }

      this.zoom();
    },

    zoomOut() {
      this.scale = this.scale - 1;
      if (this.scale < 25) {
        this.scale = 25;
      }

      this.zoom();
    },

    zoom() {
      let element = document.getElementById('consolePlateEditViewer');
      zoom(element, this.scale / 100);
    },

    onDragAdded(control) {
      let listedControl = this.controls[control.newIndex];

      let payload = {
        currentEditType: 'PLATE_CONTROL',
        currentControlId: listedControl ? listedControl.id : this.controls[0].id
      };
      this[ACTIONS.SET_CURRENT_PLATE_CONTROL](payload);
    },

    controlStyle(index) {
      return {
        zIndex: 10000 - index,
      }
    }
  }
};
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  display: flex;
}

.controlBox {
  flex-shrink: 0;
}

.viewSection {
  flex-grow: 1;
  flex-shrink: 0;
  height: 100%;
  overflow: scroll;
  position: relative;
}

.plateCanvas {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plateWrapper {
  background-color: white;
  box-shadow: $primaryShadow;
  background-size: cover;
  background-position: center;
}

.zoomSection {
  position: fixed;
  bottom: 24px;
  right: 324px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.zoomButton {
  outline: none;
  text-decoration: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #b1b1b1;
  background-color: transparent;
  border: none;
}

.zoomButton:hover {
  color: dimgray;
}

.chosenClass {
  cursor: grab !important;
}

.dragClass {
  cursor: grab !important;
}

.ghostClass {
  background-color: $lightBackgroundColor !important;
  width: 100%;
  margin-top: 0;
  margin-bottom: 0;
}

.enterClass, .leaveTo {
  opacity: 0;
  transform: translateY(30px);
}

.enterActive, .leaveActive {
  transition: width 0.5s;
}

.flipListMove {
  transition: transform 0.5s;
}

.editPanel {
  flex-shrink: 0;
  width: 300px;
  height: 100%;
  overflow-y: auto;
  background-color: white;
  border-left: 1px solid rgba(50, 50, 50, .14);
}

</style>
