<template>
  <div :class="$style.wrapper">
    <div :class="$style.title">码牌控件：</div>
    <draggable :class="$style.controlContainer"
               :clone="addControlOnDrag"
               :dragClass="$style.dragClass"
               :forceFallback="true"
               :group="{ name: 'plateControls', pull: 'clone', put: false }"
               :sort="false"
               :value="plateControlTypes"
               draggable=".canDrag">
      <button v-for="control in plateControlTypes"
              :class="[$style.theButton,{'canDrag':!isPlateControlFull}]"
              :disabled="isPlateControlFull"
              :title="controlTitle(control)"
              @click="addControl(control.type)">
        <icon :icon="control.icon"/>&nbsp;&nbsp;{{ control.name }}
      </button>
    </draggable>

    <el-button :class="$style.templateLibraryButton"
               type="text"
               @click="openTemplateLibrary">
      码牌模板库
    </el-button>

    <PlateTemplateLibraryDialog :show.sync="templateLibraryVisible"></PlateTemplateLibraryDialog>
  </div>
</template>

<script>
import plateControlTypes from '@/common/utils/plate-control-types';
import draggable from 'vuedraggable';
import plateControlFactory from '@/console/app-edit/store/plate-control-factory';
import PlateTemplateLibraryDialog from '@/console/app-edit/plate/PlateTemplateLibraryDialog';

import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    draggable,
    PlateTemplateLibraryDialog
  },

  data() {
    return {
      templateLibraryVisible: false,
    }
  },

  computed: {
    ...appEditStore.mapGetters(['isPlateControlFull']),

    plateControlTypes() {
      return Object.values(plateControlTypes);
    },
  },

  methods: {
    ...appEditStore.mapActions([
      ACTIONS.ADD_PLATE_CONTROL,
    ]),

    addControlOnDrag(control) {
      return plateControlFactory[control.type]();
    },

    addControl(type) {
      this[ACTIONS.ADD_PLATE_CONTROL](type).catch((error) => {
        this.$message({
          type: 'error',
          message: error.message ? error.message : error,
          center: true
        });
      });
    },

    controlTitle(control) {
      if (this.isPlateControlFull) {
        return '当前控件数量已经达到最大值(10个)，无法继续添加';
      }

      return control.title;
    },

    openTemplateLibrary() {
      this.templateLibraryVisible = true;
    },

  }
}
</script>

<style lang="scss" module>
.wrapper {
  width: 180px;
  height: 100%;
  overflow-y: auto;
  background-color: $whiteBackgroundColor;
  border-right: 1px solid rgba(50, 50, 50, .14);
}

.title {
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: 500;
}

.controlContainer {
  padding-left: 15px;
  padding-right: 15px;
}

.theButton {
  display: block;
  color: dimgray;
  border: 1px solid darkgray;
  outline: none;
  text-align: left;
  padding: 6px 0 6px 8px;
  margin-bottom: 15px;
  text-decoration: none;
  cursor: pointer;
  width: 100%;
  height: 36px;
  background-color: white;
  font-size: 13px;
}

.theButton:hover {
  color: $primaryThemeColor;
  border-color: $primaryThemeColor;
  box-shadow: 0 0 2px 2px rgba(0, 191, 255, 0.06);
}

.theButton:disabled {
  color: $placeholderTextColor;
  cursor: not-allowed;
  border: 1px dashed $placeholderTextColor;
}

.theButton:hover:disabled {
  color: $placeholderTextColor;;
  border: 1px dashed $placeholderTextColor;
  box-shadow: none;
}

.dragClass {
  cursor: grab !important;
}

.templateLibraryButton {
  margin-right: auto;
  margin-left: auto;
  display: block;
}

.templateLibraryButton span {
  text-decoration: underline;
  font-weight: normal;
}

</style>
