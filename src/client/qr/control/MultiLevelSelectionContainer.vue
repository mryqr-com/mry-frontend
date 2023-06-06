<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">

      <ClientDropdown v-if="control.totalLevel > 0"
                      v-model="answer.selection.level1"
                      :filterable="control.filterable"
                      :options="currentSelectableLevel1Options"
                      :placeholder="control.titles[0]"
                      :viewOnly="viewOnly"
                      keyField="name"
                      labelField="name"
                      valueField="name"
                      @change="onLevel1Change">
      </ClientDropdown>

      <ClientDropdown v-if="control.totalLevel > 1"
                      v-model="answer.selection.level2"
                      :class="$style.hasMarginTop"
                      :filterable="control.filterable"
                      :options="currentSelectableLevel2Options"
                      :placeholder="control.titles[1]"
                      :viewOnly="viewOnly"
                      keyField="name"
                      labelField="name"
                      valueField="name"
                      @change="onLevel2Change">
      </ClientDropdown>

      <ClientDropdown v-if="control.totalLevel > 2"
                      v-model="answer.selection.level3"
                      :class="$style.hasMarginTop"
                      :filterable="control.filterable"
                      :options="currentSelectableLevel3Options"
                      :placeholder="control.titles[2]"
                      :viewOnly="viewOnly"
                      keyField="name"
                      labelField="name"
                      valueField="name"
                      @change="onLevel3Change">
      </ClientDropdown>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage>
              请完成该项
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>

      <div v-if="control.totalLevel === 0" :class="$style.noOptionTip">
        无可选数据项
      </div>

    </div>
  </ControlWrapper>

</template>

<script>

import eventBus from "@/common/utils/event-bus";

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  methods: {
    isComplete() {
      if (this.control.fillableSetting.mandatory) {
        return this.isValid();
      }

      return this.isValid() || this.isNotFilled;
    },

    isValid() {
      return this.isLevel1Valid() &&
          this.isLevel2Valid() &&
          this.isLevel3Valid();
    },

    isLevel1Valid() {
      if (this.control.totalLevel <= 0) {
        return true;
      }

      return !!this.answer.selection.level1;
    },

    isLevel2Valid() {
      if (this.control.totalLevel <= 1) {
        return true;
      }

      return !(!this.answer.selection.level2 && this.currentSelectableLevel2Options.length > 0);
    },

    isLevel3Valid() {
      if (this.control.totalLevel <= 2) {
        return true;
      }
      return !(!this.answer.selection.level3 && this.currentSelectableLevel3Options.length > 0);
    },

    onLevel1Change() {
      this.answer.selection.level2 = null;
      this.answer.selection.level3 = null;
      this.emitChanged();
    },

    onLevel2Change() {
      this.answer.selection.level3 = null;
      this.emitChanged();
    },

    onLevel3Change() {
      this.emitChanged();
    },

    emitChanged() {
      if (this.isComplete()) {
        eventBus.$emit('answerChanged', this.control.id);
      }
    }

  },

  computed: {
    isNotFilled() {
      return !this.answer.selection.level1 &&
          !this.answer.selection.level2 &&
          !this.answer.selection.level3;
    },

    currentSelectableLevel1Options() {
      if (!this.control.option || !this.control.option.options) {
        return [];
      }

      return this.control.option.options.map(option => {
        return {name: option.name}
      });
    },

    currentSelectableLevel2Options() {
      if (!this.answer.selection.level1 || !this.control.option || !this.control.option.options) {
        return [];
      }

      let currentLevel1 = this.control.option.options.find(option => option.name === this.answer.selection.level1);

      if (!(currentLevel1 && currentLevel1.options)) {
        return [];
      }

      return currentLevel1.options.map(option => ({name: option.name}))
    },

    currentSelectableLevel3Options() {
      if (!this.answer.selection.level1 || !this.answer.selection.level2 || !this.control.option || !this.control.option.options) {
        return [];
      }

      let currentLevel1 = this.control.option.options.find(option => option.name === this.answer.selection.level1);

      if (!(currentLevel1 && currentLevel1.options)) {
        return [];
      }

      let currentLevel2 = currentLevel1.options.find(option => option.name === this.answer.selection.level2);
      if (!(currentLevel2 && currentLevel2.options)) {
        return [];
      }

      return currentLevel2.options.map(option => ({name: option.name}));
    },

    hasError() {
      return this.$v.answer.$dirty && this.$v.answer.$invalid;
    },

  },

  validations() {
    return {
      answer: {
        complete: () => this.isComplete(),
      }
    }
  }

}
</script>

<style lang="scss" module>
.contentWrapper {
}

.viewOnlyControl {
  pointer-events: none;
}

.hasMarginTop {
  margin-top: 6px;
}

.noOptionTip {
  color: $oppositeThemeColor;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .contentWrapper {
    max-width: $maxControlButtonWidth;
  }
}
</style>
