<template>
  <div :class="$style.wrapper">
    <div :class="$style.nonFillableControlSection">
      <div :class="$style.category">展示控件：</div>
      <draggable :class="$style.controlContainer"
                 :clone="addControlOnDrag"
                 :dragClass="$style.dragClass"
                 :forceFallback="true"
                 :group="{ name: 'controls', pull: 'clone', put: false }"
                 :sort="false"
                 :value="nonFillableControls"
                 draggable=".canDrag">

        <button v-for="control in nonFillableControls"
                :class="[$style.theButton,{'canDrag':!shouldControlDisabled(control)}]"
                :disabled="shouldControlDisabled(control)"
                :title="controlTitle(control)"
                @click="addControl(control.type)">
          <icon :icon="control.icon"/>&nbsp;{{ control.name }}
        </button>

        <!--        <button :class="[$style.theButton,$style.placeholderButton]">隐藏我</button>-->

      </draggable>
    </div>

    <div :class="$style.fillableControlSection">
      <div :class="$style.category">填值控件：</div>
      <draggable :class="$style.controlContainer"
                 :clone="addControlOnDrag"
                 :dragClass="$style.dragClass"
                 :forceFallback="true"
                 :group="{ name: 'controls', pull: 'clone', put: false }"
                 :sort="false"
                 :value="fillableControls"
                 draggable=".canDrag">

        <button v-for="control in fillableControls"
                :key="control.type"
                :class="[$style.theButton,{'canDrag':!shouldControlDisabled(control)}]"
                :disabled="shouldControlDisabled(control)"
                :title="controlTitle(control)"
                @click="addControl(control.type)">
          <icon :icon="control.icon"/>&nbsp;{{ control.name }}
        </button>

        <!--        <button :class="[$style.theButton,$style.placeholderButton]">隐藏我</button>-->

      </draggable>
    </div>
  </div>
</template>

<script>
import controlTypes from '@/common/utils/control-types';
import draggable from 'vuedraggable';
import controlFactory from '@/console/app-edit/store/control-factory';

import {createNamespacedHelpers, mapGetters} from 'vuex';
import ACTIONS from '@/console/app-edit/store/app-edit-actions';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    draggable
  },

  computed: {
    ...mapGetters([
      'isCurrentPlanExpired',
      'currentPlanName',
      'supportedControlTypes',
    ]),

    ...appEditStore.mapGetters([
      'isCurrentPageControlFull'
    ]),

    nonFillableControls() {
      return Object.values(controlTypes).filter((control) => {
        return !control.fillable;
      });
    },

    fillableControls() {
      return Object.values(controlTypes).filter((control) => {
        return control.fillable;
      });
    },

    planNotSupportedMessage() {
      if (this.isCurrentPlanExpired) {
        return `当前套餐(${this.currentPlanName})已过期，有效套餐已降为免费版，无法使用该控件，请升级或续费`;
      }
      return `当前套餐(${this.currentPlanName})无法使用该控件，请升级`;
    }
  },

  methods: {
    ...appEditStore.mapActions([
      ACTIONS.ADD_CONTROL,
    ]),

    shouldControlDisabled(control) {
      return this.isCurrentPageControlFull || this.isNotSupportedByPlan(control.type);
    },

    addControlOnDrag(control) {
      return controlFactory[control.type]();
    },

    addControl(type) {
      this[ACTIONS.ADD_CONTROL](type).then(() => {
        this.$emit("controlAdded");
      }).catch((error) => {
        this.$message({
          type: 'error',
          message: error.message ? error.message : error,
          center: true
        });
      });
    },

    controlTitle(control) {
      if (this.isCurrentPageControlFull) {
        return '当前页面控件数量已经达到最大值(20个)，无法继续添加控件';
      }

      if (this.isNotSupportedByPlan(control.type)) {
        return this.planNotSupportedMessage;
      }

      return control.title;
    },

    isNotSupportedByPlan(controlType) {
      return !this.supportedControlTypes.includes(controlType)
    },
  }
}
</script>


<style lang="scss" module>
.wrapper {
  width: 220px;
  height: 100%;
  overflow-y: auto;
  background-color: $whiteBackgroundColor;
  border-right: 1px solid rgba(50, 50, 50, .14);
}

.fillableControlSection {
  margin-top: 10px;
}

.category {
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: 500;
}

.controlContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.theButton {
  color: dimgray;
  border: 1px solid darkgray;
  outline: none;
  text-align: left;
  padding: 6px 0 6px 8px;
  margin-bottom: 12px;
  text-decoration: none;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 90px;
  background-color: white;
  font-size: 13px;
}

.theButton:disabled {
  color: $placeholderTextColor;
  cursor: not-allowed;
  border: 1px dashed $placeholderTextColor;
}

.theButton:hover {
  color: $primaryThemeColor;
  border-color: $primaryThemeColor;
  box-shadow: 0 0 2px 2px rgba(0, 191, 255, 0.06);
}

.theButton:hover:disabled {
  color: $placeholderTextColor;;
  border: 1px dashed $placeholderTextColor;
  box-shadow: none;
}

.placeholderButton {
  visibility: hidden;
}

.dragClass {
  cursor: grab !important;
}

</style>
