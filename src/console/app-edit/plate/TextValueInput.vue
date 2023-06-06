<template>
  <div :class="$style.wrapper">
    <div class="singleLineTitle">文本类型</div>
    <el-select v-model="value.type"
               :class="$style.commonInput"
               class="marginBottom10"
               placeholder="请选择文本类型"
               size="mini"
               title="文本类型"
               @change="onTypeChanged">
      <el-option
          v-for="type in textValueTypes"
          :key="type.value"
          :label="type.name"
          :value="type.value">
      </el-option>
    </el-select>

    <template v-if="value.type === 'FIXED_TEXT'">
      <div class="singleLineTitle">文本内容</div>
      <el-input v-model="value.text"
                :class="$style.commonInput"
                :maxlength="50"
                :spellcheck="false"
                class="marginBottom10"
                size="mini"
                title="固定文本内容">
      </el-input>
    </template>

    <template v-if="value.type === 'QR_PROPERTY'">
      <div class="singleLineTitle">基本属性项</div>
      <el-select v-model="value.propertyType"
                 :class="$style.commonInput"
                 class="marginBottom10"
                 placeholder="请选择基本属性项"
                 size="mini"
                 title="基本属性项">
        <el-option
            v-for="type in qrPropertyTypes"
            :key="type.value"
            :label="type.name"
            :value="type.value">
        </el-option>
      </el-select>
    </template>

    <template v-if="value.type === 'QR_ATTRIBUTE'">
      <div class="singleLineTitle">自定义属性项</div>
      <el-select v-model="value.attributeId"
                 :class="$style.commonInput"
                 class="marginBottom10"
                 placeholder="请选择自定义属性项"
                 size="mini"
                 title="自定义属性项">
        <el-option
            v-for="attr in allAttributes"
            :key="attr.id"
            :label="attr.name"
            :value="attr.id">
        </el-option>
      </el-select>
    </template>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  computed: {
    ...appEditStore.mapGetters([
      'instanceDesignation',
      'groupDesignation',
      'allAttributes',
      'qrPropertyTypes',
    ]),

    textValueTypes() {
      return [
        {
          name: '固定文本',
          value: "FIXED_TEXT"
        },

        {
          name: `${this.instanceDesignation}基本属性`,
          value: "QR_PROPERTY"
        },

        {
          name: `${this.instanceDesignation}自定义属性`,
          value: "QR_ATTRIBUTE"
        },
      ]
    },
  },

  methods: {
    onTypeChanged() {
      this.value.text = null;
      this.value.propertyType = null;
      this.value.attributeId = null;
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.commonInput {
  width: 100%;
}
</style>
