<template>
  <div :class="$style.wrapper">
    <EditTitle>选项</EditTitle>
    <draggable v-model="options"
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

          <el-input
              v-model="item.name"
              :class="[{elementInputErrorBordered: $v.options.$each.$iter[index].name.$invalid },$style.option]"
              :maxlength="50"
              placeholder="名称"
              size="mini"
              title="选项名称">
          </el-input>

          <i v-if="options.length > 2"
             :class="$style.deleteButton"
             class="el-icon-close"
             title="删除"
             @click="deleteOption(item.id)">
          </i>

        </div>

        <div v-if="$v.options.$each.$iter[index].name.$invalid"
             :class="$style.errorMessage">

          <ErrorMessage v-if="!$v.options.$each.$iter[index].name.required">
            选项文本不能为空
          </ErrorMessage>

        </div>
      </div>
    </draggable>

    <PlainButton
        :class="$style.addButton"
        :disabled="options.length >= max"
        @click="addOption">
      <i class="el-icon-plus"></i>&nbsp;添加选项（{{ options.length }}/{{ max }}）
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
      default: 20
    }
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
        numericalValue: 0,
      });

      this.$nextTick(() => {
        let theNewOption = this.$refs[id][0];
        theNewOption.scrollIntoView(false);
      });
    },
    deleteOption(id) {
      if (this.options.length <= 2) {
        this.$message({
          type: 'error',
          message: "删除失败，至少需要包含2个选项。",
          center: true
        });
        return;
      }

      this.options.splice(this.options.findIndex(i => i.id === id), 1);
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
  max-height: 40vh;
  overflow-y: auto;
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

.deleteButton {
  cursor: pointer;
  margin-right: 15px;
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
