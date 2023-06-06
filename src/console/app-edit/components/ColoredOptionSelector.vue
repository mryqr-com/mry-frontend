<template>
  <div :class="$style.wrapper">
    <EditTitle>{{ selectorTitle }}</EditTitle>
    <draggable v-if="options.length > 0"
               v-model="options"
               :class="$style.theDragWrapper"
               :handle="'.' + $style.dragHandle"
               animation="200"
               tag="div">
      <div v-for="(item,index) in options"
           :key="item.id"
           :ref="item.id"
           :class="$style.optionWrapper">

        <div :class="$style.optionContent">
          <ThreeBarIcon :class="$style.dragHandle"
                        title="上下拖动移位">
          </ThreeBarIcon>

          <el-input v-model.trim="item.name"
                    :class="[{elementInputErrorBordered: $v.options.$each.$iter[index].name.$invalid },$style.option]"
                    :maxlength="10"
                    placeholder="选项名称"
                    size="mini">
          </el-input>

          <MryColorPicker v-model="item.color" :class="$style.theColorPicker" title="颜色"></MryColorPicker>

          <i v-if="options.length > min"
             :class="$style.deleteButton"
             class="el-icon-close"
             title="删除"
             @click="deleteOption(item.id)">
          </i>
        </div>

        <div v-if="$v.options.$each.$iter[index].name.$invalid"
             :class="$style.errorMessage">

          <ErrorMessage v-if="!$v.options.$each.$iter[index].name.required">
            名称不能为空
          </ErrorMessage>
        </div>
      </div>
    </draggable>

    <PlainButton
        :class="$style.addButton"
        :disabled="options.length >= max"
        @click="addOption">
      <i class="el-icon-plus"></i>&nbsp;{{ buttonText }}（{{ options.length }}/{{ max }}）
    </PlainButton>
  </div>
</template>

<script>
import {required} from 'vuelidate/lib/validators'
import draggable from 'vuedraggable';
import uuid from 'short-uuid';

export default {
  props: {
    value: {
      type: Array,
      required: true
    },

    max: {
      type: Number,
      default: 10
    },

    min: {
      type: Number,
      default: 0
    },

    buttonText: {
      type: String,
      default: '添加选项'
    },

    selectorTitle: {
      type: String,
      default: '选项'
    },
  },
  components: {
    draggable,
  },
  methods: {
    addOption() {
      if (this.options.length >= this.max) {
        this.$message({
          type: 'error',
          message: `添加失败，最大只能包含${this.max}个选项。`,
          center: true
        });
        return;
      }

      let id = uuid.generate();
      this.options.push({
        id: id,
        name: '未命名选项',
        color: null
      });

      this.$nextTick(() => {
        let theNewOption = this.$refs[id][0];
        theNewOption.scrollIntoView(false);
      });
    },

    deleteOption(id) {
      if (this.options.length <= this.min) {
        this.$message({
          type: 'error',
          message: `删除失败，至少需要包含${this.min}个选项。`,
          center: true
        });
        return;
      }

      this.options.splice(this.options.findIndex(i => i.id === id), 1);
      this.$emit('optionDeleted', id);
    }
  },
  computed: {
    options: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  validations: {
    options: {
      $each: {
        name: {
          required,
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.theDragWrapper {
  border: $primary1pxBorder;
}

.optionWrapper {
  border-bottom: $primary1pxBorder;
}

.optionWrapper:last-child {
  border-bottom: none;
}

.optionContent {
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dragHandle {
  cursor: move;
  margin-left: 10px;
}

.option {
  margin-left: 10px;
  margin-right: 10px;
}

.theColorPicker {
  margin-right: 10px;
}

.deleteButton {
  cursor: pointer;
  margin-right: 10px;
}

.deleteButton:hover {
  color: $rejectRed;
}

.addButton {
  margin-top: 10px;
}


.errorMessage {
  margin-bottom: 5px;
  margin-left: 34px;
}


</style>
