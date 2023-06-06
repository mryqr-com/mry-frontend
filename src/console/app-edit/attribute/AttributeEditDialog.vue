<template>
  <el-dialog :title="isNew? '新建属性':'编辑属性'"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="internalAttribute"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item ref="name-item" label="属性名称：" prop="name">
        <el-input ref="nameBox"
                  v-model.trim="internalAttribute.name"
                  :class="$style.fieldInput"
                  :maxlength="10"
                  :spellcheck="false"
                  size="medium"
                  title="属性名称">
        </el-input>
      </el-form-item>

      <el-form-item ref="type-item" label="属性类型：" prop="type">
        <el-select v-model="internalAttribute.type"
                   :class="$style.fieldInput"
                   :disabled="!isNew"
                   :title="!isNew?'属性创建后，类型无法修改':'属性类型'"
                   size="medium"
                   @change="onAttributeTypeChange()">
          <el-option-group
              v-for="type in attributeTypesMetadataCatalog"
              :key="type.label"
              :label="type.label">
            <el-option
                v-for="option in type.options"
                :key="option.type"
                :label="option.text"
                :value="option.type">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

      <template v-if="internalAttribute.type === 'FIXED'">
        <el-form-item ref="fixed-value-item" label="固定值：" prop="fixedValue">
          <el-input v-model="internalAttribute.fixedValue"
                    :maxlength="100"
                    :spellcheck="false"
                    size="medium">
          </el-input>
        </el-form-item>
      </template>

      <template v-if="internalAttribute.type === 'DIRECT_INPUT'">
        <el-form-item ref="value-type-item" label="数据类型：" prop="valueType">
          <el-select v-model="internalAttribute.valueType"
                     :class="$style.fieldInput"
                     :disabled="!isNew"
                     :title="!isNew?'属性创建后，数据类型无法修改':'数据类型'"
                     size="medium">
            <el-option
                v-for="valueType in directInputValueTypes"
                :key="valueType.key"
                :label="valueType.name"
                :value="valueType.key">
            </el-option>
          </el-select>
        </el-form-item>

        <template v-if="internalAttribute.valueType === 'DOUBLE_VALUE'">
          <el-form-item ref="suffix-item" label="后缀：" prop="suffix">
            <el-input ref="suffixBox"
                      v-model.trim="internalAttribute.suffix"
                      :class="$style.fieldInput"
                      :maxlength="10"
                      :spellcheck="false"
                      size="medium">
            </el-input>
          </el-form-item>

          <el-form-item ref="precision-item" label="最多保留小数位：" prop="precision">
            <el-input-number v-model="internalAttribute.precision"
                             :class="[$style.fieldInput,$style.precisionInput]"
                             :max="3"
                             :min="0"
                             :stepStrictly="true"
                             controls-position="right"
                             size="medium"
                             title="最多保留小数位">
            </el-input-number>
          </el-form-item>
        </template>

        <el-form-item ref="manual-input-item"
                      :class="$style.checkboxFormItem"
                      :title="`勾选后，可以从${instanceDesignation}的基本信息编辑页面进行填写，否则只能通过调用码如云API的方式填写`"
                      prop="manualInput">
          <el-checkbox v-model="internalAttribute.manualInput" size="medium">
            可在{{ instanceDesignation }}的基本信息编辑页面进行填写
          </el-checkbox>
        </el-form-item>
      </template>

      <template v-if="currentAttributeTypeMetadata.pageAware">
        <el-form-item ref="page-id-item" label="页面：" prop="pageId">
          <el-select v-model="internalAttribute.pageId"
                     :class="$style.fieldInput"
                     :disabled="!isNew"
                     :title="!isNew?'属性创建后，页面无法修改':'属性所引用的页面'"
                     size="medium"
                     @change="onPageSelectionChange()">
            <el-option
                v-for="page in allPageSummaries"
                :key="page.id"
                :label="page.name"
                :value="page.id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="currentAttributeTypeMetadata.controlAware">
        <el-form-item ref="control-id-item" label="控件：" prop="controlId">
          <el-select v-model="internalAttribute.controlId"
                     :class="$style.fieldInput"
                     :disabled="!isNew"
                     :title="!isNew?'属性创建后，控件无法修改':'属性所引用的控件'"
                     size="medium">
            <el-option
                v-for="control in allAttributeReferencableControls(internalAttribute.pageId,internalAttribute.type)"
                :key="control.id"
                :label="controlFieldName(control)"
                :value="control.id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item v-show="currentAttributeTypeMetadata.rangeAware" ref="range-item" label="统计时间范围：" prop="range">
        <el-select v-model="internalAttribute.range"
                   :class="$style.fieldInput"
                   :disabled="!isNew"
                   :title="!isNew?'属性创建后，时间范围无法修改':'统计时间范围'"
                   size="medium">
          <el-option
              v-for="range in ranges"
              :key="range.key"
              :label="range.name"
              :value="range.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="summary-eligible-item"
                    :class="$style.checkboxFormItem"
                    :title="`是否在电脑端${instanceDesignation}列表中显示该字段`"
                    prop="pcListEligible">
        <el-checkbox v-model="internalAttribute.pcListEligible" size="medium">
          显示在电脑端{{ instanceDesignation }}列表中
        </el-checkbox>
      </el-form-item>

      <el-form-item ref="summary-eligible-item"
                    :class="$style.checkboxFormItem"
                    :title="`是否在手机端${instanceDesignation}列表中显示该字段`"
                    prop="mobileListEligible">
        <el-checkbox v-model="internalAttribute.mobileListEligible" size="medium">
          显示在手机端{{ instanceDesignation }}列表中
        </el-checkbox>
      </el-form-item>

      <el-form-item v-if="shouldShowKanbanCheckbox"
                    ref="kanban-eligible-item"
                    :class="$style.checkboxFormItem"
                    :title="`选中后，可以在手机端的应用首页显示为状态看板`"
                    prop="kanbanEligible">
        <el-checkbox v-model="internalAttribute.kanbanEligible" size="medium">
          在状态看板中显示
        </el-checkbox>
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
                 @click="onSubmit">
        确定
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {cloneDeep} from 'lodash-es';
import {controlFieldName} from "@/common/utils/common-utils";

