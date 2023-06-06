<template>
  <el-dialog :class="$style.wrapper"
             :destroy-on-close="true"
             :visible.sync="visible"
             title="自动计算规则设置"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)"
             @open="initDialog">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="localValue"
             :rules="rules"
             label-position="top">
      <section :class="$style.aliasSection">
        <div :class="$style.aliasNote">
          <span :class="$style.bolded">请先设置控件别名：</span>在设置计算表达式之前，您需要先为参与计算的控件添加别名，即为这些控件设置变量名以便在表达式中引用。
          设置的别名通过<span :class="$style.sampleAlias">#</span>前缀进行引用，比如某个控件的别名被设置成了
          <span :class="$style.sampleAlias">age</span>，那么在表达式中应该使用<span :class="$style.sampleAlias">#age</span>进行引用。更多关于自动计算的解释请<a
            class="primaryColoredTextLink" href="//docs.mryqr.com/page-controls/number-input/#自动计算"
            target="_blank">参考数字控件文档</a>。
        </div>

        <div id="numberInputAliasContainer" :class="$style.aliasContainer">
          <div v-for="(alias,index) in localValue.aliasContext.controlAliases" :key="alias.id" :class="$style.aliasRow">
            <el-form-item :class="$style.aliasControl"
                          :prop="'aliasContext.controlAliases.' + index + '.controlId'"
                          :rules="{ required: true, message: '控件不能为空', trigger: 'change'}"
                          title="请选择需要设置别名的控件">
              <el-select v-model="alias.controlId"
                         :class="$style.controlSelect"
                         placeholder="请选择控件"
                         size="mini">
                <el-option
                    v-for="control in selectableControls"
                    :key="control.id"
                    :label="controlFieldName(control)"
                    :value="control.id">
                </el-option>
              </el-select>
            </el-form-item>
            <span :class="$style.comma">：</span>

            <el-form-item :class="$style.aliasName"
                          :prop="'aliasContext.controlAliases.' + index + '.alias'"
                          :rules="[
                              {required: true, message: '别名不能为空', trigger: 'change'},
                              {validator: aliasRule, trigger: 'change'}
                          ]">
              <el-input v-model.trim="alias.alias"
                        :maxlength="10"
                        :spellcheck="false"
                        placeholder="请输入别名"
                        size="mini"
                        title="别名不能操作20个字符，且只能有英文字母组成"></el-input>
            </el-form-item>

            <i :class="$style.deleteButton"
               class="el-icon-close"
               title="删除"
               @click="deleteAlias(alias.id)">
            </i>
          </div>
        </div>

        <el-button :class="$style.addAliasButton"
                   icon="el-icon-plus"
                   size="mini"
                   title="添加控件别名"
                   type="plain"
                   @click="addAlias">
          添加控件别名
        </el-button>
      </section>

      <el-form-item label="计算表达式：" prop="expression">
        <el-input ref="expressionBox"
                  v-model="localValue.expression"
                  :class="$style.expressionInput"
                  :maxlength="200"
                  :spellcheck="false"
                  size="medium">
        </el-input>
      </el-form-item>
    </el-form>


    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>

      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="confirm">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

import {cloneDeep} from 'lodash-es';
import uuid from "short-uuid";
import {controlFieldName} from "@/common/utils/common-utils";

export default {
  props: {
    value: {
      type: Object,
      required: true
    },

    selectableControls: {
      type: Array,
      required: true,
    },

    show: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      visible: this.show,
      localValue: {
        aliasContext: {
          controlAliases: [],
        },
        expression: null,
      },

      rules: {
        expression: [
          {required: true, message: '请输入表达式', trigger: 'change'},
        ],
      }
    };
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    controlFieldName,
    initDialog() {
      this.localValue = cloneDeep(this.value);
    },

    addAlias() {
      if (this.localValue.aliasContext.controlAliases.length >= 20) {
        this.$message({
          type: 'error',
          message: `添加失败，最多添加20个别名。`,
          center: true,
          duration: 1000,
        });
        return;
      }
      this.localValue.aliasContext.controlAliases.push({id: uuid.generate(), controlId: null, alias: null});

      this.$nextTick(() => {
        let element = document.getElementById("numberInputAliasContainer");
        element.scrollTop = element.scrollHeight;
      });
    },

    deleteAlias(id) {
      this.localValue.aliasContext.controlAliases.splice(this.localValue.aliasContext.controlAliases.findIndex(i => i.id === id), 1);
    },

    cancel() {
      this.visible = false;
    },

    aliasRule: (rule, value, callback) => {
      if (value && /^[A-Za-z]{1,10}$/.test(value) === false) {
        callback(new Error('只能由英文字母组成'));
      } else {
        callback();
      }
    },

    confirm() {
      if (this.localValue.expression && this.localValue.aliasContext.controlAliases.length === 0) {
        this.$message({
          type: 'error',
          message: `请添加控件别名。`,
          center: true,
        });
        return;
      }

      return this.$refs['theForm'].validate().then(() => {
        this.$emit('input', this.localValue);
        this.visible = false;
      });
    },
  },
}
</script>


<style lang="scss" module>
.wrapper {
  :global {
    .el-form-item__content {
      line-height: normal !important;
    }
  }
}

.aliasSection {
  padding: 10px;
  background-color: $lightBackgroundColor;
}

.aliasNote {
  line-height: 1.5em;
  margin-bottom: 10px;
}

.bolded {
  font-weight: 500;
  color: $primaryTextColor;
}

.sampleAlias {
  color: red;
  padding-left: 2px;
  padding-right: 2px;
  font-family: monospace;
}

.aliasContainer {
  max-height: 150px;
  overflow-y: auto;
}

.aliasRow {
  display: flex;
  align-items: flex-start;
  margin-top: 5px;
}

.aliasControl {
  flex-grow: 1;
}

.comma {
  font-size: 16px;
  padding: 6px 0;
}

.controlSelect {
  width: 100%;
}

.aliasName {
  flex-grow: 0;

  :global {
    .el-input__inner {
      font-family: monospace !important;
    }
  }
}

.deleteButton {
  flex-grow: 0;
  cursor: pointer;
  font-size: 16px;
  padding: 6px 15px 6px 6px;
}

.deleteButton:hover {
  color: $rejectRed;
}

.addAliasButton {
  margin-top: 5px;
}

.expressionInput {
  width: 100%;

  :global {
    .el-input__inner {
      font-family: monospace !important;
    }
  }
}

.footerButton {
  width: $dialogButtonWidth;
}
</style>

