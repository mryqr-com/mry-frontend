<template>
  <ControlWrapper :control="control" :index="index">
    <div v-if="viewOnly && answer.items.length ===0">无数据</div>

    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <div v-for="(item,index) in answer.items"
           :key="item.id"
           :class="$style.itemWrapper">

        <i v-if="!viewOnly"
           :class="$style.deleteButton"
           class="majoricon i-close"
           title="删除"
           @click="deleteItem(item.id)">
        </i>

        <ClientDropdown
            v-model="item.optionId"
            :class="[$style.theDropdown,{inputErrorBordered: dropDownHasError(index),elementInputErrorBordered:dropDownHasError(index)}]"
            :filterable="true"
            :options="control.options"
            :viewOnly="viewOnly"
            key-field="id"
            label-field="name"
            value-field="id"
            @change="onChange">
        </ClientDropdown>

        <el-input-number v-model="item.number"
                         :class="$style.numberInput"
                         :max="control.maxNumberPerItem"
                         :min="1"
                         @change="onChange">
        </el-input-number>
      </div>

      <StyledButton v-if="!viewOnly && answer.items.length < control.maxItem"
                    :buttonStyle="control.buttonStyle"
                    :class="$style.addButton"
                    :disabled="answer.items.length >= control.maxItem"
                    @click="addItem">
        <i class="majoricon i-plus"></i>&nbsp;{{ buttonText }}（{{ answer.items.length }}/{{ control.maxItem }}）
      </StyledButton>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage v-if="hasRequiredError">
              请填写该项
            </ErrorMessage>

            <ErrorMessage v-if="hasEmptyError">
              请填写完整
            </ErrorMessage>

            <ErrorMessage v-if="hasCountError">
              最多只能选择{{ control.maxItem }}项
            </ErrorMessage>

            <ErrorMessage v-if="hasDuplicateError">
              选项不能重复
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>
    </div>
  </ControlWrapper>

</template>

<script>
import {required, requiredIf} from 'vuelidate/lib/validators'
import uuid from 'short-uuid';
import eventBus from "@/common/utils/event-bus";

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  methods: {
    onChange() {
      if (!this.$v.answer.items.$invalid) {
        eventBus.$emit('answerChanged', this.control.id);
      }
    },

    dropDownHasError(index) {
      return this.$v.answer.items.$dirty
          && this.$v.answer.items.$each.$iter[index].optionId.$invalid
    },

    addItem() {
      if (this.answer.items.length >= this.control.maxItem) {
        this.$message({
          type: 'error',
          message: `添加失败，最多只能添加${this.control.maxItem}个项目。`,
          center: true,
          duration: 1000,
        });
        return;
      }

      let id = uuid.generate();
      this.answer.items.push({
        id: id,
        optionId: null,
        number: 1,
      });
    },

    deleteItem(id) {
      this.answer.items.splice(this.answer.items.findIndex(i => i.id === id), 1);
    },

    isCountValid(items) {
      return items.length <= this.control.maxItem;
    },

    isDuplicateValid(items) {
      let hasOptionItems = items.filter(item => !!item.optionId);
      let deduplicated = new Set(hasOptionItems.map(item => item.optionId));
      return hasOptionItems.length === deduplicated.size;
    }
  },

  computed: {
    buttonText() {
      return this.control.buttonText ? this.control.buttonText : '新增';
    },

    hasError() {
      return this.$v.answer.items.$dirty && this.$v.answer.items.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.items.$dirty && !this.$v.answer.items.required;
    },

    hasEmptyError() {
      return this.$v.answer.items.$dirty && this.$v.answer.items.$each.$error;
    },

    hasCountError() {
      return this.$v.answer.items.$dirty && !this.$v.answer.items.countValid;
    },

    hasDuplicateError() {
      return this.$v.answer.items.$dirty && !this.$v.answer.items.duplicateValid;
    },

  },

  validations() {
    return {
      answer: {
        items: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          $each: {
            optionId: {
              required,
            }
          },
          countValid: (items) => this.isCountValid(items),
          duplicateValid: (items) => this.isDuplicateValid(items),
        }
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

.itemWrapper {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.deleteButton {
  cursor: pointer;
  font-size: 20px;
  margin-right: 8px;
  color: $placeholderTextColor;
}

.deleteButton:hover {
  color: $primaryThemeColor
}

.theDropdown {
  flex-grow: 1;
  margin-right: 8px;
}


.numberInput {
  flex-basis: 140px;

  :global {
    .el-input__inner {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}

@media (min-width: $mobileScreenBreakpoint), print {
  .contentWrapper {
    max-width: $maxControlContentWidth;
  }

  .numberInput {
    flex-basis: 150px;
  }

  .addButton {
    width: $maxControlInputWidth !important;
  }
}

</style>