import validations from '@/common/utils/validations';
import ranges from '@/console/app-edit/attribute/attribute-statistic-ranges';
import kanbanValueTypes from '@/common/utils/kanban-value-types';
import controlTypes from '@/common/utils/control-types';

const {mapState, mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    attribute: {
      type: Object,
      required: true
    },

    isNew: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    show(val) {
      this.visible = val;
    }
  },

  data() {
    return {
      visible: this.show,
      internalAttribute: {},
      rules: {
        name: [
          {required: true, message: '请输入属性名称', trigger: 'change'},
          {max: 10, message: '名称不能超过10个字符', trigger: 'change'},
          {validator: validations.NO_SPACE_RULE, trigger: 'change'},
          {validator: this.noDuplicatedName, trigger: 'change'}
        ],

        type: [
          {required: true, message: '属性类型不能为空', trigger: 'change'},
        ],

        valueType: [
          {required: true, message: '数据类型不能为空', trigger: 'change'},
        ],

        fixedValue: [
          {validator: this.fixedValueValidator, trigger: 'change'}
        ],

        pageId: [
          {validator: this.pageIdValidator, trigger: 'change'}
        ],

        controlId: [
          {validator: this.controlIdValidator, trigger: 'change'}
        ],

        range: [
          {validator: this.rangeValidator, trigger: 'change'}
        ],

      }
    }
  },

  computed: {
    ...mapGetters([
      'instanceDesignation',
      'groupDesignation',
      'allPageSummaries',
      'allAttributes',
      'allAttributeReferencableControls',
      'attributeTypesMetadataCatalog',
      'allAttributeTypesMetadata',
      'controlTypeOf',
    ]),

    currentAttributeTypeMetadata() {
      let type = this.allAttributeTypesMetadata.find(it => {
        return it.type === this.internalAttribute.type;
      });
      return type ? type : {};
    },

    ranges() {
      return ranges;
    },

    directInputValueTypes() {
      return [
        {
          key: 'TEXT_VALUE',
          name: "文本"
        },
        {
          key: 'DOUBLE_VALUE',
          name: "数字"
        },
      ]
    },

    shouldShowKanbanCheckbox() {
      if (this.internalAttribute.type === 'INSTANCE_CIRCULATION_STATUS') {
        return true;
      }

      if (!this.internalAttribute.controlId) {
        return false;
      }

      let controlType = this.controlTypeOf(this.internalAttribute.controlId);
      return kanbanValueTypes.includes(controlTypes[controlType].answerValueType);
    },
  },

  methods: {
    controlFieldName,
    noDuplicatedName(rule, value, callback) {
      let isDuplicated = this.allAttributes.filter(item => {
        return item.name === value && item.id !== this.internalAttribute.id;
      }).length > 0;

      if (isDuplicated) {
        callback(new Error('名称已被占用'));
      } else {
        callback();
      }
    },

    fixedValueValidator(rule, value, callback) {
      if (this.internalAttribute.type === 'FIXED' && !value) {
        callback(new Error('固定值不能为空'));
      } else {
        callback();
      }
    },

    pageIdValidator(rule, value, callback) {
      if (this.currentAttributeTypeMetadata.pageAware && !value) {
        callback(new Error('页面不能为空'));
      } else {
        callback();
      }
    },

    controlIdValidator(rule, value, callback) {
      if (this.currentAttributeTypeMetadata.controlAware && !value) {
        callback(new Error('控件不能为空'));
      } else {
        callback();
      }
    },

    rangeValidator(rule, value, callback) {
      if (this.currentAttributeTypeMetadata.rangeAware && !value) {
        callback(new Error('统计时间范围不能为空'));
      } else {
        callback();
      }
    },

    onAttributeTypeChange() {
      this.internalAttribute.fixedValue = null;
      this.internalAttribute.pageId = null;
      this.internalAttribute.controlId = null;
      this.internalAttribute.range = null;
      this.$nextTick(() => {
        if (this.$refs['fixed-value-item']) this.$refs['fixed-value-item'].clearValidate();
        if (this.$refs['page-id-item']) this.$refs['page-id-item'].clearValidate();
        if (this.$refs['control-id-item']) this.$refs['control-id-item'].clearValidate();
      });
    },

    onPageSelectionChange() {
      this.internalAttribute.controlId = null;
      this.$nextTick(() => {
        if (this.$refs['control-id-item']) this.$refs['control-id-item'].clearValidate();
      });
    },


    initDialog() {
      this.internalAttribute = cloneDeep(this.attribute);
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      this.$refs['theForm'].validate().then(() => {
        this.$emit("updated", this.internalAttribute);
        this.visible = false;
      }).catch(e => {
      });
    },

    cancel() {
      this.visible = false;
    }

  },
}
</script>


<style lang="scss" module>
.wrapper {
}

.fieldInput {
  width: 100%;
}

.precisionInput {
  :global {
    .el-input__inner {
      text-align: left;
    }
  }
}

.checkboxFormItem {
  margin-bottom: 0;

  :global {
    .el-form-item__content {
      line-height: 30px;
    }
  }
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>
