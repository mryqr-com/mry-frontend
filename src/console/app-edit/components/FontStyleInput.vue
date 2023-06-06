<template>
  <div :class="$style.wrapper">
    <el-select
        v-model="value.fontFamily"
        class="marginRight5"
        placeholder="请选择字体"
        size="mini"
        title="字体">
      <el-option
          v-for="fontFamily in fontFamilies"
          :key="fontFamily.key"
          :label="fontFamily.key"
          :value="fontFamily.key">
        <span :style="fontStyle(fontFamily.value)">{{ fontFamily.key }}</span>
      </el-option>
    </el-select>

    <el-select v-model="value.fontSize"
               class="marginRight5"
               placeholder="请选择字号"
               size="mini"
               title="字号">
      <el-option v-for="fontSize in fontRange"
                 :key="fontSize"
                 :label="fontSize"
                 :value="fontSize">
      </el-option>
    </el-select>

    <div :class="$style.textCheckbox" class="marginRight5">
      <el-checkbox v-model="value.bold"
                   border
                   label="B"
                   size="mini"
                   title="加粗">
      </el-checkbox>
    </div>

    <div :class="$style.textCheckbox" class="marginRight5">
      <el-checkbox v-model="value.italic"
                   :class="$style.italic"
                   border
                   label="I"
                   size="mini"
                   title="斜体">
      </el-checkbox>
    </div>

    <MryColorPicker v-model="value.color" title="字体颜色"></MryColorPicker>
  </div>
</template>

<script>
import {range} from 'lodash-es';
import fonts from '@/common/utils/fonts';

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  methods: {
    fontStyle(value) {
      return {
        fontFamily: value,
      }
    }
  },

  computed: {
    fontRange() {
      return range(5, 81);
    },

    fontFamilies() {
      return fonts;
    }
  },

}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  justify-content: space-between;

  :global {
    .el-checkbox__inner {
      display: none;
    }

    .el-checkbox__input {
      display: none;
    }
  }
}

.textCheckbox {
  :global {
    .el-checkbox--mini {
      padding: 0 !important;
      min-width: 28px;
      display: table;
      text-align: center;
    }

    .el-checkbox__label {
      padding: 0;
      display: table-cell;
      vertical-align: middle;
      font-size: 14px !important;
      font-weight: bold;
    }
  }
}

.italic {
  font-style: italic;
}

</style>
