<template>
  <div :class="$style.wrapper">
    <el-collapse v-if="localTextValues.length > 0"
                 v-model="activeName"
                 :class="$style.theCollapse"
                 accordion>
      <draggable v-model="localTextValues"
                 :class="$style.theDragWrapper"
                 :handle="'.' + $style.dragHandle"
                 animation="200"
                 tag="div">
        <el-collapse-item v-for="(textValue,index) in localTextValues"
                          :key="textValue.id"
                          :ref="textValue.id"
                          :class="$style.optionWrapper"
                          :name="textValue.id">
          <template slot="title">
            <div :class="$style.textValueTitle">
              <div :class="$style.textValueName">
                <ThreeBarIcon :class="$style.dragHandle"
                              title="上下拖动移位">
                </ThreeBarIcon>
                <div :class="$style.textValueNameText">
                  {{ textValue.name }}
                </div>
              </div>

              <i v-if="localTextValues.length  > 1"
                 :class="$style.deleteButton"
                 class="el-icon-close"
                 title="删除"
                 @click.self="deleteTextValue(textValue.id)">
              </i>
            </div>
          </template>

          <div :class="$style.opsArea">
            <div class="singleLineTitle">名称</div>
            <div class="marginBottom10">
              <el-input
                  v-model="textValue.name"
                  :class="[{elementInputErrorBordered: $v.localTextValues.$each.$iter[index].name.$invalid }]"
                  :maxlength="10"
                  size="mini">
              </el-input>

              <div v-if="$v.localTextValues.$each.$iter[index].name.$invalid"
                   :class="$style.errorMessage">
                <ErrorMessage v-if="!$v.localTextValues.$each.$iter[index].name.required">
                  名称不能为空
                </ErrorMessage>
              </div>
            </div>

            <TextValueInput v-model="textValue.value" class="marginTop10"></TextValueInput>
          </div>
        </el-collapse-item>
      </draggable>
    </el-collapse>

    <PlainButton :disabled="localTextValues.length >= maxItems"
                 @click="addTextValue">
      <i class="el-icon-plus"></i>&nbsp;添加单元行（{{ localTextValues.length }}/{{ maxItems }}）
    </PlainButton>

  </div>
</template>

<script>
import {required} from 'vuelidate/lib/validators'
import draggable from 'vuedraggable';
import uuid from 'short-uuid';
import TextValueInput from '@/console/app-edit/plate/TextValueInput';

export default {
  props: {
    value: {
      type: Array,
      required: true
    },

    maxItems: {
      type: Number,
      default: 10
    },

  },

  data() {
    return {
      activeName: null,
    }
  },

  components: {
    draggable,
    TextValueInput,
  },

  methods: {
    addTextValue() {
      let id = uuid.generate();
      this.localTextValues.push({
        id: id,
        name: '未命名',
        value: {
          type: 'FIXED_TEXT',
          text: null,
          attributeId: null,
          propertyType: null,
        }
      });
      this.activeName = id;
    },

    deleteTextValue(id) {
      if (this.localTextValues.length <= 1) {
        this.$message({
          type: 'error',
          message: "删除失败，至少需要包含1行数据。",
          center: true
        });
        return;
      }

      this.localTextValues.splice(this.localTextValues.findIndex(i => i.id === id), 1);
    }
  },

  computed: {
    localTextValues: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },

  validations: {
    localTextValues: {
      $each: {
        name: {
          required,
        },
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.theCollapse {
  margin-bottom: 10px;

  :global {
    .el-collapse-item__arrow {
      display: none;
    }

    .el-collapse-item__content {
      padding-bottom: 10px;
    }
  }
}

.theDragWrapper {
  max-height: 40vh;
  overflow-y: auto;
  border-left: $primary1pxBorder;
  border-right: $primary1pxBorder;
}

.dragHandle {
  cursor: move;
  margin-right: 15px;
  margin-left: 10px;
}

.optionWrapper:last-child {
  :global {
    .el-collapse-item__header {
      border-bottom-width: 0;
    }

    .el-collapse-item__wrap {
      border-bottom-width: 0;
    }
  }
}

.optionWrapper {
  :global {
    .el-collapse-item__content {
      padding-left: 15px;
      padding-bottom: 15px;
    }
  }
}

.textValueTitle {
  width: 100%;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.textValueName {
  display: flex;
  align-items: center;
}

.textValueNameText {
  line-height: normal;
  font-weight: normal;
}

.deleteButton {
  cursor: pointer;
  margin-right: 15px;
}

.deleteButton:hover {
  color: $rejectRed;
}

.opsArea {
  margin-left: 10px;
  margin-right: 10px;
}

</style>
